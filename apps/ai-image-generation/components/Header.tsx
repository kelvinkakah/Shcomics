"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";

export default function Header() {
  const { connect, disconnect, account, connected, wallets } = useWallet();
  const [showAbout, setShowAbout] = useState(false);

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
        .nav-link { font-weight: 700; font-size: 13px; cursor: pointer; background: none; border: none; font-family: 'Comic Neue', cursive; }
        .about-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .about-box { background: #FFF9E6; border: 4px solid #111; border-radius: 12px; padding: 32px; max-width: 500px; width: 90%; position: relative; font-family: 'Comic Neue', cursive; }
        .about-close { position: absolute; top: 12px; right: 16px; font-family: 'Bangers', cursive; font-size: 24px; cursor: pointer; background: #E8001C; color: #fff; border: 2px solid #111; border-radius: 6px; padding: 2px 10px; }
        .about-title { font-family: 'Bangers', cursive; font-size: 36px; color: #E8001C; text-shadow: 2px 2px 0 #FFD700, 3px 3px 0 #111; margin-bottom: 16px; }
        .about-body { font-size: 15px; color: #111; line-height: 1.7; font-weight: 700; }
        .about-badge { display: inline-block; background: #E8001C; color: #FFD700; font-family: 'Bangers', cursive; font-size: 14px; letter-spacing: 1px; padding: 4px 12px; border-radius: 6px; border: 2px solid #111; margin: 4px 4px 4px 0; }
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
        <a href="#my-comics" className="nav-link" style={{ color: "#FFD700" }}>My Comics</a>
        <a href="#gallery" className="nav-link" style={{ color: "#fff" }}>Gallery</a>
        <button className="nav-link" style={{ color: "#fff" }} onClick={() => setShowAbout(true)}>About</button>
      </div>

      {showAbout && (
        <div className="about-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-box" onClick={(e) => e.stopPropagation()}>
            <button className="about-close" onClick={() => setShowAbout(false)}>X</button>
            <div className="about-title">What is Shcomics?</div>
            <div className="about-body">
              <p>Shcomics is a decentralized AI comic panel generator built on the <strong>Aptos blockchain</strong> using <strong>Shelby Protocol</strong> — the world's first verifiable hot storage layer for AI and media.</p>
              <br />
              <p>Describe any comic scene, and Shcomics will generate a stunning AI image and store it permanently on Shelby with full cryptographic provenance — meaning every panel has a verified owner, timestamp, and hash that can never be tampered with.</p>
              <br />
              <p>Your comics are not stored on a centralized server. They live on Shelby's decentralized network, instantly accessible anywhere in the world with sub-second read speeds.</p>
              <br />
              <div>
                <span className="about-badge">AI Generation</span>
                <span className="about-badge">Shelby Storage</span>
                <span className="about-badge">Aptos Blockchain</span>
                <span className="about-badge">Verifiable Provenance</span>
                <span className="about-badge">No Cloud Lock-in</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}