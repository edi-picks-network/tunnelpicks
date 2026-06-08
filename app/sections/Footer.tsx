"use client";
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Product: [
    { name: 'Browse VPN Services', href: '/' },
    { name: 'VPN Categories', href: '/#categories' },
    { name: 'VPN Comparisons', href: '/blog' },
    { name: 'API Access', href: '/' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '#' },
    { name: 'Press Kit', href: '#' },
  ],
  Resources: [
    { name: 'Documentation', href: '/' },
    { name: 'Help Center', href: '/contact' },
    { name: 'Community', href: '#' },
    { name: 'Status', href: '#' },
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
    <footer className="relative border-t border-gray-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Tunnel Picks</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The most comprehensive directory of VPN services. Discover, compare, and read reviews for the best virtual private network services for your privacy and security needs.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
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
                        className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
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

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Tunnel Picks. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-emerald-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-emerald-600 transition-colors">
              Terms
            </Link>
            <a href="#" className="text-sm text-gray-400 hover:text-emerald-600 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
