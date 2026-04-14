import LandingPageShell from '@/components/landing/LandingPageShell';

export default function PrivacyPage() {
  return (
    <LandingPageShell>
      <section className="bg-[#1E1B4B] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-[#C4B5FD]">Last updated: 1 April 2025</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray prose-headings:text-[#111827] prose-headings:font-extrabold prose-p:text-[#6B7280] prose-p:leading-relaxed prose-li:text-[#6B7280] prose-a:text-[#5B5BD6]">
          <h2>1. Introduction</h2>
          <p>Sonfi Ltd ("we", "us", "our") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal data when you use the Sonfi app and website.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect the following categories of personal data:</p>
          <ul>
            <li><strong>Account information:</strong> Name, email address, and password when you create an account.</li>
            <li><strong>Financial data:</strong> Bank account balances, transaction history, and credit score data accessed via Open Banking and Experian with your explicit consent.</li>
            <li><strong>Usage data:</strong> How you interact with the app, including pages visited, features used, and session duration.</li>
            <li><strong>Device data:</strong> Device type, operating system, browser type, and IP address.</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and personalise the Sonfi service, including AI-powered insights and Pulse alerts.</li>
            <li>Display your credit score and factor breakdown from Experian.</li>
            <li>Generate budgets, goals, and spending analytics across your connected accounts.</li>
            <li>Send important service notifications and, with your consent, marketing communications.</li>
            <li>Improve and develop new features based on aggregated, anonymised usage patterns.</li>
          </ul>

          <h2>4. Open Banking</h2>
          <p>We access your bank data through FCA-regulated Open Banking providers. This is read-only access — we can never initiate payments or move your money. You can revoke access at any time from within the app or directly with your bank.</p>

          <h2>5. Data Sharing</h2>
          <p>We do not sell your personal data. We share data only with:</p>
          <ul>
            <li><strong>Open Banking providers</strong> to fetch your account and transaction data.</li>
            <li><strong>Experian</strong> to retrieve your credit score (soft search only — no impact on your rating).</li>
            <li><strong>Cloud infrastructure providers</strong> who process data on our behalf under strict contracts.</li>
            <li><strong>Law enforcement</strong> when required by law.</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>We protect your data with 256-bit TLS encryption in transit, AES-256 encryption at rest, and strict access controls. Our infrastructure is hosted in EU data centres compliant with ISO 27001.</p>

          <h2>7. Data Retention</h2>
          <p>We retain your data for as long as your account is active. If you delete your account, we will erase your personal data within 30 days, except where retention is required by law.</p>

          <h2>8. Your Rights</h2>
          <p>Under GDPR, you have the right to access, rectify, delete, and port your data. You can also object to or restrict processing. To exercise your rights, contact us at privacy@sonfi.app.</p>

          <h2>9. Cookies</h2>
          <p>We use essential cookies to keep the app functioning and analytics cookies (with your consent) to understand usage. See our <a href="/cookies">Cookie Policy</a> for details.</p>

          <h2>10. Changes</h2>
          <p>We may update this policy from time to time. Material changes will be communicated via email or in-app notification.</p>

          <h2>11. Contact</h2>
          <p>Sonfi Ltd, registered in England and Wales. Data Protection Officer: <a href="mailto:privacy@sonfi.app">privacy@sonfi.app</a></p>
        </div>
      </section>
    </LandingPageShell>
  );
}
