"use client";

import { useState, useMemo } from "react";
import {
  Search, Star, ArrowRight, Award, ThumbsUp, TrendingUp,
  Shield, DollarSign, Users, Clock, CheckCircle2, Zap,
  BarChart3, Globe, BookOpen, ChevronRight, Sparkles,
  MessageSquare, HelpCircle, Layers, Filter
} from "lucide-react";
import Link from "next/link";

// ============================================================
// 模板C：评测推荐式首页 — Tunnel Picks VPN 适配版
// 布局：排行榜区（Top10）+ 五星评分 + 推荐徽标 + 详细评测摘要
// ============================================================

import { ALL_TOOLS } from "@/data/tools";
import { BLOG_POSTS } from "@/data/blog-posts";

const ACCENT_COLOR = "#DC2626";
const SITE_NAME = "Tunnel Picks";
const HERO_TITLE = "Top VPN Services Compared & Ranked";
const HERO_SUBTITLE = "In-depth VPN reviews, speed tests, and privacy analysis. Find the perfect VPN for your needs.";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");

  // Top10 排行
  const topRated = useMemo(
    () => [...ALL_TOOLS].sort((a: any, b: any) => b.rating - a.rating).slice(0, 10),
    [ALL_TOOLS]
  );

  // 分类统计
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
  }, [ALL_TOOLS]);

  // 按分类过滤
  const filteredTop = useMemo(() => {
    if (activeTab === "all") return topRated;
    return topRated.filter(t => t.category === activeTab);
  }, [activeTab, topRated]);

  // 评测徽标
  const badges = ["Editor's Pick", "Best Value", "Top Rated", "Rising Star", "Most Popular"];

  // 快速对比表（前5名）
  const quickCompare = useMemo(
    () => topRated.slice(0, 5),
    [topRated]
  );

  // 最新评测
  const latestPosts = useMemo(
    () => [...BLOG_POSTS]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3),
    [BLOG_POSTS]
  );

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      {/* ======== HERO 区 ======== */}
      <section className="relative pt-28 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] via-[#0F1420] to-[#0A0E17]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
            <span className="text-sm text-gray-400">Independent rankings, real VPN reviews</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {HERO_TITLE}{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_COLOR}, #EF4444)` }}>
              {SITE_NAME}
            </span>{" "}
            for 2026
          </h1>
          <p className="text-base text-gray-400 max-w-xl mb-6">
            {HERO_SUBTITLE}
          </p>
          <div className="flex flex-wrap gap-3">
            {categoryStats.slice(0, 5).map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(activeTab === cat.name ? "all" : cat.name)}
                className={`text-xs px-4 py-2 rounded-full border transition-all ${
                  activeTab === cat.name
                    ? "text-white border-transparent"
                    : "text-gray-400 border-[#2A2F45] hover:border-gray-600"
                }`}
                style={activeTab === cat.name ? { backgroundColor: ACCENT_COLOR, borderColor: ACCENT_COLOR } : {}}
              >
                {cat.name} · {cat.count}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Top10 排行榜 ======== */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
              2026 Top Picks
            </h2>
            <Link href="/all-tools" className="text-xs flex items-center gap-1"
              style={{ color: ACCENT_COLOR }}>
              View all rankings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {filteredTop.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="flex items-center gap-4 bg-[#0F1420] border border-[#1A1F30] rounded-xl p-4 hover:border-[#2A2F50] transition-all group"
              >
                {/* 排名 */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  i < 3 ? "text-white" : "text-gray-500 bg-[#1A1F30]"
                }`}
                  style={i < 3 ? { backgroundColor: i === 0 ? ACCENT_COLOR : i === 1 ? "#DC2626" : "#F59E0B" } : {}}>
                  {i + 1}
                </div>
                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-sm">{tool.name}</h3>
                    {i < 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${ACCENT_COLOR}20`, color: ACCENT_COLOR }}>
                        {badges[i]}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{tool.description}</p>
                </div>
                {/* 评分 */}
                <div className="text-center flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-bold text-sm">{tool.rating}</span>
                  </div>
                  <p className="text-[10px] text-gray-600">{tool.reviewCount || 0} reviews</p>
                </div>
                {/* 价格 */}
                <div className="hidden md:block text-right flex-shrink-0 w-20">
                  <p className="text-white text-xs font-medium">{tool.pricing || "$$"}</p>
                  <p className="text-[10px] text-gray-600">per month</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======== 快速对比表 ======== */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
            <h2 className="text-lg font-bold text-white">Quick Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1F30]">
                  <th className="text-left py-3 text-gray-400 font-medium">VPN Service</th>
                  <th className="text-center py-3 text-gray-400 font-medium">Rating</th>
                  <th className="text-center py-3 text-gray-400 font-medium">Reviews</th>
                  <th className="text-center py-3 text-gray-400 font-medium">Pricing</th>
                  <th className="text-center py-3 text-gray-400 font-medium">Features</th>
                  <th className="text-center py-3 text-gray-400 font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {quickCompare.map((tool, i) => (
                  <tr key={tool.id} className="border-b border-[#1A1F30] hover:bg-[#0F1420] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-4">#{i + 1}</span>
                        <span className="text-white font-medium">{tool.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-white">{tool.rating}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 text-gray-400 text-xs">{(tool.reviewCount || 0).toLocaleString()}</td>
                    <td className="text-center py-3">
                      <span className="text-xs px-2 py-1 rounded bg-[#1A1F30] text-gray-300">
                        {tool.pricing || "Custom"}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span className="text-xs text-gray-400">{(tool.features?.length || 0)} key features</span>
                    </td>
                    <td className="text-center py-3">
                      <Link href={`/tools/${tool.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: `${ACCENT_COLOR}15`, color: ACCENT_COLOR }}>
                        Read Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======== 分类概览（评测卡片） ======== */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categoryStats.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/category/${cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="bg-[#0F1420] border border-[#1A1F30] rounded-xl p-4 hover:border-[#2A2F50] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{cat.count} VPN services</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {cat.avgRating}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======== 最新评测 ======== */}
      {latestPosts.length > 0 && (
        <section className="px-6 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                Latest Reviews
              </h2>
              <Link href="/blog" className="text-xs flex items-center gap-1" style={{ color: ACCENT_COLOR }}>
                All reviews <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {latestPosts.map((post: any, i: number) => (
                <Link
                  key={post.slug || i}
                  href={`/blog/${post.slug}`}
                  className="bg-[#0F1420] border border-[#1A1F30] rounded-xl p-5 hover:border-[#2A2F50] transition-all group"
                >
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1F30] text-gray-400">
                    {post.category || "Review"}
                  </span>
                  <h3 className="text-sm font-semibold text-white mt-2 mb-2 group-hover:underline line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-gray-600">{post.date}</span>
                    <span className="text-xs flex items-center gap-1" style={{ color: ACCENT_COLOR }}>
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
          <div className="bg-gradient-to-r from-[#0F1420] to-[#1A1F30] border border-[#2A2F45] rounded-2xl p-10 text-center">
            <Award className="w-10 h-10 mx-auto mb-4" style={{ color: ACCENT_COLOR }} />
            <h2 className="text-2xl font-bold text-white mb-2">
              Not sure which VPN to choose?
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Our detailed VPN reviews cover every feature, pricing tier, and real user feedback.
            </p>
            <Link
              href="/all-tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              See Full Rankings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Trophy icon (lucide-react doesn't have it, custom mini SVG)
function TrophyIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C6 4 6 6 6 9Z" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C18 4 18 6 18 9Z" />
      <path d="M6 9c0 3 3 7 6 7s6-4 6-7" />
      <path d="M12 16v4" />
      <path d="M9 20h6" />
    </svg>
  );
}
