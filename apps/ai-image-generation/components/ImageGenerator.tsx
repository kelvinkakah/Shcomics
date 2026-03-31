"use client";
import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.imageUrl) setImages((prev) => [data.imageUrl, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .halftone-bg { background-color: #FFF9E6; background-image: radial-gradient(#FFD700 1.2px, transparent 1.2px); background-size: 18px 18px; min-height: 100vh; padding: 24px; }
        .speech-bubble { background: #fff; border: 3px solid #111; border-radius: 16px; padding: 16px 20px; margin-bottom: 8px; position: relative; }
        .speech-bubble::after { content: ''; position: absolute; bottom: -14px; left: 28px; width: 0; height: 0; border-left: 12px solid transparent; border-right: 6px solid transparent; border-top: 14px solid #111; }
        .speech-bubble::before { content: ''; position: absolute; bottom: -10px; left: 29px; width: 0; height: 0; border-left: 11px solid transparent; border-right: 5px solid transparent; border-top: 13px solid #fff; z-index: 1; }
        .bubble-label { font-size: 11px; font-weight: 700; color: #E8001C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-family: 'Comic Neue', cursive; }
        .comic-input { width: 100%; border: 3px solid #111; border-radius: 8px; padding: 12px 14px; font-size: 15px; font-family: 'Comic Neue', cursive; font-weight: 700; background: #fff; box-sizing: border-box; margin-top: 16px; outline: none; }
        .zap-btn { background: #FFD700; border: 3px solid #111; border-radius: 8px; padding: 14px 28px; font-family: 'Bangers', cursive; font-size: 26px; letter-spacing: 2px; color: #111; cursor: pointer; display: flex; align-items: center; gap: 10px; margin-top: 16px; width: 100%; justify-content: center; transition: transform 0.1s; }
        .zap-btn:hover { transform: scale(1.02); }
        .zap-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .zap-icon { background: #E8001C; color: #FFD700; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid #111; }
        .section-title { font-family: 'Bangers', cursive; font-size: 28px; color: #111; letter-spacing: 2px; margin: 24px 0 14px; display: flex; align-items: center; gap: 10px; }
        .section-title::after { content: ''; flex: 1; height: 3px; background: #111; }
        .pow { font-family: 'Bangers', cursive; font-size: 36px; color: #E8001C; text-shadow: 2px 2px 0 #FFD700, 3px 3px 0 #111; transform: rotate(-6deg); display: inline-block; }
        .panel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .panel { border: 3px solid #111; border-radius: 4px; background: #D6EAFF; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; position: relative; overflow: hidden; }
        .panel img { width: 100%; height: 100%; object-fit: cover; }
        .panel-num { position: absolute; top: 6px; left: 8px; font-family: 'Bangers', cursive; font-size: 18px; color: #E8001C; z-index: 1; }
        .panel-caption { border-top: 2px solid #111; background: #fff; font-size: 10px; font-weight: 700; color: #111; padding: 4px 8px; width: 100%; text-align: center; box-sizing: border-box; font-family: 'Comic Neue', cursive; }
        .empty-panel { font-size: 11px; font-weight: 700; color: #0C447C; text-align: center; padding: 8px; font-family: 'Comic Neue', cursive; }
        .loading-text { font-family: 'Bangers', cursive; font-size: 22px; color: #E8001C; text-align: center; margin-top: 12px; letter-spacing: 2px; }
        .footer-note { text-align: center; margin-top: 18px; font-size: 11px; font-weight: 700; color: #555; font-family: 'Comic Neue', cursive; }
      `}</style>

      <div className="halftone-bg">
        <div className="speech-bubble">
          <div className="bubble-label">Describe your comic scene</div>
          <div style={{ fontSize: "13px", color: "#444", fontWeight: 700, fontFamily: "'Comic Neue', cursive" }}>
            Tell us the story — we'll make it come alive!
          </div>
        </div>

        <div style={{ height: "14px" }} />

        <input
          className="comic-input"
          placeholder="e.g. A superhero cat saves the city from giant robots..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button className="zap-btn" onClick={handleGenerate} disabled={loading}>
          <div className="zap-icon">⚡</div>
          {loading ? "GENERATING..." : "GENERATE COMIC PANEL!"}
        </button>

        {loading && <div className="loading-text">KAPOW! Creating your panel...</div>}

        <div className="section-title">
          <span className="pow">POW!</span> Your Panels
        </div>

        <div className="panel-grid">
          {images.length === 0 ? (
            <>
              {[1, 2, 3].map((n) => (
                <div className="panel" key={n}>
                  <div className="panel-num">{n}</div>
                  <div className="empty-panel">Generate a panel to fill this!</div>
                  <div className="panel-caption">Panel {n}</div>
                </div>
              ))}
            </>
          ) : (
            images.map((url, i) => (
              <div className="panel" key={i}>
                <div className="panel-num">{i + 1}</div>
                <img src={url} alt={`Panel ${i + 1}`} />
                <div className="panel-caption">Panel {i + 1}</div>
              </div>
            ))
          )}
        </div>

        <div className="footer-note">
          Stored verifiably on Shelby &bull; Powered by Aptos blockchain
        </div>
      </div>
    </>
  );
}