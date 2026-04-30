'use client';

import { useState } from "react";
import PrivacyPolicy from "@/app/legal/PrivacyPolicy";
import TermsOfService from "@/app/legal/TermsOfService";
import CookiePolicy from "@/app/legal/CookiePolicy";


const BLUE = "#0D82E4";
const TURQUOISE = "#0DE4CF";

const socials = [
  {
    name: "WhatsApp",
    href: "https://wa.me/919959490999",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.364 3.488" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/zephvion",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    href: "https://x.com/zephvion",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/zephvion.pvt.ltd",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

function SocialIcon({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer me"
      title={item.name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40, height: 40,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${hovered ? BLUE : "rgba(255,255,255,0.1)"}`,
        color: hovered ? BLUE : "rgba(255,255,255,0.35)",
        background: hovered ? "rgba(13,130,228,0.08)" : "transparent",
        textDecoration: "none",
        transition: "all 0.2s ease",
        flexShrink: 0,
        filter: hovered ? `drop-shadow(0 0 6px rgba(13,130,228,0.5))` : "none",
      }}
    >
      {item.icon}
    </a>
  );
}

function GhostWordmark() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", overflow: "hidden",
    }}>
      <img
        src="/Logo.svg" alt="Zephvion Secondary Logo Wordmark Background" width="1000" height="500" loading="lazy"
        style={{ width: "100%", height: "50%", maxWidth: "1000px", opacity: 0.03, objectFit: "contain", filter: "brightness(0) invert(1)" }}
      />
    </div>
  );
}

/* Small reusable legal link button */
function LegalBtn({ label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        fontFamily: "'DM Mono',monospace",
        fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase",
        color: hovered ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.30)",
        transition: "color 0.2s",
      }}
    >
      {label}
    </button>
  );
}

export default function ZephvionFooter() {
  const [modal, setModal] = useState(null); // null | 'privacy' | 'terms' | 'cookies'

  return (
    <>
      {/* Legal modals */}
      {modal === "privacy" && <PrivacyPolicy onClose={() => setModal(null)} />}
      {modal === "terms" && <TermsOfService onClose={() => setModal(null)} />}
      {modal === "cookies" && <CookiePolicy onClose={() => setModal(null)} />}

      <footer style={{
        background: "#000", color: "#fff",
        position: "relative", overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <GhostWordmark />

        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(13,130,228,0.055) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }} />

        {/* Soft blue radial from bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 800, height: 260, pointerEvents: "none",
          background: "radial-gradient(ellipse at center bottom, rgba(13,130,228,0.07) 0%, transparent 70%)",
        }} />

        {/* Scan line top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: 0,
            width: 120, height: 1,
            background: `linear-gradient(to right, transparent, ${TURQUOISE}, transparent)`,
            boxShadow: `0 0 10px ${TURQUOISE}`,
            animation: "fscan 3s linear infinite",
          }} />
        </div>

        {/* Top rule */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* MAIN */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 0", position: "relative", zIndex: 2 }}>

          {/* ── MOBILE LAYOUT ── */}
          <div className="flex flex-col items-center gap-5 pb-6 md:hidden">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <img src="/o.svg" alt="Zephvion O-Glyph Icon" width="32" height="32" loading="lazy" style={{ height: 32, objectFit: "contain" }} />
              <picture>
                <source srcSet="/Z.avif" type="image/avif" />
                <source srcSet="/Z.webp" type="image/webp" />
                <img src="/Z.png" alt="Zephvion Enterprise Wordmark Logo" width="180" height="40" loading="lazy" style={{ height: 14, width: "auto", objectFit: "contain" }} />
              </picture>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>PVT.LTD</div>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", justifyContent: "center" }}>
              {["Services", "Architecture", "Systems", "Process"].map(label => (
                <a key={label} href={`#${label.toLowerCase()}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.75)"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
                >{label}</a>
              ))}
            </nav>
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map(item => <SocialIcon key={item.name} item={item} />)}
            </div>
            <a href="mailto:hr@zephvion.com" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = BLUE}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.22)"}
            >hello@zephvion.com</a>
          </div>

          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden md:grid md:grid-cols-3 items-center pb-10 pt-6" style={{ gap: "0 40px" }}>
            {/* LEFT — nav */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start", paddingLeft: 8 }}>
              {["Services", "Architecture", "Systems", "Process"].map(label => (
                <a key={label} href={`#${label.toLowerCase()}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", textDecoration: "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; }}
                >
                  <span style={{ width: 16, height: 1, background: "rgba(255,255,255,0.15)", display: "inline-block", flexShrink: 0 }} />
                  {label}
                </a>
              ))}
            </nav>

            {/* CENTER — logo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <img src="/o.svg" alt="Zephvion O-Glyph Desktop Icon" width="48" height="48" loading="lazy" style={{ height: 48, objectFit: "contain" }} />
              <picture>
                <source srcSet="/Z.avif" type="image/avif" />
                <source srcSet="/Z.webp" type="image/webp" />
                <img src="/Z.png" alt="Zephvion Enterprise Wordmark Desktop Logo" width="180" height="40" loading="lazy" style={{ height: 18, width: "auto", objectFit: "contain" }} />
              </picture>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>PVT.LTD</div>
            </div>

            {/* RIGHT — socials + email */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, paddingRight: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {socials.map(item => <SocialIcon key={item.name} item={item} />)}
              </div>
              <a href="mailto:hello@zephvion.com" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = BLUE}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.22)"}
              >hello@zephvion.com</a>
            </div>
          </div>

          {/* DIVIDER */}
          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />

          {/* BOTTOM BAR */}
          {/* BOTTOM BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 py-3 md:py-4">

            <span className="w-full md:w-1/3 text-center md:text-left" style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)" }}>
              © 2026 Zephvion Pvt.Ltd. All rights reserved.
            </span>

            <div className="w-full md:w-1/3 flex justify-center" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <LegalBtn label="Privacy" onClick={() => setModal("privacy")} />
              <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 8 }}>·</span>
              <LegalBtn label="Terms" onClick={() => setModal("terms")} />
              <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 8 }}>·</span>
              <LegalBtn label="Cookies" onClick={() => setModal("cookies")} />
            </div>

            <span className="hidden md:block md:w-1/3 text-right" style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)" }}>
              Engineered with precision{" "}
              <span style={{ color: BLUE }}>▲</span>
            </span>

          </div>
        </div>
      </footer>
    </>
  );
}
