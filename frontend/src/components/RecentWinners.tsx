import { useEffect, useState } from "react";
import { fetchRecentWinners } from "../lib/api";
import { formatDistanceToNowStrict } from "date-fns";

export default function RecentWinners() {
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try { setList(await fetchRecentWinners()); }
            finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <p className="text-sm text-gray-600">Loading recent winners…</p>;
    if (!list.length) return <p className="text-sm text-gray-600">No winners yet.</p>;

    return (
        <div className="mt-6">
            <h3 className="font-semibold mb-2">Recent Winners</h3>
            <div className="space-y-2">
                {list.map((d) => (
                    <div key={d.id} className="border rounded-lg p-3 text-sm flex items-center justify-between">
                        <div>
                            <div className="font-mono">{d.user.wallet.slice(0, 6)}…{d.user.wallet.slice(-4)}</div>
                            <div className="text-gray-600">{(Number(d.rewardAmountWei) / 1e18).toFixed(4)} ETH</div>
                        </div>
                        <p>{d.user.email}</p>
                        <a className="text-blue-600 underline" href={`https://sepolia.etherscan.io/tx/${d.rewardTxHash}`} target="_blank" rel="noreferrer">
                            View Tx
                        </a>
                        <div className="text-gray-500">{formatDistanceToNowStrict(new Date(d.createdAt))} ago</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
