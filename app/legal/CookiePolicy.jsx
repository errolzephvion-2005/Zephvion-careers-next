/**
 * CookiePolicy — legal/CookiePolicy.jsx
 * Import and render with: <CookiePolicy onClose={() => setCookiesOpen(false)} />
 */
import LegalModal from "./LegalModal";

export default function CookiePolicy({ onClose }) {
  return (
    <LegalModal title="COOKIE POLICY" tag="// TRACKING_MANIFEST" onClose={onClose}>

      <p className="lm-body-text" style={{ marginTop: 16 }}>
        This Cookie Policy explains how Zephvion Pvt. Ltd. uses cookies and similar tracking
        technologies on our website. By continuing to browse, you consent to our use of cookies
        as described below.
      </p>

      <p className="lm-section-title">01 · What Are Cookies</p>
      <p className="lm-body-text">
        Cookies are small text files stored on your device when you visit a website. They allow
        the site to remember your preferences and actions over a period of time, and help us
        understand how visitors interact with our content.
      </p>

      <p className="lm-section-title">02 · Types of Cookies We Use</p>

      <p className="lm-body-text" style={{ color: "rgba(255,255,255,.65)", marginBottom: 4 }}>
        <strong style={{ color: "rgba(255,255,255,.8)", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".1em" }}>ESSENTIAL</strong>
      </p>
      <p className="lm-body-text">
        Required for the website to function correctly. These cannot be disabled as they are
        necessary for security, session management, and core site functionality.
      </p>

      <p className="lm-body-text" style={{ color: "rgba(255,255,255,.65)", marginBottom: 4 }}>
        <strong style={{ color: "rgba(255,255,255,.8)", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".1em" }}>ANALYTICS</strong>
      </p>
      <p className="lm-body-text">
        Help us understand how visitors reach and navigate our site. We use anonymised
        data to improve content and performance. Providers may include Google Analytics
        or similar tools operating under appropriate data processing agreements.
      </p>

      <p className="lm-body-text" style={{ color: "rgba(255,255,255,.65)", marginBottom: 4 }}>
        <strong style={{ color: "rgba(255,255,255,.8)", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".1em" }}>PREFERENCE</strong>
      </p>
      <p className="lm-body-text">
        Remember your settings and choices (such as language or display preferences)
        to provide a more personalised experience on return visits.
      </p>

      <p className="lm-body-text" style={{ color: "rgba(255,255,255,.65)", marginBottom: 4 }}>
        <strong style={{ color: "rgba(255,255,255,.8)", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".1em" }}>MARKETING</strong>
      </p>
      <p className="lm-body-text">
        Used to deliver relevant content and measure the effectiveness of campaigns.
        These are only placed with your explicit consent.
      </p>

      <p className="lm-section-title">03 · Third-Party Cookies</p>
      <p className="lm-body-text">
        Some cookies are set by third-party services embedded on our site (e.g. embedded
        maps, analytics providers, chat tools). These third parties have their own privacy
        and cookie policies, and we encourage you to review them. We do not control these
        third-party cookies.
      </p>

      <p className="lm-section-title">04 · Cookie Durations</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
        {[
          "Session cookies — expire when you close your browser",
          "Persistent cookies — remain for a defined period (typically 1–24 months)",
          "Third-party cookies — duration determined by the third-party provider",
        ].map(t => <li key={t} className="lm-li">{t}</li>)}
      </ul>

      <p className="lm-section-title">05 · Managing Cookies</p>
      <p className="lm-body-text">
        You can control and delete cookies through your browser settings. Most browsers allow
        you to refuse cookies, delete existing cookies, or be notified when a new cookie is
        set. Note that disabling certain cookies may affect site functionality.
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
        {[
          "Chrome: Settings → Privacy & Security → Cookies",
          "Firefox: Settings → Privacy & Security → Cookies and Site Data",
          "Safari: Preferences → Privacy → Manage Website Data",
          "Edge: Settings → Cookies and Site Permissions",
        ].map(t => <li key={t} className="lm-li">{t}</li>)}
      </ul>

      <p className="lm-section-title">06 · Updates to This Policy</p>
      <p className="lm-body-text">
        We may update this Cookie Policy periodically to reflect changes in technology or
        regulation. The latest version will always be available on this page with the
        updated date noted above.
      </p>

      <p className="lm-section-title">07 · Contact</p>
      <p className="lm-body-text">
        Questions or requests regarding cookies? Email us at{" "}
        <a href="mailto:hr@zephvion.com" style={{ color: "#0D82E4", textDecoration: "none" }}>hr@zephvion.com</a>.
      </p>

    </LegalModal>
  );
}
