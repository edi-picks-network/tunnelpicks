"use client";

import { useState, useMemo } from "react";
import {
  Search, Star, ArrowRight, Award, ThumbsUp, TrendingUp,
  Shield, DollarSign, Users, Clock, CheckCircle2, Zap,
  BarChart3, Globe, BookOpen, ChevronRight, Sparkles,
  MessageSquare, HelpCircle, Layers, Filter, ShieldCheck,
  Lock, Eye, Server, Network, ExternalLink
} from "lucide-react";
import Link from "next/link";

import { ALL_TOOLS } from "@/data/tools";
import { BLOG_POSTS } from "@/data/blog-posts";

const ACCENT = "#10B981";
const ACCENT_DARK = "#059669";
const ACCENT_SUBTLE = "#D1FAE5";
const SITE_NAME = "Tunnel Picks";
const HERO_TITLE = "Top VPN Services Compared & Ranked";
const HERO_SUBTITLE = "In-depth VPN reviews, speed tests, and privacy analysis. Find the perfect VPN for your needs.";

const CATEGORY_ICONS: Record<string, typeof Shield> = {
  "Consumer VPN": Shield,
  "Enterprise VPN": ShieldCheck,
  "Business VPN": Briefcase,
  "Anti-Virus": Eye,
  "Password Manager": Lock,
  "Cloud Storage": Server,
  "Monitoring": BarChart3,
};

function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat] || Shield;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    if (activeTab === "all") return topRated;
    return topRated.filter(t => t.category === activeTab);
  }, [activeTab, topRated]);

  const badges = ["Editor's Pick", "Best Value", "Top Rated", "Rising Star", "Most Popular"];

  const quickCompare = useMemo(() => topRated.slice(0, 5), [topRated]);

  const latestPosts = useMemo(
    () => [...BLOG_POSTS]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3),
    []
  );

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return filteredTop;
    const q = searchQuery.toLowerCase();
    return filteredTop.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }, [searchQuery, filteredTop]);

  return (
    <div className="min-h-screen bg-white">
      {/* ======== HERO SECTION ======== */}
      <section className="relative pt-28 pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white to-white" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            </div>
            <span className="text-sm text-gray-500">Independent rankings, real VPN reviews</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {HERO_TITLE}{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>
              {SITE_NAME}
            </span>{" "}
            for 2026
          </h1>

          <p className="text-base text-gray-500 max-w-xl mb-6">
            {HERO_SUBTITLE}
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search VPN services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categoryStats.slice(0, 6).map(cat => {
              const CatIcon = getCategoryIcon(cat.name);
              const isActive = activeTab === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveTab(isActive ? "all" : cat.name)}
                  className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border transition-all font-medium ${
                    isActive
                      ? "text-white border-emerald-500 shadow-sm"
                      : "text-gray-600 border-gray-200 bg-white hover:border-emerald-300 hover:text-emerald-700"
                  }`}
                  style={isActive ? { backgroundColor: ACCENT, borderColor: ACCENT } : {}}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat.name} <span className="opacity-60">· {cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== TOP PICKS (Ranking List) ======== */}
      <section className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: ACCENT }} />
              2026 Top Picks
            </h2>
            <Link href="/all-tools" className="text-xs flex items-center gap-1 font-medium" style={{ color: ACCENT }}>
              View all rankings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {filteredBySearch.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No VPN services match your search.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBySearch.map((tool, i) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-md transition-all group"
                >
                  {/* Rank badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    i < 3 ? "text-white" : "text-gray-400 bg-gray-100"
                  }`}
                    style={i < 3 ? {
                      backgroundColor: i === 0 ? ACCENT : i === 1 ? ACCENT : ACCENT_DARK,
                    } : {}}>
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-900 font-semibold text-sm">{tool.name}</h3>
                      {i < 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50" style={{ color: ACCENT }}>
                          {badges[i]}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{tool.description}</p>
                  </div>

                  <div className="text-center flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900 font-bold text-sm">{tool.rating}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{(tool.reviewCount || 0).toLocaleString()} reviews</p>
                  </div>

                  <div className="hidden md:block text-right flex-shrink-0 w-20">
                    <p className="text-gray-900 text-xs font-medium">{tool.pricing || "$$"}</p>
                    <p className="text-[10px] text-gray-400">per month</p>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:border-emerald-200 group-hover:bg-emerald-50">
                    <ArrowRight className="w-4 h-4" style={{ color: ACCENT }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======== QUICK COMPARISON TABLE ======== */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4" style={{ color: ACCENT }} />
            <h2 className="text-lg font-bold text-gray-900">Quick Comparison</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">VPN Service</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Rating</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Reviews</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Pricing</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Features</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {quickCompare.map((tool, i) => (
                  <tr key={tool.id} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4 font-medium">#{i + 1}</span>
                        <span className="text-gray-900 font-medium">{tool.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-gray-900 font-semibold">{tool.rating}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-500 text-xs">{(tool.reviewCount || 0).toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                        {tool.pricing || "Custom"}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-xs text-gray-500">{(tool.features?.length || 0)} key features</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Link href={`/tools/${tool.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all inline-flex items-center gap-1"
                        style={{ backgroundColor: `${ACCENT}12`, color: ACCENT }}>
                        Read Review <ArrowRight className="w-3 h-3" />
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
      <section className="px-6 py-10 bg-gray-50/70" id="categories">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4" style={{ color: ACCENT }} />
            <h2 className="text-lg font-bold text-gray-900">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categoryStats.map((cat) => {
              const CatIcon = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <CatIcon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 ml-9">
                    <span>{cat.count} VPN services</span>
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

      {/* ======== SECURITY FEATURES / TRUST BADGES ======== */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, label: "Independent Audits", desc: "All reviews are unbiased and data-driven" },
              { icon: TrendingUp, label: "Speed Tests", desc: "Real-world 1 Gbps fiber benchmarked" },
              { icon: Globe, label: "Global Coverage", desc: "Servers tested across 12+ locations" },
              { icon: Lock, label: "Privacy Verified", desc: "No-logs policies verified by audits" },
            ].map((item) => (
              <div key={item.label} className="text-center p-5 rounded-xl border border-gray-100 bg-white hover:border-emerald-100 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5" style={{ color: ACCENT }} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== LATEST REVIEWS ======== */}
      {latestPosts.length > 0 && (
        <section className="px-6 py-10 bg-gray-50/70">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: ACCENT }} />
                Latest Reviews
              </h2>
              <Link href="/blog" className="text-xs flex items-center gap-1 font-medium" style={{ color: ACCENT }}>
                All reviews <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {latestPosts.map((post: any, i: number) => (
                <Link
                  key={post.slug || i}
                  href={`/blog/${post.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-md transition-all group"
                >
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {post.category || "Review"}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">{post.date}</span>
                    <span className="text-xs flex items-center gap-1 font-medium" style={{ color: ACCENT }}>
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======== CTA SECTION ======== */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-10 md:p-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`
              }} />
            </div>

            <div className="relative">
              <Shield className="w-12 h-12 mx-auto mb-4 text-white/90" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Not sure which VPN to choose?
              </h2>
              <p className="text-emerald-100 text-sm max-w-md mx-auto mb-6">
                Our detailed VPN reviews cover every feature, pricing tier, and real user feedback. Let us help you find the perfect fit.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/all-tools"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold transition-all hover:bg-emerald-50 hover:scale-105 shadow-lg"
                >
                  See Full Rankings <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-medium transition-all hover:bg-white/10 hover:scale-105"
                >
                  Read Expert Guides <BookOpen className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Briefcase({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
