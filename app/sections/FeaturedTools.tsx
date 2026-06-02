"use client";
import { motion } from 'framer-motion';
import { Star, ArrowRight, BarChart3, ShieldCheck, Users, CreditCard, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  icon: LucideIcon;
  pricing: string;
}

const FEATURED_TOOLS: Tool[] = [
  {
    id: 'tool-1',
    name: 'ExpressVPN',
    category: 'VPN',
    rating: 4.9,
    reviews: 28134,
    description: 'Enterprise-grade VPN with blazing-fast speeds, military-grade encryption, and servers in 105 countries.',
    icon: ShieldCheck,
    pricing: 'From $8.32/mo',
  },
  {
    id: 'tool-2',
    name: 'NordVPN',
    category: 'VPN',
    rating: 4.8,
    reviews: 15450,
    description: 'Premium VPN service with advanced security features, threat protection, and Meshnet for secure file sharing.',
    icon: BarChart3,
    pricing: 'From $3.99/mo',
  },
  {
    id: 'tool-3',
    name: 'Surfshark',
    category: 'VPN',
    rating: 4.5,
    reviews: 12300,
    description: 'Affordable unlimited-device VPN with CleanWeb ad blocker, GPS spoofing, and multi-hop connections.',
    icon: Users,
    pricing: 'From $2.49/mo',
  },
  {
    id: 'tool-4',
    name: 'ProtonVPN',
    category: 'VPN',
    rating: 4.4,
    reviews: 8700,
    description: 'Privacy-first VPN from the makers of ProtonMail with a strict no-logs policy and Secure Core architecture.',
    icon: CreditCard,
    pricing: 'From $4.99/mo',
  },
];

export default function FeaturedTools() {
  return (
    <section className="relative pb-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-lg font-bold text-[#F0F0FF]">Editor&apos;s Choice CRM Tools</h2>
          </div>
          <a
            href="/#all-tools"
            className="hidden md:flex items-center gap-1 text-sm text-[#DC2626] hover:text-[#EF4444] transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.a
                key={tool.id}
                href={`/tools/${tool.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group block"
              >
                <article className="bg-[#111128] border border-[#2D2D6B] rounded-xl p-5 hover:shadow-lg hover:shadow-[#DC2626]/5 hover:border-[#B91C1C] transition-all h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1A1A3E] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-[#F0F0FF] group-hover:text-[#DC2626] transition-colors truncate">
                        {tool.name}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DC2626]">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#A5B4FC] leading-relaxed line-clamp-1 flex-grow">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2D2D6B]">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-sm font-bold text-[#F0F0FF]">{tool.rating}</span>
                      <span className="text-xs text-[#6B7280]">({tool.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <span className="text-xs text-[#6B7280]">{tool.pricing}</span>
                  </div>
                </article>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-6 text-center md:hidden">
          <a
            href="/#all-tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111128] border border-[#2D2D6B] rounded-full text-sm text-[#DC2626] hover:text-[#EF4444] transition-colors"
          >
            View All Tools <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
