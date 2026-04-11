"use client";

import {
  type AccountAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
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
  const { uploadImageToShelby, uploadMetadataToShelby, isUploading } =
    useUploadImageToShelby();
  const isProcessing = isGenerating || isUploading;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setStatusMsg("Please enter a prompt!");
      return;
    }
    if (!connected || !account) {
      setStatusMsg("Please connect your wallet first!");
      return;
    }
    try {
      setStatusMsg("Generating your comic panel...");
      const comicPrompt = `comic book style, bold black outlines, primary colors, halftone dots, dynamic action pose: ${prompt}`;
      const imageBuffer = await generateImage(comicPrompt);
      const blobName = `${prompt.slice(0, 50)}_${Math.random().toString(36).slice(2)}`;
      setStatusMsg("Uploading image to Shelby...");
      const uploadedImage = await uploadImageToShelby(imageBuffer, blobName);
      setStatusMsg("Uploading metadata to Shelby...");
      const metadata = {
        prompt,
        engine: "openai",
        model: "dall-e-3",
        createdAt: new Date().toISOString(),
        creator: uploadedImage.account.toString(),
        image: uploadedImage,
      };
      await uploadMetadataToShelby(metadata, blobName);
      setStatusMsg("Panel uploaded to Shelby successfully!");
      setRefreshTrigger((prev) => prev + 1);
      setPrompt("");
    } catch (error) {
      setStatusMsg(
        error instanceof Error ? error.message : "Failed to generate image",
      );
    }
  };

  const tickerItems = [
    "GENERATE",
    "STORE ON SHELBY",
    "VERIFY ON CHAIN",
    "DOWNLOAD",
    "SHARE YOUR STORY",
    "APTOS BLOCKCHAIN",
  ];
  const stripCaptions = [
    "A hero rises from the blockchain",
    "The villain steals the artwork",
    "Shelby secures the proof",
    "Our hero reclaims the canvas",
    "The city is saved!",
    "A new story begins...",
  ];
  const stripEmojis = ["💥", "⚡", "🛡️", "🎨", "🌟", "📖"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-30px) rotate(10deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(-8deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-40px) rotate(15deg)} }
        @keyframes scrollLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes zapPop { 0%{opacity:0;transform:scale(0) rotate(20deg)} 15%{opacity:1;transform:scale(1.2) rotate(-5deg)} 70%{opacity:1;transform:scale(1) rotate(0deg)} 100%{opacity:0;transform:scale(0.8) rotate(10deg)} }
        @keyframes villainShake { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
        @keyframes heroFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes sidekickBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
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
            <div
              style={{
                fontSize: "13px",
                color: "#444",
                fontWeight: 700,
                fontFamily: "'Comic Neue', cursive",
              }}
            >
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
            onKeyDown={(e) =>
              e.key === "Enter" && !isProcessing && handleGenerate()
            }
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
            Every panel is stored verifiably on Shelby &bull; Cryptographic
            provenance &bull; Powered by Aptos blockchain
          </div>

          <div
            style={{ height: "3px", background: "#111", margin: "24px 0 0" }}
          />

          <div
            style={{
              background: "#E8001C",
              borderTop: "3px solid #111",
              borderBottom: "3px solid #111",
              padding: "10px 0",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                gap: "48px",
                animation: "scrollLeft 18s linear infinite",
              }}
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "18px",
                    color: i % 2 === 0 ? "#FFD700" : "#fff",
                    letterSpacing: "2px",
                  }}
                >
                  {item} {i % 2 === 0 ? "★" : "•"}
                </span>
              ))}
            </div>
          </div>

          <div style={{ padding: "32px 24px 16px" }}>
            <div
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "26px",
                color: "#111",
                letterSpacing: "2px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: "30px",
                  color: "#E8001C",
                  textShadow: "2px 2px 0 #FFD700, 3px 3px 0 #111",
                  transform: "rotate(-4deg)",
                  display: "inline-block",
                }}
              >
                BAM!
              </span>
              <span> Meet the Heroes</span>
              <div style={{ flex: 1, height: "3px", background: "#111" }} />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  border: "3px solid #111",
                  borderRadius: "6px",
                  background: "#fff",
                  padding: "12px",
                  textAlign: "center",
                  width: "130px",
                  position: "relative",
                  animation: "heroFloat 4s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-18px",
                    right: "-14px",
                    fontFamily: "'Bangers', cursive",
                    fontSize: "22px",
                    color: "#E8001C",
                    textShadow: "1px 1px 0 #FFD700",
                    animation: "zapPop 3s ease-in-out infinite",
                  }}
                >
                  ZAP!
                </div>
                <svg
                  width="70"
                  height="90"
                  viewBox="0 0 70 90"
                  style={{ display: "block", margin: "0 auto 8px" }}
                >
                  <ellipse
                    cx="35"
                    cy="20"
                    rx="18"
                    ry="20"
                    fill="#FFD700"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="18"
                    y="38"
                    width="34"
                    height="36"
                    rx="6"
                    fill="#E8001C"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="10"
                    y="38"
                    width="10"
                    height="28"
                    rx="4"
                    fill="#E8001C"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="50"
                    y="38"
                    width="10"
                    height="28"
                    rx="4"
                    fill="#E8001C"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="20"
                    y="72"
                    width="12"
                    height="16"
                    rx="3"
                    fill="#111"
                    stroke="#111"
                    strokeWidth="1"
                  />
                  <rect
                    x="38"
                    y="72"
                    width="12"
                    height="16"
                    rx="3"
                    fill="#111"
                    stroke="#111"
                    strokeWidth="1"
                  />
                  <circle cx="27" cy="18" r="3" fill="#111" />
                  <circle cx="43" cy="18" r="3" fill="#111" />
                  <path
                    d="M28 28 Q35 33 42 28"
                    stroke="#111"
                    strokeWidth="2"
                    fill="none"
                  />
                  <polygon
                    points="35,42 30,54 35,50 40,54"
                    fill="#FFD700"
                    stroke="#111"
                    strokeWidth="1"
                  />
                </svg>
                <div
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "16px",
                    color: "#111",
                    letterSpacing: "1px",
                  }}
                >
                  Chain Man
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#E8001C",
                    textTransform: "uppercase",
                  }}
                >
                  AI Art Master
                </div>
              </div>

              <div
                style={{
                  border: "3px solid #FFD700",
                  borderRadius: "6px",
                  background: "#111",
                  padding: "12px",
                  textAlign: "center",
                  width: "130px",
                  animation: "villainShake 2s ease-in-out infinite",
                }}
              >
                <svg
                  width="70"
                  height="90"
                  viewBox="0 0 70 90"
                  style={{ display: "block", margin: "0 auto 8px" }}
                >
                  <ellipse
                    cx="35"
                    cy="20"
                    rx="18"
                    ry="20"
                    fill="#7F77DD"
                    stroke="#FFD700"
                    strokeWidth="2"
                  />
                  <rect
                    x="18"
                    y="38"
                    width="34"
                    height="36"
                    rx="6"
                    fill="#534AB7"
                    stroke="#FFD700"
                    strokeWidth="2"
                  />
                  <rect
                    x="10"
                    y="38"
                    width="10"
                    height="28"
                    rx="4"
                    fill="#534AB7"
                    stroke="#FFD700"
                    strokeWidth="2"
                  />
                  <rect
                    x="50"
                    y="38"
                    width="10"
                    height="28"
                    rx="4"
                    fill="#534AB7"
                    stroke="#FFD700"
                    strokeWidth="2"
                  />
                  <rect
                    x="20"
                    y="72"
                    width="12"
                    height="16"
                    rx="3"
                    fill="#534AB7"
                    stroke="#FFD700"
                    strokeWidth="1"
                  />
                  <rect
                    x="38"
                    y="72"
                    width="12"
                    height="16"
                    rx="3"
                    fill="#534AB7"
                    stroke="#FFD700"
                    strokeWidth="1"
                  />
                  <circle cx="27" cy="18" r="3" fill="#FFD700" />
                  <circle cx="43" cy="18" r="3" fill="#FFD700" />
                  <path
                    d="M28 28 Q35 24 42 28"
                    stroke="#FFD700"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M17 8 Q25 2 35 6 Q45 2 53 8"
                    stroke="#FFD700"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                <div
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "16px",
                    color: "#FFD700",
                    letterSpacing: "1px",
                  }}
                >
                  The Validator
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#7F77DD",
                    textTransform: "uppercase",
                  }}
                >
                  Chain Breaker
                </div>
              </div>

              <div
                style={{
                  border: "3px solid #111",
                  borderRadius: "6px",
                  background: "#fff",
                  padding: "12px",
                  textAlign: "center",
                  width: "130px",
                  animation: "sidekickBounce 3s ease-in-out infinite",
                }}
              >
                <svg
                  width="70"
                  height="90"
                  viewBox="0 0 70 90"
                  style={{ display: "block", margin: "0 auto 8px" }}
                >
                  <ellipse
                    cx="35"
                    cy="22"
                    rx="15"
                    ry="18"
                    fill="#5DCAA5"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="20"
                    y="38"
                    width="30"
                    height="32"
                    rx="6"
                    fill="#1D9E75"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="12"
                    y="40"
                    width="9"
                    height="24"
                    rx="4"
                    fill="#1D9E75"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="49"
                    y="40"
                    width="9"
                    height="24"
                    rx="4"
                    fill="#1D9E75"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="22"
                    y="68"
                    width="11"
                    height="14"
                    rx="3"
                    fill="#111"
                    stroke="#111"
                    strokeWidth="1"
                  />
                  <rect
                    x="37"
                    y="68"
                    width="11"
                    height="14"
                    rx="3"
                    fill="#111"
                    stroke="#111"
                    strokeWidth="1"
                  />
                  <circle cx="28" cy="20" r="3" fill="#111" />
                  <circle cx="42" cy="20" r="3" fill="#111" />
                  <path
                    d="M27 30 Q35 35 43 30"
                    stroke="#111"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="35"
                    cy="48"
                    r="6"
                    fill="#FFD700"
                    stroke="#111"
                    strokeWidth="1.5"
                  />
                  <text
                    x="35"
                    y="52"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="bold"
                    fill="#111"
                  >
                    S
                  </text>
                </svg>
                <div
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "16px",
                    color: "#111",
                    letterSpacing: "1px",
                  }}
                >
                  Shelby Bot
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#1D9E75",
                    textTransform: "uppercase",
                  }}
                >
                  Storage Guardian
                </div>
              </div>

              <div
                style={{
                  border: "3px solid #111",
                  borderRadius: "6px",
                  background: "#fff",
                  padding: "12px",
                  textAlign: "center",
                  width: "130px",
                  animation: "heroFloat 5s ease-in-out infinite",
                }}
              >
                <svg
                  width="70"
                  height="90"
                  viewBox="0 0 70 90"
                  style={{ display: "block", margin: "0 auto 8px" }}
                >
                  <ellipse
                    cx="35"
                    cy="20"
                    rx="18"
                    ry="20"
                    fill="#F09595"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="18"
                    y="38"
                    width="34"
                    height="36"
                    rx="6"
                    fill="#E24B4A"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="10"
                    y="38"
                    width="10"
                    height="28"
                    rx="4"
                    fill="#E24B4A"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="50"
                    y="38"
                    width="10"
                    height="28"
                    rx="4"
                    fill="#E24B4A"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <rect
                    x="20"
                    y="72"
                    width="12"
                    height="16"
                    rx="3"
                    fill="#111"
                    stroke="#111"
                    strokeWidth="1"
                  />
                  <rect
                    x="38"
                    y="72"
                    width="12"
                    height="16"
                    rx="3"
                    fill="#111"
                    stroke="#111"
                    strokeWidth="1"
                  />
                  <circle cx="27" cy="18" r="3" fill="#111" />
                  <circle cx="43" cy="18" r="3" fill="#111" />
                  <path
                    d="M28 28 Q35 33 42 28"
                    stroke="#111"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="22"
                    y="40"
                    width="26"
                    height="16"
                    rx="3"
                    fill="#FFD700"
                    stroke="#111"
                    strokeWidth="1"
                  />
                  <text
                    x="35"
                    y="52"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#111"
                  >
                    PIXEL
                  </text>
                </svg>
                <div
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "16px",
                    color: "#111",
                    letterSpacing: "1px",
                  }}
                >
                  Pixel Girl
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#E24B4A",
                    textTransform: "uppercase",
                  }}
                >
                  Art Generator
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#111",
              padding: "16px 24px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "20px",
                color: "#FFD700",
                letterSpacing: "2px",
                marginBottom: "12px",
              }}
            >
              ★ COMIC STRIP TICKER ★
            </div>
            <div
              style={{
                display: "flex",
                animation: "scrollLeft 22s linear infinite",
                width: "max-content",
              }}
            >
              {[...stripCaptions, ...stripCaptions].map((caption, i) => (
                <div
                  key={i}
                  style={{
                    width: "140px",
                    height: "100px",
                    border: "3px solid #FFD700",
                    background: "#FFF9E6",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      left: "6px",
                      fontFamily: "'Bangers', cursive",
                      fontSize: "13px",
                      color: "#E8001C",
                    }}
                  >
                    {(i % 6) + 1}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                    }}
                  >
                    {stripEmojis[i % 6]}
                  </div>
                  <div
                    style={{
                      background: "#111",
                      color: "#FFD700",
                      fontFamily: "'Bangers', cursive",
                      fontSize: "9px",
                      padding: "3px 4px",
                      textAlign: "center",
                      letterSpacing: "1px",
                      width: "100%",
                      boxSizing: "border-box" as const,
                    }}
                  >
                    {caption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              padding: "20px 24px 32px",
            }}
          >
            {[
              {
                icon: "⛓",
                title: "On-Chain Proof",
                desc: "Every panel gets a cryptographic hash stored permanently on Aptos blockchain",
              },
              {
                icon: "⚡",
                title: "Instant Storage",
                desc: "Shelby's hot storage layer serves your comics globally with sub-second reads",
              },
              {
                icon: "🎨",
                title: "True Ownership",
                desc: "Your wallet address is cryptographically tied to every panel you create",
              },
            ].map((fact, i) => (
              <div
                key={i}
                style={{
                  border: "3px solid #111",
                  borderRadius: "6px",
                  background: "#fff",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>
                  {fact.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "16px",
                    color: "#E8001C",
                    letterSpacing: "1px",
                    marginBottom: "4px",
                  }}
                >
                  {fact.title}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#555",
                    lineHeight: 1.4,
                  }}
                >
                  {fact.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
