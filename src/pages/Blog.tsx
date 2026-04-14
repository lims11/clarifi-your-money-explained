import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const posts = [
  {
    category: 'Product',
    title: 'Introducing Pulse: proactive insights that save you money',
    excerpt: 'We built Pulse to surface the things you\'d miss in your bank statements. Here\'s how it works and why it matters.',
    date: 'Apr 10, 2025',
    readTime: '4 min',
    color: 'bg-[#5B5BD6]',
    featured: true,
  },
  {
    category: 'Credit Score',
    title: '7 ways to boost your Experian score in 90 days',
    excerpt: 'Practical, proven strategies to improve your credit score — no gimmicks, just what actually works.',
    date: 'Apr 5, 2025',
    readTime: '6 min',
    color: 'bg-emerald-500',
  },
  {
    category: 'Budgeting',
    title: 'The 50/30/20 rule is dead. Try this instead.',
    excerpt: 'Why rigid budgeting frameworks fail — and how Sonfi\'s flexible approach helps you save without the guilt.',
    date: 'Mar 28, 2025',
    readTime: '5 min',
    color: 'bg-amber-500',
  },
  {
    category: 'Open Banking',
    title: 'Is Open Banking safe? Everything you need to know',
    excerpt: 'A clear, no-jargon guide to how Open Banking works, who regulates it, and why your money is safe.',
    date: 'Mar 20, 2025',
    readTime: '7 min',
    color: 'bg-blue-500',
  },
  {
    category: 'AI',
    title: 'How Sonfi AI understands your spending habits',
    excerpt: 'A behind-the-scenes look at how our AI categorises transactions and generates personalised insights.',
    date: 'Mar 12, 2025',
    readTime: '5 min',
    color: 'bg-pink-500',
  },
  {
    category: 'Savings',
    title: 'How UK millennials are saving £200/month with Sonfi',
    excerpt: 'Real stories from users who turned their finances around using automated tracking and AI nudges.',
    date: 'Mar 5, 2025',
    readTime: '4 min',
    color: 'bg-teal-500',
  },
];

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-[#1E1B4B] py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">The Sonfi Blog</h1>
          <p className="text-[#C4B5FD] text-lg max-w-xl mx-auto">Money tips, product updates, and financial insights — from the team building your smart money app.</p>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#5B5BD6]/5 to-[#E8E5F5] rounded-3xl p-8 sm:p-12 hover:shadow-xl transition-shadow cursor-pointer">
            <span className={`${featured.color} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>{featured.category}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-4 mb-3">{featured.title}</h2>
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-4 max-w-2xl">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-[#6B7280]">
              <span>{featured.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <article key={post.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <span className={`${post.color} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>{post.category}</span>
                <h3 className="text-lg font-bold text-[#111827] mt-4 mb-2 group-hover:text-[#5B5BD6] transition-colors">{post.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#F8F9FC] py-16 sm:py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight mb-3">Stay in the loop</h2>
          <p className="text-[#6B7280] text-sm mb-6">Get money tips and Sonfi updates delivered to your inbox. No spam, ever.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com" className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]/30" />
            <button className="bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </LandingPageShell>
  );
}
