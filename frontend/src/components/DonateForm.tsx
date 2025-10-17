import { useState } from "react";
import { ethers } from "ethers";
import { getSigner } from "../lib/wallet";
import { DonationAbi } from "../abi/Donation";
import { recordDonation } from "../lib/api";

const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as string;

export default function DonateForm(props: { wallet?: string }) {
    const [amount, setAmount] = useState("0.01");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function donate() {
        if (!props.wallet) return alert("Connect wallet first");
        try {
            if (!email) {
                alert("Email is required.")
                return;
            }

            setBusy(true);
            setStatus("Requesting signature…");
            const signer = await getSigner();
            const donation = new ethers.Contract(CONTRACT, DonationAbi, signer);

            setStatus("Sending transaction…");
            const tx = await donation.donate({ value: ethers.parseEther(amount) });
            setStatus("Waiting for confirmation…");
            const receipt = await tx.wait(); // wait 1 block

            const txHash = receipt?.hash ?? tx.hash;
            setStatus("Recording donation on server…");
            await recordDonation(txHash, props.wallet, email.trim() || undefined);

            setStatus("✅ Donation recorded! You’re entered for the weekly draw.");
        } catch (e: any) {
            console.error(e);
            setStatus("❌ " + (e?.shortMessage || e?.message || "Donation failed"));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-3 p-4 border rounded-xl">
            <div className="flex gap-2 items-center">
                <input
                    type="number" min="0" step="0.001"
                    className="border px-3 py-2 rounded-lg w-40"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.01"
                />
                <span className="text-sm text-gray-600">ETH (Sepolia)</span>
            </div>

            <input
                type="email"
                className="border px-3 py-2 rounded-lg w-full"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email"
            />

            <button
                onClick={donate}
                disabled={busy}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50">
                {busy ? "Processing…" : "Donate"}
            </button>

            {status && <p className="text-sm text-gray-800">{status}</p>}
        </div>
    );
}
