"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Header() {
  const { connect, disconnect, account, connected, wallets } = useWallet();

  const handleWalletClick = () => {
    if (connected) {
      disconnect();
    } else if (wallets && wallets.length > 0) {
      connect(wallets[0].name);
    }
  };

  const shortAddress = account?.address
    ? `${account.address.toString().slice(0, 6)}...${account.address.toString().slice(-4)}`
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .comic-header { background: #E8001C; border-bottom: 4px solid #111; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; }
        .comic-logo { font-family: 'Bangers', cursive; font-size: 42px; color: #FFD700; letter-spacing: 3px; text-shadow: 3px 3px 0 #111; line-height: 1; }
        .comic-tagline { font-size: 12px; color: #FFD700; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
        .comic-badge { background: #FFD700; border: 3px solid #111; border-radius: 50%; width: 64px; height: 64px; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(12deg); }
        .nav-strip { background: #111; padding: 8px 24px; display: flex; gap: 20px; align-items: center; justify-content: flex-end; }
        .wallet-btn { background: #0057FF; border: 3px solid #111; border-radius: 8px; padding: 10px 20px; font-family: 'Bangers', cursive; font-size: 18px; color: #fff; letter-spacing: 1px; cursor: pointer; }
        .wallet-btn:hover { background: #0040CC; }
        .wallet-btn.connected { background: #008000; }
      `}</style>
      <div className="comic-header">
        <div>
          <div className="comic-logo">Shcomics</div>
          <div className="comic-tagline">AI-powered comic panels on Aptos blockchain</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="comic-badge">
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#111", lineHeight: 1 }}>ON</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#E8001C", lineHeight: 1.1 }}>CHAIN</span>
          </div>
          <button className={`wallet-btn ${connected ? "connected" : ""}`} onClick={handleWalletClick}>
            {connected ? `${shortAddress} | Disconnect` : "Connect Wallet"}
          </button>
        </div>
      </div>
      <div className="nav-strip">
        <span style={{ color: "#FFD700", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>My Comics</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>Gallery</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>About</span>
      </div>
    </>
  );
}
