import { useEffect, useState } from "react";
import { fetchRecentDonations } from "../lib/api";
import { formatDistanceToNowStrict } from "date-fns";

export default function RecentDonations() {
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try { setList(await fetchRecentDonations()); }
            finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <p className="text-sm text-gray-600">Loading recent donations…</p>;
    if (!list.length) return <p className="text-sm text-gray-600">No donations yet.</p>;

    return (
        <div className="mt-6">
            <h3 className="font-semibold mb-2">Recent Donations</h3>
            <div className="space-y-2">
                {list.map((d) => (
                    <div key={d.id} className="border rounded-lg p-3 text-sm flex items-center justify-between">
                        <div>
                            <div className="font-mono">{d.user.wallet.slice(0, 6)}…{d.user.wallet.slice(-4)}</div>
                            <div className="text-gray-600">{(Number(d.amountWei) / 1e18).toFixed(4)} ETH</div>
                        </div>
                        <p className="text-green-700 font-medium">
                            ${(Number(d.amountInUSD) / 100).toFixed(2)}
                        </p>
                        <a className="text-blue-600 underline" href={`https://sepolia.etherscan.io/tx/${d.txHash}`} target="_blank" rel="noreferrer">
                            View Tx
                        </a>
                        <div className="text-gray-500">{formatDistanceToNowStrict(new Date(d.createdAt))} ago</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
