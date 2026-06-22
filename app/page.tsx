"use client";

import { useState, useMemo } from "react";
import {
  Search, Star, ArrowRight, Award, Shield, BarChart3, Globe, Lock,
  CheckCircle2, Zap, Waves, Ship, Users, BookOpen, ChevronRight,
  TrendingUp, ShieldCheck, ExternalLink, Server, Network, Eye
} from "lucide-react";
import Link from "next/link";

import { ALL_TOOLS } from "@/data/tools";
import { BLOG_POSTS } from "@/data/blog-posts";

const ACCENT = "#0EA5E9";
const ACCENT_DARK = "#0284C7";
const SITE_NAME = "Tunnel Picks";

const CATEGORY_ICONS: Record<string, typeof Shield> = {
  "Consumer VPN": Shield,
  "Enterprise VPN": ShieldCheck,
  "Business VPN": BriefcaseIcon,
  "Anti-Virus": Eye,
  "Password Manager": Lock,
  "Cloud Storage": Server,
  "Monitoring": BarChart3,
};

function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat] || Shield;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");

  const topRated = useMemo(
    () => [...ALL_TOOLS].sort((a: any, b: any) => b.rating - a.rating).slice(0, 10),
    []
  );

  const categoryStats = useMemo(() => {
    const m = new Map<string, { count: number; avgRating: number }>();
    for (const t of ALL_TOOLS) {
      if (!m.has(t.category)) m.set(t.category, { count: 0, avgRating: 0 });
      const s = m.get(t.category)!;
      s.count++;
      s.avgRating += t.rating;
    }
    return [...m.entries()]
      .map(([name, s]) => ({
        name,
        count: s.count,
        avgRating: Math.round((s.avgRating / s.count) * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const filteredTop = useMemo(() => {
    let list = [...topRated];
    if (sortBy === "price") {
      list.sort((a: any, b: any) => {
        const pA = a.pricing === "Free" ? 0 : a.pricing === "$" ? 1 : a.pricing === "$$" ? 2 : 3;
        const pB = b.pricing === "Free" ? 0 : b.pricing === "$" ? 1 : b.pricing === "$$" ? 2 : 3;
        return pA - pB;
      });
    } else if (sortBy === "name") {
      list.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }, [searchQuery, topRated, sortBy]);

  const latestPosts = useMemo(
    () => [...BLOG_POSTS]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3),
    []
  );

  const badges = ["Editor's Pick", "Best Value", "Top Rated"];

  return (
    <div className="min-h-screen bg-white">
      {/* ======== OCEAN HERO ======== */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        {/* Ocean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-50/80 via-white to-white" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-ocean-100/30 to-transparent" />

        {/* Decorative waves */}
        <div className="absolute -bottom-1 left-0 right-0 h-20 overflow-hidden text-ocean-50/60">
          <svg viewBox="0 0 1440 80" className="w-full h-full" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,40 C240,70 480,10 720,40 C960,70 1200,10 1440,40 L1440,80 L0,80 Z" opacity="0.5" />
            <path fill="currentColor" d="M0,50 C240,75 480,20 720,50 C960,80 1200,25 1440,50 L1440,80 L0,80 Z" opacity="0.3" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Studio badge */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-50 border border-ocean-100">
              <Ship className="w-3.5 h-3.5 text-ocean-500" />
              <span className="text-[11px] font-medium text-ocean-700">Tunnel Picks</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-light border border-amber-100">
              <Waves className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-medium text-amber-700">Cloud Solutions · Helsingborg</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Top VPN Services<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-500 to-ocean-700">
              Compared & Ranked
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-500 max-w-2xl mb-8 leading-relaxed">
            In-depth VPN reviews, real-world speed tests, and privacy analysis from the Tunnel Picks team.
            We benchmark every VPN extensively so you can choose with confidence.
          </p>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search VPN services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-ocean-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-500/30 focus:border-ocean-400 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Sort:</span>
              {(["rating", "price", "name"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-2 rounded-lg font-medium transition-all border ${
                    sortBy === s
                      ? "bg-ocean-500 text-white border-ocean-500 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-ocean-300 hover:text-ocean-600"
                  }`}
                >
                  {s === "rating" ? "Top Rated" : s === "price" ? "Price" : "Name"}
                </button>
              ))}
            </div>
          </div>

          {/* Category quick links */}
          <div className="flex flex-wrap gap-2">
            {categoryStats.slice(0, 6).map(cat => {
              const CatIcon = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border border-ocean-100 bg-ocean-50/50 text-ocean-700 hover:bg-ocean-100 hover:border-ocean-200 transition-all font-medium"
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat.name}
                  <span className="opacity-60">· {cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== RANKING LIST (numbered list style) ======== */}
      <section className="px-6 py-10" id="rankings">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
                <Award className="w-4 h-4 text-ocean-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {SITE_NAME} 2026 Rankings
              </h2>
            </div>
            <Link href="/all-tools" className="text-xs flex items-center gap-1 font-medium text-ocean-500 hover:text-ocean-600">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {filteredTop.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No VPN services match your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTop.map((tool, i) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-ocean-200 hover:shadow-md hover:shadow-ocean-50 transition-all group"
                >
                  {/* Rank number */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    i < 3 ? "text-white" : "text-gray-400 bg-gray-50 border border-gray-200"
                  }`}
                    style={i < 3 ? {
                      background: i === 0
                        ? "linear-gradient(135deg, #0EA5E9, #0284C7)"
                        : i === 1
                        ? "linear-gradient(135deg, #38BDF8, #0EA5E9)"
                        : "linear-gradient(135deg, #7DD3FC, #38BDF8)",
                    } : {}}>
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-900 font-semibold text-sm">{tool.name}</h3>
                      {i < 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-ocean-50 text-ocean-600 border border-ocean-100">
                          {badges[i]}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{tool.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="text-center flex-shrink-0 min-w-[60px]">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900 font-bold text-sm">{tool.rating}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{(tool.reviewCount || 0).toLocaleString()} reviews</p>
                  </div>

                  {/* Pricing */}
                  <div className="hidden md:block text-right flex-shrink-0 w-20">
                    <p className="text-gray-900 text-xs font-medium">{tool.pricing || "$$"}</p>
                    <p className="text-[10px] text-gray-400">per month</p>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:border-ocean-200 group-hover:bg-ocean-50">
                    <ArrowRight className="w-4 h-4 text-ocean-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======== COMPARISON TABLE (horizontal scroll) ======== */}
      <section className="px-6 py-12 bg-gradient-to-b from-ocean-50/30 to-white" id="comparison">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-ocean-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Side-by-Side Comparison</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-ocean-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ocean-100 bg-ocean-50/50">
                  <th className="text-left py-3.5 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">#</th>
                  <th className="text-left py-3.5 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">VPN Service</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Rating</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Pricing</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Features</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {topRated.slice(0, 8).map((tool, i) => (
                  <tr key={tool.id} className="border-b border-ocean-50 hover:bg-ocean-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold ${i < 3 ? "text-ocean-500" : "text-gray-400"}`}>
                        #{i + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium text-sm">{tool.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-gray-900 font-semibold">{tool.rating}</span>
                      </div>
                    </td>
                    <td className="text-center py-3.5 px-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 font-medium border border-gray-100">
                        {tool.pricing || "Custom"}
                      </span>
                    </td>
                    <td className="text-center py-3.5 px-4">
                      <span className="text-xs text-gray-500">{tool.category}</span>
                    </td>
                    <td className="text-center py-3.5 px-4">
                      <span className="text-xs text-gray-500">{(tool.features?.length || 0)} features</span>
                    </td>
                    <td className="text-center py-3.5 px-4">
                      <Link href={`/tools/${tool.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all inline-flex items-center gap-1 bg-ocean-50 text-ocean-600 hover:bg-ocean-100 border border-ocean-100">
                        Review <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======== BROWSE BY CATEGORY ======== */}
      <section className="px-6 py-12" id="categories">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
              <Waves className="w-4 h-4 text-ocean-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categoryStats.map((cat) => {
              const CatIcon = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-ocean-200 hover:shadow-md hover:shadow-ocean-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-ocean-50 flex items-center justify-center">
                        <CatIcon className="w-3.5 h-3.5 text-ocean-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-ocean-500 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 ml-9">
                    <span>{cat.count} services</span>
                    <span className="text-gray-300">·</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {cat.avgRating}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== TRUST FEATURES ======== */}
      <section className="px-6 py-12 bg-gradient-to-b from-ocean-50/20 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, label: "Independent Audits", desc: "All reviews are unbiased and data-driven" },
              { icon: TrendingUp, label: "Real Speed Tests", desc: "1 Gbps fiber benchmarked worldwide" },
              { icon: Globe, label: "Global Coverage", desc: "Servers tested across 12+ locations" },
              { icon: Lock, label: "Privacy Verified", desc: "No-logs policies verified by audits" },
            ].map((item) => (
              <div key={item.label} className="text-center p-5 rounded-xl border border-ocean-100 bg-white hover:border-ocean-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-ocean-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== LATEST BLOG POSTS ======== */}
      {latestPosts.length > 0 && (
        <section className="px-6 py-12 bg-ocean-50/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-ocean-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Latest Reviews</h2>
              </div>
              <Link href="/blog" className="text-xs flex items-center gap-1 font-medium text-ocean-500 hover:text-ocean-600">
                All reviews <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {latestPosts.map((post: any, i: number) => (
                <Link
                  key={post.slug || i}
                  href={`/blog/${post.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-ocean-200 hover:shadow-md hover:shadow-ocean-50 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-ocean-50 text-ocean-600 font-medium border border-ocean-100">
                      {post.category || "Review"}
                    </span>
                    <span className="text-[10px] text-gray-400">{post.readTime || 5} min read</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-ocean-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400">{post.author} · {post.date}</span>
                    <span className="text-xs flex items-center gap-1 font-medium text-ocean-500">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======== CTA ======== */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ocean-600 to-ocean-500 p-10 md:p-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`
              }} />
            </div>
            {/* Wave decorations */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden text-white/10">
              <svg viewBox="0 0 1440 60" className="w-full h-full" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,20 C240,50 480,0 720,20 C960,40 1200,0 1440,20 L1440,60 L0,60 Z" />
              </svg>
            </div>

            <div className="relative">
              <Ship className="w-14 h-14 mx-auto mb-4 text-white/80" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Not sure which VPN to choose?
              </h2>
              <p className="text-ocean-100 text-sm max-w-md mx-auto mb-6">
                Our team at Tunnel Picks has tested every major VPN. Let us help you find
                the perfect fit for your needs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/all-tools"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-ocean-700 font-semibold transition-all hover:bg-ocean-50 hover:scale-105 shadow-lg"
                >
                  See Full Rankings <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-medium transition-all hover:bg-white/10 hover:scale-105"
                >
                  Meet the Team <Users className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BriefcaseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
