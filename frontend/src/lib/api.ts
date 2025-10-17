import axios from "axios";
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
export const api = axios.create({ baseURL });

export async function recordDonation(txHash: string, wallet: string, email?: string) {
    const { data } = await api.post("/donations", { txHash, wallet, email });
    return data;
}

export async function fetchRecentDonations() {
    const { data } = await api.get("/donations/recent");
    return data as Array<{
        id: string; txHash: string; amountWei: string; amountInUSD: string; user: { wallet: string; email?: string };
        createdAt: string;
    }>;
}

export async function fetchRecentWinners() {
    const { data } = await api.get("/winners");
    return data as Array<{
        id: string, user: { wallet: string; email: string }, donation: { amountWei: string, amountInUSD: string },
        week: string, createdAt: Date,
        claimed: boolean,
        rewardAmountWei: string | null,
        rewardStatus: "pending" | "paid" | "failed",
        rewardTxHash: string | null;
    }>;
}