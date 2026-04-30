/**
 * TermsOfService — legal/TermsOfService.jsx
 * Import and render with: <TermsOfService onClose={() => setTermsOpen(false)} />
 */
import LegalModal from "./LegalModal";

export default function TermsOfService({ onClose }) {
  return (
    <LegalModal title="TERMS OF SERVICE" tag="// SERVICE_AGREEMENT" onClose={onClose}>

      <p className="lm-body-text" style={{ marginTop: 16 }}>
        These Terms of Service ("Terms") govern your access to and use of Zephvion Pvt. Ltd.'s
        website, products, and services. By accessing our site or engaging our services, you
        agree to be bound by these Terms. If you do not agree, please discontinue use immediately.
      </p>

      <p className="lm-section-title">01 · Services</p>
      <p className="lm-body-text">
        Zephvion provides technology consulting, AI automation, web and app development,
        infrastructure architecture, and related professional services. Specific deliverables,
        timelines, and fees are defined in individual project agreements or statements of work
        entered into between Zephvion and the client.
      </p>

      <p className="lm-section-title">02 · Acceptable Use</p>
      <p className="lm-body-text">You agree not to:</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
        {[
          "Use our services for any unlawful, fraudulent, or abusive purpose",
          "Attempt to gain unauthorised access to our systems or networks",
          "Reverse-engineer, decompile, or disassemble any of our proprietary software",
          "Use our services to transmit malicious code, spam, or harmful content",
          "Misrepresent your identity or affiliation when engaging with Zephvion",
        ].map(t => <li key={t} className="lm-li">{t}</li>)}
      </ul>

      <p className="lm-section-title">03 · Intellectual Property</p>
      <p className="lm-body-text">
        All content on this website — including text, graphics, logos, and code — is the
        intellectual property of Zephvion Pvt. Ltd. unless otherwise stated. Work product
        developed for clients is governed by the IP clauses in the applicable project agreement.
        You may not reproduce or redistribute Zephvion's proprietary materials without written
        consent.
      </p>

      <p className="lm-section-title">04 · Payment & Fees</p>
      <p className="lm-body-text">
        Payment terms are specified in individual project agreements. Invoices are due within
        the period stated therein. Late payments may incur interest at a rate of 1.5% per month
        or the maximum permitted by law. Zephvion reserves the right to suspend services for
        accounts with outstanding balances beyond the agreed payment period.
      </p>

      <p className="lm-section-title">05 · Confidentiality</p>
      <p className="lm-body-text">
        Both parties agree to keep confidential any non-public information shared during the
        course of an engagement, including technical specifications, business data, and
        strategic plans. Confidentiality obligations survive the termination of any agreement
        for a period of three (3) years.
      </p>

      <p className="lm-section-title">06 · Limitation of Liability</p>
      <p className="lm-body-text">
        To the maximum extent permitted by applicable law, Zephvion's total liability for any
        claim arising out of or related to these Terms or our services shall not exceed the
        total fees paid by you to Zephvion in the three (3) months preceding the claim.
        Zephvion shall not be liable for indirect, incidental, special, or consequential damages.
      </p>

      <p className="lm-section-title">07 · Termination</p>
      <p className="lm-body-text">
        Either party may terminate an engagement by providing written notice as specified in
        the applicable project agreement. Zephvion reserves the right to terminate access to
        this website or our services immediately for material breach of these Terms.
      </p>

      <p className="lm-section-title">08 · Governing Law</p>
      <p className="lm-body-text">
        These Terms are governed by the laws of India. Any disputes arising shall be subject
        to the exclusive jurisdiction of the courts of Bangalore, Karnataka, India.
      </p>

      <p className="lm-section-title">09 · Changes to Terms</p>
      <p className="lm-body-text">
        We may update these Terms from time to time. Material changes will be notified via
        email or a notice on our website. Continued use of our services after any update
        constitutes acceptance of the revised Terms.
      </p>

      <p className="lm-section-title">10 · Contact</p>
      <p className="lm-body-text">
        Questions about these Terms? Reach us at{" "}
        <a href="mailto:hr@zephvion.com" style={{ color: "#0D82E4", textDecoration: "none" }}>hr@zephvion.com</a>.
      </p>

    </LegalModal>
  );
}
