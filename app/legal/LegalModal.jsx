'use client';

/**
 * LegalModal — shared wrapper for Privacy, Terms, Cookies.
 * Usage: <LegalModal title="PRIVACY POLICY" tag="// DATA_PROTOCOL" onClose={fn}>...</LegalModal>
 */
import { useEffect } from "react";

const BLUE = "#0D82E4";

export default function LegalModal({ title, tag, onClose, children }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(0,0,0,.88)",
          backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
          animation: "lm-fade .2s ease",
        }}
      >
        {/* Panel */}
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,.08)",
            width: "100%",
            maxWidth: "680px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            animation: "lm-slide .22s ease",
            boxShadow: "0 24px 80px rgba(0,0,0,.9)",
            overflow: "hidden",
          }}
        >
          {/* Scan line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, overflow: "hidden", pointerEvents: "none", zIndex: 3 }}>
            <div style={{
              position: "absolute", top: 0,
              width: 100, height: 1,
              background: `linear-gradient(to right, transparent, ${BLUE}, transparent)`,
              boxShadow: `0 0 8px ${BLUE}`,
              animation: "lm-scan 2.5s linear infinite",
            }} />
          </div>

          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 24px",
            borderBottom: "1px solid rgba(255,255,255,.06)",
            flexShrink: 0,
            position: "relative", zIndex: 2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE, boxShadow: `0 0 6px ${BLUE}` }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "rgba(255,255,255,.25)", letterSpacing: ".3em", textTransform: "uppercase" }}>
                ZEPHVION {tag}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,.25)", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: ".1em", transition: "color .15s", padding: "4px 8px" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.25)"}
            >
              [ ESC ]
            </button>
          </div>

          {/* Heading */}
          <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid rgba(255,255,255,.04)", flexShrink: 0 }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: BLUE, letterSpacing: ".35em", textTransform: "uppercase", margin: "0 0 8px" }}>
              {tag}
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(28px,6vw,44px)", color: "#fff", margin: 0, lineHeight: 1, letterSpacing: ".02em" }}>
              {title}
            </h2>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "rgba(255,255,255,.18)", letterSpacing: ".2em", margin: "8px 0 0", textTransform: "uppercase" }}>
              Last updated: January 2026 · Zephvion Pvt. Ltd.
            </p>
          </div>

          {/* Scrollable body */}
          <div className="lm-scroll" style={{ overflowY: "auto", padding: "8px 24px 32px", flex: 1 }}>
            {children}
          </div>

          {/* Footer bar */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,.06)",
            padding: "12px 24px",
            display: "flex", justifyContent: "flex-end",
            flexShrink: 0,
          }}>
            <button
              onClick={onClose}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,.12)",
                color: "rgba(255,255,255,.35)", fontFamily: "'DM Mono',monospace",
                fontSize: 8, letterSpacing: ".25em", textTransform: "uppercase",
                padding: "10px 20px", cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "rgba(255,255,255,.35)"; }}
            >
              [ CLOSE ]
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
