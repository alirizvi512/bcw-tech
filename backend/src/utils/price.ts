import { ethers } from "ethers";

const CL_ABI = [
    "function latestRoundData() view returns (uint80,int256,uint256,uint256,uint80)",
    "function decimals() view returns (uint8)"
];

export async function getEthUsd(
    provider: ethers.Provider,
    feedAddress: string
): Promise<{ price: bigint; decimals: number }> {
    const feed = new ethers.Contract(feedAddress, CL_ABI, provider);
    const [, answer] = await feed.latestRoundData();
    const dec: number = await feed.decimals();
    if (answer <= 0) throw new Error("Invalid oracle price");
    return { price: BigInt(answer), decimals: dec };
}
