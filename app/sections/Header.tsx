"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Ship, Waves } from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'VPN Reviews', href: '/#rankings' },
  { label: 'Compare', href: '/#comparison' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-ocean-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 flex items-center justify-center shadow-md shadow-ocean-200/30">
            <Ship className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-gray-900 group-hover:text-ocean-600 transition-colors">
              TideDriven
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              Studio #27 · Tunnel Picks
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-ocean-600 rounded-lg hover:bg-ocean-50 transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/all-tools"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-ocean-500 hover:bg-ocean-600 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-ocean-200/40"
          >
            <Waves className="w-4 h-4" />
            Compare VPNs
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gray-600 hover:text-ocean-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-xl border-b border-ocean-100 shadow-lg"
        >
          <nav className="px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/all-tools"
              className="mt-2 px-5 py-3 text-sm font-medium text-white bg-ocean-500 hover:bg-ocean-600 rounded-xl text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare VPNs
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
