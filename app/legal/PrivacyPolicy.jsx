/**
 * PrivacyPolicy — legal/PrivacyPolicy.jsx
 * Import and render with: <PrivacyPolicy onClose={() => setPrivacyOpen(false)} />
 */
import LegalModal from "./LegalModal";

export default function PrivacyPolicy({ onClose }) {
  return (
    <LegalModal title="PRIVACY POLICY" tag="// DATA_PROTOCOL" onClose={onClose}>

      <p className="lm-body-text" style={{ marginTop: 16 }}>
        Zephvion Pvt. Ltd. ("Zephvion", "we", "us") is committed to protecting your personal
        information. This policy explains what data we collect, how we use it, and your rights
        regarding that data when you visit our website or engage our services.
      </p>

      <p className="lm-section-title">01 · Information We Collect</p>
      <p className="lm-body-text">We collect information you provide directly, including:</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
        {[
          "Contact details (name, email address, phone number)",
          "Company name, job title, and professional context",
          "Messages and enquiries submitted via our contact or demo forms",
          "Technical data such as IP address, browser type, and device information",
          "Usage data — pages visited, time on site, referral sources",
        ].map(t => <li key={t} className="lm-li">{t}</li>)}
      </ul>

      <p className="lm-section-title">02 · How We Use Your Data</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
        {[
          "To respond to enquiries and schedule demo sessions",
          "To deliver and improve our services and infrastructure",
          "To send relevant service updates (you may opt out at any time)",
          "To analyse website performance and optimise user experience",
          "To comply with applicable legal obligations",
        ].map(t => <li key={t} className="lm-li">{t}</li>)}
      </ul>

      <p className="lm-section-title">03 · Legal Basis for Processing</p>
      <p className="lm-body-text">
        We process your data under the following legal bases: performance of a contract,
        our legitimate business interests, compliance with legal obligations, and — where
        required — your explicit consent. You may withdraw consent at any time.
      </p>

      <p className="lm-section-title">04 · Data Sharing</p>
      <p className="lm-body-text">
        We do not sell, trade, or rent your personal data. We may share data with trusted
        third-party service providers (hosting, analytics, CRM) under strict data processing
        agreements. We may also disclose data when required by law or to protect our legal rights.
      </p>

      <p className="lm-section-title">05 · Data Retention</p>
      <p className="lm-body-text">
        We retain personal data only as long as necessary to fulfil the purposes outlined here,
        or as required by applicable law. Contact and enquiry data is typically retained for
        36 months unless an active client relationship exists.
      </p>

      <p className="lm-section-title">06 · Your Rights</p>
      <p className="lm-body-text">Depending on your jurisdiction, you have the right to:</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
        {[
          "Access the personal data we hold about you",
          "Request correction of inaccurate or incomplete data",
          "Request deletion of your data ('right to be forgotten')",
          "Object to or restrict certain processing activities",
          "Data portability — receive your data in a structured, machine-readable format",
          "Lodge a complaint with your local data protection authority",
        ].map(t => <li key={t} className="lm-li">{t}</li>)}
      </ul>

      <p className="lm-section-title">07 · Security</p>
      <p className="lm-body-text">
        We implement industry-standard technical and organisational measures to safeguard your
        data, including TLS encryption in transit, access controls, and regular security reviews.
        No method of transmission over the internet is 100% secure; we cannot guarantee absolute
        security but take all reasonable precautions.
      </p>

      <p className="lm-section-title">08 · Contact</p>
      <p className="lm-body-text">
        For any privacy-related queries or to exercise your rights, contact us at{" "}
        <a href="mailto:hr@zephvion.com" style={{ color: "#0D82E4", textDecoration: "none" }}>hr@zephvion.com</a>.
        We will respond within 30 days.
      </p>

    </LegalModal>
  );
}
