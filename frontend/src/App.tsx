import { useState } from "react";
import ConnectButton from "./components/ConnectButton";
import DonateForm from "./components/DonateForm";
import RecentDonations from "./components/RecentDonations";
import RecentWinners from "./components/RecentWinners";

export default function App() {
  const [wallet, setWallet] = useState<string>();

  return (
    <div className="min-h-screen bg-white text-gray-900 w-full">
      <header className="w-full mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">NGO Donations (Web3)</h1>
        <ConnectButton onConnected={setWallet} />
      </header>

      <main className="w-full mx-auto px-4 py-6">
        <p className="mb-4 text-gray-700">
          Connect your wallet on <b>Sepolia</b>, donate a small amount, and you’ll be automatically
          entered into this week’s draw. Winner gets <b>2×</b> their donation back. 🔁🎉
        </p>

        <DonateForm wallet={wallet} />
        <RecentDonations />
        <RecentWinners />
      </main>

      <footer className="w-full mx-auto px-4 py-10 text-xs text-gray-500">
        Contract: <code>{import.meta.env.VITE_CONTRACT_ADDRESS}</code>
      </footer>
    </div>
  );
}
