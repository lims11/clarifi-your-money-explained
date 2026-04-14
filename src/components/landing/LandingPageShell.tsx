import LandingNav from './LandingNav';
import logoFooter from '@/assets/sonfi-logo-horizontal-dark.png';
import { Link } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function LandingPageShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <LandingNav />
      <div className="pt-16">{children}</div>

      {/* Footer */}
      <footer className="bg-[#E8E5F5] border-t border-[#D6D0EC] text-[#1E1B4B] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <img src={logoFooter} alt="Sonfi" className="h-8 mb-3" />
              <p className="text-sm text-[#5B5BD6] mb-4">Your smart money companion.</p>
              <div className="flex gap-3">
                {['𝕏', 'in', '📸'].map((s) => (
                  <div key={s} className="w-8 h-8 rounded-full bg-[#1E1B4B]/10 flex items-center justify-center text-xs text-[#1E1B4B]/70 hover:bg-[#1E1B4B]/20 transition-colors cursor-pointer">{s}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5B5BD6] mb-3">Product</div>
              <ul className="space-y-2 text-sm text-[#1E1B4B]/70">
                <li><Link to="/features" className="hover:text-[#1E1B4B] transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-[#1E1B4B] transition-colors">Pricing</Link></li>
                <li><Link to="/credit-score" className="hover:text-[#1E1B4B] transition-colors">Credit Score</Link></li>
                <li><Link to="/pulse-info" className="hover:text-[#1E1B4B] transition-colors">Pulse</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5B5BD6] mb-3">Company</div>
              <ul className="space-y-2 text-sm text-[#1E1B4B]/70">
                <li><Link to="/about" className="hover:text-[#1E1B4B] transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-[#1E1B4B] transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-[#1E1B4B] transition-colors">Careers</Link></li>
                <li><Link to="/press" className="hover:text-[#1E1B4B] transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5B5BD6] mb-3">Legal</div>
              <ul className="space-y-2 text-sm text-[#1E1B4B]/70">
                <li><Link to="/privacy" className="hover:text-[#1E1B4B] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#1E1B4B] transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-[#1E1B4B] transition-colors">Cookie Settings</Link></li>
                <li><Link to="/security" className="hover:text-[#1E1B4B] transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1E1B4B]/10 pt-6 text-xs text-[#5B5BD6] text-center leading-relaxed">
            © 2025 Sonfi Ltd. Sonfi is not a lender or credit broker. Powered by Experian. Open Banking authorised. All figures shown are illustrative.
          </div>
        </div>
      </footer>
    </div>
  );
}
