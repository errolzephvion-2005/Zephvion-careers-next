'use client';

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "VISION", href: "https://www.zephvion.com/#vision" },
  { label: "SERVICES", href: "https://www.zephvion.com/#services" },
  { label: "ARCH", href: "https://www.zephvion.com/#architecture" },
  { label: "BUILD", href: "https://www.zephvion.com/#build" },
  { label: "SIGNAL", href: "https://www.zephvion.com/#signal" },
];

const HUB_DATA = {
  title: "NETWORK HUB",
  subtitle: "Connected infrastructure nodes",
  nodes: [
    { label: "API GATEWAY", status: "ONLINE", ping: "2ms", color: "#0DE4CF" },
    { label: "AI ENGINE", status: "ONLINE", ping: "4ms", color: "#0DE4CF" },
    { label: "DATA PIPELINE", status: "ONLINE", ping: "8ms", color: "#0DE4CF" },
    { label: "EDGE NODES", status: "SYNCING", ping: "12ms", color: "#E46F0D" },
    { label: "VECTOR DB", status: "ONLINE", ping: "3ms", color: "#0DE4CF" },
  ],
};

const SEC_DATA = {
  title: "SECURITY STATUS",
  subtitle: "Zero-trust architecture active",
  metrics: [
    { label: "ENCRYPTION", value: "AES-256", ok: true },
    { label: "SSL/TLS", value: "v1.3", ok: true },
    { label: "FIREWALL", value: "ACTIVE", ok: true },
    { label: "LAST AUDIT", value: "2h ago", ok: true },
    { label: "THREAT LEVEL", value: "MINIMAL", ok: true },
  ],
  score: 98,
};

function PulseDot({ color = "#0DE4CF" }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.4, animation: "pulse-ring 1.8s ease-out infinite" }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
    </span>
  );
}

function HubPopup({ onClose }) {
  return (
    <div style={{ position: "absolute", left: "calc(100% + 12px)", top: 0, width: 262, background: "rgba(5,5,8,0.97)", border: "1px solid rgba(13,212,207,0.2)", boxShadow: "0 0 40px rgba(13,212,207,0.08), 0 20px 60px rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", animation: "popup-in 0.2s cubic-bezier(0.4,0,0.2,1)", zIndex: 100 }}>
      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <PulseDot color="#0DE4CF" />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", color: "#0DE4CF", textTransform: "uppercase" }}>{HUB_DATA.title}</span>
          </div>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>{HUB_DATA.subtitle}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", padding: 2 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
        </button>
      </div>
      <div style={{ padding: "8px 0" }}>
        {HUB_DATA.nodes.map((node, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: i < HUB_DATA.nodes.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PulseDot color={node.color} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em" }}>{node.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: node.color, letterSpacing: "0.1em" }}>{node.status}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "rgba(255,255,255,0.2)" }}>{node.ping}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>5/5 NODES REACHABLE</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "#0DE4CF", letterSpacing: "0.1em" }}>↑ 1.2 PB/s</span>
      </div>
      <div style={{ position: "absolute", left: -5, top: 18, width: 8, height: 8, background: "rgba(5,5,8,0.97)", border: "1px solid rgba(13,212,207,0.2)", borderRight: "none", borderTop: "none", transform: "rotate(45deg)" }} />
    </div>
  );
}

function SecPopup({ onClose }) {
  return (
    <div style={{ position: "absolute", left: "calc(100% + 12px)", bottom: 0, width: 262, background: "rgba(5,5,8,0.97)", border: "1px solid rgba(13,130,228,0.2)", boxShadow: "0 0 40px rgba(13,130,228,0.08), 0 20px 60px rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", animation: "popup-in 0.2s cubic-bezier(0.4,0,0.2,1)", zIndex: 100 }}>
      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <PulseDot color="#0D82E4" />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", color: "#0D82E4", textTransform: "uppercase" }}>{SEC_DATA.title}</span>
          </div>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>{SEC_DATA.subtitle}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", padding: 2 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
        </button>
      </div>
      <div style={{ padding: "14px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
            <circle cx="26" cy="26" r="22" fill="none" stroke="#0D82E4" strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 22 * SEC_DATA.score / 100} ${2 * Math.PI * 22}`}
              strokeLinecap="round" transform="rotate(-90 26 26)"
              style={{ filter: "drop-shadow(0 0 4px rgba(13,130,228,0.6))" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#0D82E4" }}>{SEC_DATA.score}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginBottom: 4 }}>SECURITY SCORE</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#0D82E4", letterSpacing: "0.15em" }}>EXCELLENT</div>
        </div>
      </div>
      <div style={{ padding: "8px 0" }}>
        {SEC_DATA.metrics.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 14px", borderBottom: i < SEC_DATA.metrics.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>{m.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: m.ok ? "#0DE4CF" : "#E46F0D" }}>{m.value}</span>
              <span style={{ color: m.ok ? "#0DE4CF" : "#E46F0D", fontSize: 10 }}>{m.ok ? "✓" : "!"}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: -5, bottom: 18, width: 8, height: 8, background: "rgba(5,5,8,0.97)", border: "1px solid rgba(13,130,228,0.2)", borderRight: "none", borderTop: "none", transform: "rotate(45deg)" }} />
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState(null);
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false); // NEW: track scroll for desktop rail
  const popupRef = useRef(null);
  const lastScrollY = useRef(0);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setPopup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Mobile: appear after scrolling past hero + desktop: track scroll for solid bg
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      // Always keep visible for mobile header
      setVisible(true);

      if (y <= 30) {
        // At the very top, reset drawer if needed
        setOpen(false);
      }

      lastScrollY.current = y;
      setScrolled(y > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── DESKTOP left rail (always visible) ── */}
      <nav
        className="hidden lg:flex fixed left-0 top-0 h-full w-14 flex-col items-center py-8 z-[100]"
        style={{
          // FIX: use solid dark bg always so icons/text never go black against light page sections
          background: scrolled
            ? "rgba(4,4,8,0.97)"
            : "rgba(4,4,8,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.02), 4px 0 32px rgba(0,0,0,0.5)",
          transition: "background 0.3s ease",
        }}
      >
        <div style={{ marginBottom: 32, flexShrink: 0 }}>
          <a href="#hero" style={{ width: 38, height: 38, background: "#0D82E4", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 28px rgba(13,130,228,0.7)"; e.currentTarget.style.background = "#2a9af0"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 18px rgba(13,130,228,0.45)"; e.currentTarget.style.background = "#0D82E4"; }}
          >
            <picture>
              <source srcSet="/O.avif" type="image/avif" />
              <source srcSet="/O.webp" type="image/webp" />
              <img src="/O.png" alt="Zephvion Main Logo Glyph" width="64" height="64" style={{ width: 22, height: 22, objectFit: "contain" }} />
            </picture>
          </a>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="nav-link-rail">{label}</a>
          ))}
        </div>

        <div ref={popupRef} style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <button className={`nav-icon-btn${popup === "hub" ? " active" : ""}`} style={{ width: 36, height: 36 }} onClick={() => setPopup(p => p === "hub" ? null : "hub")} title="Network Hub">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>hub</span>
            </button>
            {popup === "hub" && <HubPopup onClose={() => setPopup(null)} />}
          </div>
          <div style={{ position: "relative" }}>
            <button className={`nav-icon-btn${popup === "sec" ? " active" : ""}`} style={{ width: 36, height: 36 }} onClick={() => setPopup(p => p === "sec" ? null : "sec")} title="Security">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>security</span>
            </button>
            {popup === "sec" && <SecPopup onClose={() => setPopup(null)} />}
          </div>
        </div>
      </nav>

      {/* ── MOBILE top bar — scroll-triggered ── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4"
        style={{
          height: 52,
          background: scrolled ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.95)" : "none",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Logo + wordmark */}
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#0D82E4", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(13,130,228,0.4)" }}>
            <picture>
              <source srcSet="/O.avif" type="image/avif" />
              <source srcSet="/O.webp" type="image/webp" />
              <img src="/O.png" alt="Zephvion Logo Glyph" width="32" height="32" style={{ width: 18, height: 18, objectFit: "contain" }} />
            </picture>
          </div>
          <picture>
            <source srcSet="/Z.avif" type="image/avif" />
            <source srcSet="/Z.webp" type="image/webp" />
            <img src="/Z.png" alt="Zephvion Enterprise Technology Wordmark" width="180" height="40" style={{ height: 12, width: "auto", objectFit: "contain", opacity: 0.8 }} />
          </picture>
        </a>

        {/* Right: hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              width: 32, height: 32, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 4,
              border: `1px solid ${open ? "#0D82E4" : "rgba(255,255,255,0.1)"}`,
              background: open ? "rgba(13,130,228,0.1)" : "transparent",
              cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 13, height: 1,
                background: open ? "#0D82E4" : "rgba(255,255,255,0.65)",
                transition: "all 0.25s",
                transform: open ? (i === 0 ? "translateY(5px) rotate(45deg)" : i === 2 ? "translateY(-5px) rotate(-45deg)" : "none") : "none",
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[99]"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="lg:hidden fixed top-0 right-0 bottom-0 z-[101] flex flex-col"
        style={{
          width: 260,
          background: "rgba(4,4,8,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(13,130,228,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 200, height: 150, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(13,130,228,0.06) 0%, transparent 70%)" }} />

        <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.3em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>NAVIGATION</span>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", cursor: "pointer", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
          </button>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", position: "relative", zIndex: 1 }}>
          {NAV_LINKS.map(({ label, href }, i) => (
            <a key={href} href={href} onClick={() => { setActive(href); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: i < NAV_LINKS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", textDecoration: "none", color: active === href ? "#0D82E4" : "rgba(255,255,255,0.5)", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = active === href ? "#0D82E4" : "rgba(255,255,255,0.5)"}
            >
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "#0D82E4", opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>

        <div style={{ padding: "14px 20px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, letterSpacing: "0.2em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase", marginBottom: 2 }}>SYSTEM</p>
          {[
            { id: "hub", icon: "hub", label: "Network Hub", color: "#0DE4CF", value: "5/5" },
            { id: "sec", icon: "security", label: "Security", color: "#0D82E4", value: "98%" },
          ].map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: `1px solid ${item.color}1f`, background: `${item.color}08` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: item.color }}>{item.icon}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.15em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>{item.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <PulseDot color={item.color} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: item.color }}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}