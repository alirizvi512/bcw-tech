export const DonationAbi = [
    { "inputs": [{ "internalType": "address", "name": "_treasury", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "inputs": [], "name": "donate", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [], "name": "treasury", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    {
        "anonymous": false, "inputs": [
            { "indexed": true, "internalType": "address", "name": "donor", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "blockNumber", "type": "uint256" }
        ], "name": "DonationReceived", "type": "event"
    }
] as const;
