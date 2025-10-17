import { useEffect, useState } from "react";
import { getBrowserProvider } from "../lib/wallet";
import { ethers } from "ethers";

export default function ConnectButton(props: { onConnected(addr: string): void }) {
    const [address, setAddress] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function connect() {
        try {
            setBusy(true);
            const provider = await getBrowserProvider();
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const addr = await signer.getAddress();
            setAddress(addr);
            props.onConnected(addr);
        } catch (e: any) {
            alert(e.message ?? "Failed to connect");
        } finally {
            setBusy(false);
        }
    }

    useEffect(() => {
        const w: any = window;
        const handler = (accs: string[]) => {
            if (accs?.[0]) { setAddress(ethers.getAddress(accs[0])); props.onConnected(accs[0]); }
            else { setAddress(null); }
        };
        w?.ethereum?.on?.("accountsChanged", handler);
        return () => w?.ethereum?.removeListener?.("accountsChanged", handler);
    }, []);

    return (
        <button onClick={connect}
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            disabled={busy}>
            {address ? address.slice(0, 6) + "…" + address.slice(-4) : busy ? "Connecting…" : "Connect Wallet"}
        </button>
    );
}
