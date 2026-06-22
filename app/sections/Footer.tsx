"use client";
import { Ship, Waves, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  'VPN Services': [
    { name: 'Top Rankings', href: '/#rankings' },
    { name: 'VPN Comparisons', href: '/blog' },
    { name: 'All VPN Reviews', href: '/all-tools' },
    { name: 'Browse Categories', href: '/#comparison' },
  ],
  Studio: [
    { name: 'About Tunnel Picks', href: '/about' },
    { name: 'Our Team', href: '/about#team' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ],
  Resources: [
    { name: 'VPN Guides', href: '/blog' },
    { name: 'Privacy Tips', href: '/blog' },
    { name: 'Speed Tests', href: '/blog' },
    { name: 'Help Center', href: '/contact' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Affiliate Disclosure', href: '/disclosure' },
    { name: 'Cookie Policy', href: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-ocean-100 bg-gradient-to-b from-white to-ocean-50/40">
      {/* Wave top decoration */}
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden opacity-30">
        <svg viewBox="0 0 1440 24" className="w-full h-full" preserveAspectRatio="none">
          <path fill="#0EA5E9" d="M0,12 C240,24 480,0 720,12 C960,24 1200,0 1440,12 L1440,24 L0,24 Z" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 flex items-center justify-center shadow-md shadow-ocean-200/30">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-gray-900">Tunnel Picks</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Studio #27</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Tunnel Picks — a VPN comparison platform based in Helsingborg, Sweden.
              We curate and compare VPN services with a focus on privacy, security,
              and real-world performance. Tunnel Picks is our VPN comparison project.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>Helsingborg, Sweden</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Mail className="w-3 h-3" />
              <a href="mailto:secure@tunnelpicks.net" className="hover:text-ocean-500 transition-colors">secure@tunnelpicks.net</a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-ocean-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-ocean-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Tunnel Picks. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-ocean-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-ocean-600 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-ocean-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
