import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '/#features', isHash: true },
    { label: 'Pricing', href: '/pricing', isHash: false },
    { label: 'Blog', href: '#', isHash: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-[#1a1145] font-extrabold text-xl tracking-tight">
          SONFI
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) =>
            l.isHash ? (
              <a key={l.label} href={l.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{l.label}</a>
            ) : (
              <Link key={l.label} to={l.href} className={`text-sm font-medium transition-colors ${location.pathname === l.href ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>{l.label}</Link>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">Log in</Link>
          <Link to="/login?tab=signup" className="text-sm font-semibold text-white bg-[#5B5BD6] hover:bg-[#4A4AC4] px-5 py-2.5 rounded-full transition-all hover:scale-[1.02]">Get started free</Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-in slide-in-from-top">
          {navLinks.map((l) =>
            l.isHash ? (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 py-2">{l.label}</a>
            ) : (
              <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 py-2">{l.label}</Link>
            )
          )}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link to="/login" className="block text-sm font-medium text-gray-600 py-2">Log in</Link>
            <Link to="/login?tab=signup" className="block text-center text-sm font-semibold text-white bg-[#5B5BD6] px-5 py-2.5 rounded-full">Get started free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
