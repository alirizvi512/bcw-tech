import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Winner } from "./entities/winner.entity";
import { Donation } from "../donations/entities/donation.entity";
import { User } from "../users/entities/user.entity";
import crypto from "node:crypto";
import { DeepPartial } from "typeorm";

// ethers v6
import { ethers } from "ethers";
import { getEthUsd } from "../utils/price";
import { EmailService } from "../common/email.service";

@Injectable()
export class WinnersService {
    private readonly logger = new Logger(WinnersService.name);
    private provider: ethers.JsonRpcProvider;
    private rewardSigner: ethers.Wallet;

    constructor(
        @InjectRepository(Winner) private winners: Repository<Winner>,
        @InjectRepository(Donation) private donations: Repository<Donation>,
        @InjectRepository(User) private users: Repository<User>,
        private readonly emailService: EmailService
    ) {
        const rpc = process.env.RPC_URL!;
        const rewardPk = process.env.REWARD_PRIVATE_KEY!;
        if (!rpc || !rewardPk) {
            throw new Error("Missing env: SEPOLIA_RPC / REWARD_PRIVATE_KEY");
        }

        this.provider = new ethers.JsonRpcProvider(rpc);
        this.rewardSigner = new ethers.Wallet(rewardPk, this.provider);
    }

    private weekKey(date = new Date()): string {
        const first = new Date(date.getFullYear(), 0, 1);
        const diff = (date.getTime() - first.getTime()) / 86400000;
        const week = Math.ceil((diff + first.getDay() + 1) / 7);
        return `${date.getFullYear()}-${week}`;
    }

    /**
     * Picks a weekly winner and immediately sends ETH reward = 2x donated amount (wei).
     * Assumes Donation.amountWei (or Donation.amount) is stored as an integer in wei.
     */
    async runWeeklyDraw() {
        const week = this.weekKey();

        this.logger.log("Exclude users who have already won");
        const prevWinners = await this.winners.find({ relations: ["user"] });
        const excluded = new Set(prevWinners.map(w => w.user.wallet.toLowerCase()));

        this.logger.log("Only confirmed donations are eligible");
        const eligible = await this.donations.find({ where: { confirmed: true }, relations: ["user"] });
        const pool = eligible.filter(d => d.user?.wallet && !excluded.has(d.user.wallet.toLowerCase()));

        if (pool.length === 0) {
            return { ok: false, reason: "no-eligible" };
        }

        this.logger.log("Pick random donation");
        const idx = crypto.randomInt(0, pool.length);
        const donation = pool[idx];

        const rawWei = donation.amountWei ?? "0";
        const amountWei: bigint = typeof rawWei === "bigint" ? rawWei : BigInt(String(rawWei));
        if (amountWei <= 0n) {
            return { ok: false, reason: "picked-donation-amount-invalid", donationId: donation.id };
        }

        const rawUsdCents = donation.amountInUSD ?? "0";
        const usdCentsAtDonation: bigint =
            typeof rawUsdCents === "bigint" ? rawUsdCents : BigInt(String(rawUsdCents));

        let rewardWei: bigint;

        if (usdCentsAtDonation > 0n) {
            this.logger.log("Calculating Reward");
            const FEED = process.env.CL_ETHUSD_ADDRESS!;
            const { price: curPrice, decimals: curDec } = await getEthUsd(this.provider, FEED);
            const targetUsdCents = usdCentsAtDonation * 2n;
            rewardWei =
                (targetUsdCents * (10n ** BigInt(curDec)) * (10n ** 18n)) /
                (curPrice * 100n);

            if (rewardWei <= 0n) rewardWei = amountWei * 2n;
        } else {
            rewardWei = amountWei * 2n;
        }
        this.logger.log("Inserting Winner");
        let winner = this.winners.create({
            user: donation.user,
            donation,
            week,
            claimed: false,
            rewardAmountWei: rewardWei.toString(),
            rewardStatus: "pending",
        } as DeepPartial<Winner>);
        winner = await this.winners.save(winner);

        this.logger.log("Checking balance and sending transaction");
        const rewarderAddr = await this.rewardSigner.getAddress();
        const bal: bigint = await this.provider.getBalance(rewarderAddr);
        const GAS_BUFFER = ethers.parseUnits("0.0002", "ether"); // adjust if needed
        if (bal < rewardWei + GAS_BUFFER) {
            winner.rewardStatus = "failed";
            winner.rewardError =
                `Insufficient ETH. Need >= reward + gas buffer. have=${bal.toString()} need=${(rewardWei + GAS_BUFFER).toString()}`;
            await this.winners.save(winner);
            return { ok: false, reason: "insufficient-reward-balance", winnerId: winner.id };
        }

        try {
            // Send ETH
            const to = donation.user.wallet;
            const tx = await this.rewardSigner.sendTransaction({ to, value: rewardWei });
            const rcpt = await tx.wait();

            winner.rewardStatus = "paid";
            winner.rewardTxHash = rcpt ? rcpt.hash : "";
            winner.claimed = true;
            await this.winners.save(winner);
            if (donation.user.email) {
                await this.emailService.sendEmailToWinner(donation.user.email, rewardWei.toString())
            }

            return {
                ok: true,
                winnerId: winner.id,
                wallet: to,
                donationId: donation.id,
                rewardWei: rewardWei.toString(),
                txHash: rcpt?.hash,
            };
        } catch (err: any) {
            winner.rewardStatus = "failed";
            winner.rewardError = String(err?.message ?? err);
            await this.winners.save(winner);

            return {
                ok: false,
                reason: "transfer-failed",
                winnerId: winner.id,
                error: String(err?.message ?? err),
            };
        }
    }
}
