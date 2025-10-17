import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Donation } from "./entities/donation.entity";
import { User } from "../users/entities/user.entity";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { ethers } from "ethers";
import { getEthUsd } from "../utils/price";

const FEED = process.env.CL_ETHUSD_ADDRESS!;

@Injectable()
export class DonationsService {
    constructor(
        @InjectRepository(Donation) private readonly donations: Repository<Donation>,
        @InjectRepository(User) private readonly users: Repository<User>
    ) { }

    private provider() {
        const rpc = process.env.RPC_URL!;
        return new ethers.JsonRpcProvider(rpc, Number(process.env.CHAIN_ID ?? 11155111));
    }

    async recordDonation(dto: CreateDonationDto) {
        if (!/^0x([A-Fa-f0-9]{64})$/.test(dto.txHash)) {
            throw new BadRequestException("Invalid tx hash");
        }
        const wallet = ethers.getAddress(dto.wallet);

        const provider = this.provider();
        const tx = await provider.getTransaction(dto.txHash);
        if (!tx) throw new BadRequestException("Transaction not found");
        const receipt = await provider.getTransactionReceipt(dto.txHash);
        if (!receipt) throw new BadRequestException("Transaction not yet mined");

        const latest = await provider.getBlockNumber();
        // const conf = Number(process.env.CONFIRMATIONS ?? 2);
        // if (latest - (receipt.blockNumber ?? latest) < conf) {
        //     throw new BadRequestException(`Require ${conf} confirmations`);
        // }

        const expectedTo = (process.env.DONATION_CONTRACT || "").toLowerCase();
        if (expectedTo && tx.to && tx.to.toLowerCase() !== expectedTo) {
            throw new BadRequestException("Tx not sent to Donation contract");
        }

        if (ethers.getAddress(tx.from) !== wallet) {
            throw new BadRequestException("Sender wallet mismatch");
        }

        if (receipt.status !== 1) {
            throw new BadRequestException("Transaction failed");
        }

        let user = await this.users.findOne({ where: { wallet } });
        if (!user) {
            user = this.users.create({ wallet, email: dto.email?.trim() || null });
            await this.users.save(user);
        } else if (dto.email && dto.email !== user.email) {
            user.email = dto.email;
            await this.users.save(user);
        }
        const amountWei = BigInt(tx.value?.toString() ?? "0n");
        const { price, decimals } = await getEthUsd(provider, FEED);
        const usdCentsAtDonation =
            (amountWei * price * 100n) / (10n ** BigInt(decimals)) / (10n ** 18n);
        console.log({
            user: user,
            txHash: dto.txHash,
            amountWei: amountWei.toString(),
            amountInUSD: usdCentsAtDonation.toString(),
            ethUsdPriceAtDonation: price.toString(),
            ethUsdPriceDecimals: decimals,
            tokenSymbol: "ETH",
            network: "sepolia",
            confirmed: true
        })
        const donation = this.donations.create({
            user: user,
            txHash: dto.txHash,
            amountWei: amountWei.toString(),
            amountInUSD: usdCentsAtDonation.toString(),
            ethUsdPriceAtDonation: price.toString(),
            ethUsdPriceDecimals: decimals,
            tokenSymbol: "ETH",
            network: "sepolia",
            confirmed: true
        });
        await this.donations.save(donation);

        return { ok: true, donationId: donation.id };
    }

    async getByTx(txHash: string) {
        return this.donations.findOne({ where: { txHash } });
    }

    async recent() {
        return this.donations.find({ take: 20, order: { createdAt: "DESC" } });
    }
}
