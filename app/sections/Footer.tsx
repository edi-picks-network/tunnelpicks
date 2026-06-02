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
    { name: 'VPN Categories', href: '/' },
    { name: 'VPN Comparisons', href: '/' },
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
    <footer className="relative border-t border-[#2D2D6B] bg-[#0A0A1A]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand Column */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DC2626] to-[#EF4444] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#F0F0FF]">Tunnel Picks</span>
            </Link>
            <p className="text-sm text-[#A5B4FC] leading-relaxed mb-6">
              The most comprehensive directory of VPN services. Discover, compare, and read reviews for the best virtual private network services for your privacy and security needs.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-[#111128] border border-[#2D2D6B] flex items-center justify-center text-[#A5B4FC] hover:text-[#DC2626] hover:border-[#B91C1C] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#111128] border border-[#2D2D6B] flex items-center justify-center text-[#A5B4FC] hover:text-[#DC2626] hover:border-[#B91C1C] transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#111128] border border-[#2D2D6B] flex items-center justify-center text-[#A5B4FC] hover:text-[#DC2626] hover:border-[#B91C1C] transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-[#F0F0FF] mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#A5B4FC] hover:text-[#DC2626] transition-colors"
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2D2D6B] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280]">
            &copy; {new Date().getFullYear()} Tunnel Picks. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-[#6B7280] hover:text-[#A5B4FC] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-[#6B7280] hover:text-[#A5B4FC] transition-colors">
              Terms
            </Link>
            <a href="#" className="text-sm text-[#6B7280] hover:text-[#A5B4FC] transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
