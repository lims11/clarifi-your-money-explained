import LandingPageShell from '@/components/landing/LandingPageShell';

export default function TermsPage() {
  return (
    <LandingPageShell>
      <section className="bg-[#1E1B4B] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Terms of Service</h1>
          <p className="text-[#C4B5FD]">Last updated: 1 April 2025</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray prose-headings:text-[#111827] prose-headings:font-extrabold prose-p:text-[#6B7280] prose-p:leading-relaxed prose-li:text-[#6B7280] prose-a:text-[#5B5BD6]">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the Sonfi app and website ("Service"), you agree to be bound by these Terms of Service. If you don't agree, please don't use the Service.</p>

          <h2>2. Description of Service</h2>
          <p>Sonfi is a personal finance management app that helps you track spending, monitor budgets, view your credit score, and receive AI-powered financial insights. Sonfi is not a bank, lender, or financial adviser.</p>

          <h2>3. Eligibility</h2>
          <p>You must be at least 18 years old and a UK resident to use Sonfi. By creating an account, you represent that you meet these requirements.</p>

          <h2>4. Your Account</h2>
          <p>You are responsible for maintaining the security of your account credentials. You must not share your login details or let others access your account. Notify us immediately if you suspect unauthorised access.</p>

          <h2>5. Open Banking Connections</h2>
          <p>When you connect bank accounts through Open Banking, you authorise Sonfi to access your financial data on a read-only basis. We cannot initiate transactions or move funds. You may disconnect accounts at any time.</p>

          <h2>6. AI Features</h2>
          <p>Sonfi's AI chat and Pulse insights provide general financial information based on your data. This is not financial advice. Always consult a qualified financial adviser before making significant financial decisions.</p>

          <h2>7. Credit Score</h2>
          <p>Credit score data is provided by Experian. Checking your score through Sonfi is a soft search and does not affect your credit rating. Scores are for informational purposes and may differ from scores seen elsewhere.</p>

          <h2>8. Subscriptions & Billing</h2>
          <p>Sonfi offers free and paid plans. Paid subscriptions are billed monthly. You can cancel at any time, and your subscription will remain active until the end of the current billing period. No refunds are provided for partial months.</p>

          <h2>9. Acceptable Use</h2>
          <p>You agree not to: use the Service for any illegal purpose; attempt to reverse-engineer or exploit the Service; misrepresent your identity; or interfere with other users' access to the Service.</p>

          <h2>10. Intellectual Property</h2>
          <p>All content, design, logos, and code in Sonfi are owned by Sonfi Ltd. You may not copy, modify, or distribute any part of the Service without our written permission.</p>

          <h2>11. Limitation of Liability</h2>
          <p>Sonfi is provided "as is." We do not guarantee the accuracy of financial data or AI-generated insights. To the maximum extent permitted by law, Sonfi Ltd shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>

          <h2>12. Termination</h2>
          <p>We may suspend or terminate your account if you breach these terms. You can delete your account at any time from the Settings page.</p>

          <h2>13. Governing Law</h2>
          <p>These terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of England and Wales.</p>

          <h2>14. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:legal@sonfi.app">legal@sonfi.app</a>.</p>
        </div>
      </section>
    </LandingPageShell>
  );
}
