"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { BlobMetadata } from "@shelby-protocol/sdk/node";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getShelbyClient } from "@/utils/client";

const extractFileName = (blobName: string): string => {
  return blobName.substring(66);
};

export const GeneratedImages = ({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) => {
  const { account } = useWallet();
  const [images, setImages] = useState<BlobMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!account) {
      setImages([]);
      return;
    }
    const fetchBlobs = async () => {
      setLoading(true);
      try {
        const allBlobs = await getShelbyClient().coordination.getAccountBlobs({
          account: account.address,
        });
        const pngBlobs = allBlobs.filter((blob) =>
          extractFileName(blob.name).endsWith(".png"),
        );
        setImages(pngBlobs);
      } catch (error) {
        console.error("Failed to fetch blobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlobs();
  }, [account, refreshTrigger]);

  const getImageUrl = (item: BlobMetadata) =>
    `${process.env.NEXT_PUBLIC_SHELBY_API_URL}/v1/blobs/${item.owner.toString()}/${extractFileName(item.name)}`;

  const getShelbyExplorerUrl = (item: BlobMetadata) =>
    `https://explorer.shelby.xyz/shelbynet/account/${item.owner.toString()}/blobs?name=${encodeURIComponent(extractFileName(item.name))}`;

  const handleDownload = async (item: BlobMetadata) => {
    try {
      const response = await fetch(getImageUrl(item));
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = extractFileName(item.name);
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const handleShare = (item: BlobMetadata) => {
    const url = getShelbyExplorerUrl(item);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(item.name);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (!account) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 16px",
          fontFamily: "'Comic Neue', cursive",
          fontWeight: 700,
          color: "#888",
        }}
      >
        Connect your wallet to see your panels!
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .story-bar { background: #111; border-radius: 4px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .story-label { font-family: 'Bangers', cursive; font-size: 16px; color: #FFD700; letter-spacing: 1px; }
        .story-dots { display: flex; gap: 6px; flex-wrap: wrap; }
        .dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #FFD700; }
        .dot.filled { background: #FFD700; }
        .story-count { font-size: 11px; color: #aaa; font-weight: 700; margin-left: auto; font-family: 'Comic Neue', cursive; }
        .panels-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .panel-card { border: 3px solid #111; border-radius: 4px; background: #fff; overflow: hidden; }
        .panel-image-wrap { width: 100%; aspect-ratio: 1; background: #D6EAFF; position: relative; border-bottom: 3px solid #111; overflow: hidden; }
        .panel-num-badge { position: absolute; top: 6px; left: 8px; font-family: 'Bangers', cursive; font-size: 18px; color: #E8001C; background: #FFD700; border: 2px solid #111; border-radius: 4px; padding: 0 6px; line-height: 1.4; z-index: 2; }
        .panel-verified { position: absolute; top: 6px; right: 8px; background: #008000; color: #fff; font-size: 9px; font-weight: 700; border: 2px solid #111; border-radius: 4px; padding: 2px 6px; text-transform: uppercase; z-index: 2; font-family: 'Comic Neue', cursive; }
        .panel-caption { padding: 8px 10px; background: #fff; }
        .panel-prompt { font-size: 11px; font-weight: 700; color: #111; margin-bottom: 4px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Comic Neue', cursive; }
        .panel-meta { font-size: 10px; color: #888; margin-bottom: 8px; font-family: 'Comic Neue', cursive; }
        .panel-actions { display: flex; gap: 5px; }
        .action-btn { flex: 1; padding: 5px 2px; font-family: 'Bangers', cursive; font-size: 11px; letter-spacing: 0.5px; border: 2px solid #111; border-radius: 4px; cursor: pointer; text-align: center; transition: transform 0.1s; }
        .action-btn:hover { transform: scale(1.05); }
        .btn-download { background: #FFD700; color: #111; }
        .btn-share { background: #0057FF; color: #fff; }
        .btn-shelby { background: #E8001C; color: #fff; }
        .empty-state { text-align: center; padding: 32px 16px; font-family: 'Comic Neue', cursive; font-weight: 700; color: #888; }
        .loading-state { text-align: center; padding: 32px 16px; font-family: 'Bangers', cursive; font-size: 22px; color: #E8001C; letter-spacing: 2px; }
        @media (max-width: 600px) { .panels-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      {images.length > 0 && (
        <div className="story-bar">
          <span className="story-label">Your Story</span>
          <div className="story-dots">
            {Array.from({ length: Math.max(images.length, 6) }).map((_, i) => (
              <div
                key={i}
                className={`dot ${i < images.length ? "filled" : ""}`}
              />
            ))}
          </div>
          <span className="story-count">
            {images.length} panel{images.length !== 1 ? "s" : ""} on Shelby
          </span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading your panels...</div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          No panels yet! Generate your first comic panel above.
        </div>
      ) : (
        <div className="panels-grid">
          {images.map((item, i) => (
            <div className="panel-card" key={item.name}>
              <div className="panel-image-wrap">
                <div className="panel-num-badge">{i + 1}</div>
                <div className="panel-verified">✓ Verified</div>
                <Image
                  src={getImageUrl(item)}
                  alt={extractFileName(item.name)}
                  width={300}
                  height={300}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                  }}
                />
              </div>
              <div className="panel-caption">
                <div
                  className="panel-prompt"
                  title={extractFileName(item.name)}
                >
                  {extractFileName(item.name)
                    .replace(/_/g, " ")
                    .replace(".png", "")}
                </div>
                <div className="panel-meta">
                  Stored on Shelby · Panel {i + 1}
                </div>
                <div className="panel-actions">
                  <button
                    className="action-btn btn-download"
                    onClick={() => handleDownload(item)}
                  >
                    ⬇ Save
                  </button>
                  <button
                    className="action-btn btn-share"
                    onClick={() => handleShare(item)}
                  >
                    {copied === item.name ? "Copied!" : "🔗 Share"}
                  </button>
                  <button
                    className="action-btn btn-shelby"
                    onClick={() =>
                      window.open(getShelbyExplorerUrl(item), "_blank")
                    }
                  >
                    ⛓ Chain
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
