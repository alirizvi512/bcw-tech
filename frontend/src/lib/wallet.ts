import { ethers } from "ethers";

const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 11155111);

export async function getBrowserProvider() {
    const anyWindow = window as any;
    if (!anyWindow.ethereum) throw new Error("MetaMask not found");
    return new ethers.BrowserProvider(anyWindow.ethereum, "any");
}

export async function ensureSepolia(provider: ethers.BrowserProvider) {
    const net = await provider.getNetwork();
    if (Number(net.chainId) === CHAIN_ID) return;

    // try switch
    try {
        await (provider as any).send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]); // 11155111
        return;
    } catch (e: any) {
        // add network
        if (e?.code === 4902) {
            await (provider as any).send("wallet_addEthereumChain", [{
                chainId: "0xaa36a7",
                chainName: "Sepolia Test Network",
                nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"]
            }]);
            return;
        }
        throw e;
    }
}

export async function getSigner() {
    const provider = await getBrowserProvider();
    await provider.send("eth_requestAccounts", []);
    await ensureSepolia(provider);
    return provider.getSigner();
}
