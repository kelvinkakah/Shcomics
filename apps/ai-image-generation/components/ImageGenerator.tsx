"use client";

import { type AccountAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { useGenerateImage } from "@/hooks/useGenerateImage";
import { useUploadImageToShelby } from "@/hooks/useUploadImageToShelby";
import { GeneratedImages } from "./GeneratedImages";

interface GeneratedImage {
  ok: boolean;
  prompt: string;
  engine: string;
  blob: { url: string; account: AccountAddress; blobName: string };
  metadata?: { url: string; account: AccountAddress; blobName: string };
}

export default function ImageGenerator() {
  const { account, connected } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const { generateImage, isGenerating } = useGenerateImage();
  const { uploadImageToShelby, uploadMetadataToShelby, isUploading } = useUploadImageToShelby();
  const isProcessing = isGenerating || isUploading;

  const handleGenerate = async () => {
    if (!prompt.trim()) { setStatusMsg("Please enter a prompt!"); return; }
    if (!connected || !account) { setStatusMsg("Please connect your wallet first!"); return; }
    try {
      setStatusMsg("Generating your comic panel...");
      const imageBuffer = await generateImage(prompt);
      const blobName = `${prompt.slice(0, 50)}_${Math.random().toString(36).slice(2)}`;
      setStatusMsg("Uploading image to Shelby...");
      const uploadedImage = await uploadImageToShelby(imageBuffer, blobName);
      setStatusMsg("Uploading metadata to Shelby...");
      const metadata = {
        prompt, engine: "openai", model: "dall-e-3",
        createdAt: new Date().toISOString(),
        creator: uploadedImage.account.toString(),
        image: uploadedImage,
      };
      await uploadMetadataToShelby(metadata, blobName);
      setStatusMsg("Panel uploaded to Shelby successfully!");
      setRefreshTrigger((prev) => prev + 1);
      setPrompt("");
    } catch (error) {
      setStatusMsg(error instanceof Error ? error.message : "Failed to generate image");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-30px) rotate(10deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(-8deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-40px) rotate(15deg)} }
        .halftone-bg { background-color: #FFF9E6; background-image: radial-gradient(#FFD700 1.2px, transparent 1.2px); background-size: 18px 18px; min-height: 100vh; padding: 24px; position: relative; overflow: hidden; }
        .speech-bubble { background: #fff; border: 3px solid #111; border-radius: 16px; padding: 16px 20px; margin-bottom: 8px; position: relative; }
        .speech-bubble::after { content: ''; position: absolute; bottom: -14px; left: 28px; width: 0; height: 0; border-left: 12px solid transparent; border-right: 6px solid transparent; border-top: 14px solid #111; }
        .speech-bubble::before { content: ''; position: absolute; bottom: -10px; left: 29px; width: 0; height: 0; border-left: 11px solid transparent; border-right: 5px solid transparent; border-top: 13px solid #fff; z-index: 1; }
        .bubble-label { font-size: 11px; font-weight: 700; color: #E8001C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-family: 'Comic Neue', cursive; }
        .comic-input { width: 100%; border: 3px solid #111; border-radius: 8px; padding: 12px 14px; font-size: 15px; font-family: 'Comic Neue', cursive; font-weight: 700; background: #fff; box-sizing: border-box; margin-top: 16px; outline: none; }
        .comic-input:disabled { opacity: 0.6; }
        .zap-btn { background: #FFD700; border: 3px solid #111; border-radius: 8px; padding: 14px 28px; font-family: 'Bangers', cursive; font-size: 26px; letter-spacing: 2px; color: #111; cursor: pointer; display: flex; align-items: center; gap: 10px; margin-top: 16px; width: 100%; justify-content: center; transition: transform 0.1s; }
        .zap-btn:hover:not(:disabled) { transform: scale(1.02); }
        .zap-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .zap-icon { background: #E8001C; color: #FFD700; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid #111; }
        .section-title { font-family: 'Bangers', cursive; font-size: 28px; color: #111; letter-spacing: 2px; margin: 24px 0 14px; display: flex; align-items: center; gap: 10px; }
        .section-title::after { content: ''; flex: 1; height: 3px; background: #111; }
        .pow { font-family: 'Bangers', cursive; font-size: 36px; color: #E8001C; text-shadow: 2px 2px 0 #FFD700, 3px 3px 0 #111; transform: rotate(-6deg); display: inline-block; }
        .status-box { background: #fff; border: 3px solid #111; border-radius: 8px; padding: 12px 16px; margin-top: 12px; font-family: 'Bangers', cursive; font-size: 20px; letter-spacing: 1px; color: #E8001C; text-align: center; }
        .shelby-gallery { background: #fff; border: 3px solid #111; border-radius: 8px; padding: 16px; margin-top: 8px; }
        .shelby-title { font-family: 'Bangers', cursive; font-size: 22px; color: #111; letter-spacing: 1px; margin-bottom: 12px; }
        .footer-note { text-align: center; margin-top: 18px; font-size: 11px; font-weight: 700; color: #555; font-family: 'Comic Neue', cursive; }
        .bg-hero { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; overflow: hidden; }
        .hero-emoji { position: absolute; user-select: none; }
        .content-wrap { position: relative; z-index: 1; }
      `}</style>

      <div className="halftone-bg">

        <div className="bg-hero">
          {[
            { e: "💥", size: 120, top: 5, left: 8, anim: "float0", dur: 7 },
            { e: "⚡", size: 100, top: 20, left: 80, anim: "float1", dur: 8 },
            { e: "💫", size: 140, top: 60, left: 5, anim: "float2", dur: 9 },
            { e: "🦸", size: 160, top: 70, left: 75, anim: "float0", dur: 11 },
            { e: "✨", size: 80, top: 40, left: 45, anim: "float1", dur: 6 },
            { e: "💢", size: 110, top: 85, left: 30, anim: "float2", dur: 10 },
            { e: "🌟", size: 90, top: 10, left: 55, anim: "float0", dur: 8 },
            { e: "⚡", size: 130, top: 50, left: 90, anim: "float1", dur: 12 },
          ].map((item, i) => (
            <div
              key={i}
              className="hero-emoji"
              style={{
                fontSize: `${item.size}px`,
                opacity: 0.06,
                top: `${item.top}%`,
                left: `${item.left}%`,
                animation: `${item.anim} ${item.dur}s ease-in-out infinite`,
              }}
            >
              {item.e}
            </div>
          ))}
        </div>

        <div className="content-wrap">
          <div className="speech-bubble">
            <div className="bubble-label">Describe your comic scene</div>
            <div style={{ fontSize: "13px", color: "#444", fontWeight: 700, fontFamily: "'Comic Neue', cursive" }}>
              {connected
                ? "Tell us the story — we'll generate and store it on Shelby!"
                : "Connect your wallet first, then describe your scene!"}
            </div>
          </div>

          <div style={{ height: "14px" }} />

          <input
            className="comic-input"
            placeholder="e.g. A superhero cat saves the city from giant robots..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isProcessing && handleGenerate()}
            disabled={isProcessing}
          />

          <button
            className="zap-btn"
            onClick={handleGenerate}
            disabled={isProcessing}
          >
            <div className="zap-icon">⚡</div>
            {isProcessing
              ? isGenerating
                ? "GENERATING..."
                : "UPLOADING TO SHELBY..."
              : "GENERATE COMIC PANEL!"}
          </button>

          {statusMsg && <div className="status-box">{statusMsg}</div>}

          <div id="gallery" className="section-title">
            <span className="pow">POW!</span> Your Panels on Shelby
          </div>

          <div className="shelby-gallery">
            <div className="shelby-title">Your Verifiable Comic Panels</div>
            <GeneratedImages refreshTrigger={refreshTrigger} />
          </div>

          <div className="footer-note">
            Every panel is stored verifiably on Shelby &bull; Cryptographic provenance &bull; Powered by Aptos blockchain
          </div>
        </div>
      </div>
    </>
  );
}