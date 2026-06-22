import type { Metadata } from "next";
import Link from "next/link";
import { Ship, Waves, Shield, Globe, Lock, Users, MapPin, Anchor, Cloud, Wind } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Tunnel Picks",
  description:
    "Tunnel Picks is a helsinki-based VPN comparison platform built on real-world testing and privacy-first principles.",
};

const TEAM = [
  {
    name: "Aubrey Clark",
    role: "CEO & Founder",
    bio: "Former cloud infrastructure architect at Ericsson. Aubrey founded Tunnel Picks to bring transparency to the VPN and cloud security space. She oversees all testing methodology and editorial direction.",
    initials: "AC",
  },
  {
    name: "Lucas Smith",
    role: "Tech Lead",
    bio: "Network engineer and WireGuard enthusiast. Lucas built the speed testing infrastructure that benchmarks VPNs across 12 global locations. He ensures every review is backed by real data.",
    initials: "LS",
  },
  {
    name: "Aiden Murphy",
    role: "Product Manager",
    bio: "With a background in cybersecurity product strategy, Aiden runs the Tunnel Picks platform day-to-day. He translates complex VPN features into clear, actionable comparisons.",
    initials: "AM",
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Privacy by Default",
    desc: "We hold every VPN to the same rigorous standard: real no-logs policies, independent audits, and transparent data handling. If a provider can't prove it, we won't recommend it.",
  },
  {
    icon: Globe,
    title: "Global Testing Grid",
    desc: "Our infrastructure spans servers in 12+ countries. Every speed test, latency check, and streaming unblocking test runs from real locations — not synthetic benchmarks.",
  },
  {
    icon: Lock,
    title: "Independent & Unbiased",
    desc: "We accept no sponsorship from VPN providers. Our rankings are based entirely on real-world testing data, feature analysis, and aggregated user feedback.",
  },
  {
    icon: Anchor,
    title: "Built on Helsingborg",
    desc: "Operating from Sweden's west coast, we bring a Scandinavian perspective to online privacy. Our neutral jurisdiction means we evaluate VPNs on their technical merits alone.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative">
      {/* ======== HERO ======== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-50/80 via-white to-white" />
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-ocean-100/20 to-transparent" />

        <div className="max-w-[800px] mx-auto relative">
          {/* Studio badge */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-50 border border-ocean-100">
              <Ship className="w-3.5 h-3.5 text-ocean-500" />
              <span className="text-xs font-medium text-ocean-700">Tunnel Picks</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-light border border-amber-100">
              <MapPin className="w-3 h-3 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">Helsingborg, Sweden</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 text-center leading-tight mb-6">
            We Are{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-500 to-ocean-700">
              Tunnel Picks
            </span>
          </h1>
          <p className="text-lg text-gray-500 text-center leading-relaxed max-w-2xl mx-auto mb-8">
            A cloud solutions studio based in Helsingborg, Sweden. We built{" "}
            <strong className="text-gray-700">Tunnel Picks</strong> to bring clarity
            to the VPN market — because your online privacy deserves real, unbiased answers.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "50+", label: "VPNs Tested" },
              { value: "12", label: "Global Locations" },
              { value: "10K+", label: "Speed Tests Run" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-ocean-500">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== OUR STORY ======== */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
              <Waves className="w-4 h-4 text-ocean-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
          </div>

          <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
            <p>
              <strong className="text-gray-900">Tunnel Picks started on the docks of Helsingborg.</strong>{" "}
              Our founder, Aubrey Clark, spent years designing cloud infrastructure at Ericsson.
              She noticed a pattern: the same companies that built secure enterprise networks
              were struggling to recommend consumer VPNs to friends and family. The market was
              flooded with affiliate-driven sites, sponsored rankings, and conflicting advice.
            </p>
            <p>
              In early 2025, Aubrey gathered a small team of engineers and product people
              who shared a simple belief: <strong className="text-gray-900">VPN recommendations should be based on data, not dollars.</strong>{" "}
              They established Studio #27 in a converted warehouse near Helsingborg's
              northern harbor — a space with a view of the Öresund strait and a direct cable
              to a Tier 3 data center for real-world testing.
            </p>
            <p>
              <strong className="text-gray-900">Tunnel Picks was born from this environment.</strong>{" "}
              We call it a "VPN comparison platform," but really it's our testing lab made public.
              Every VPN on our list has been through our infrastructure: speed-tested on 1 Gbps
              fiber, privacy-audited against published policies, and evaluated for real-world
              streaming and torrenting performance. No shortcuts, no affiliate bias.
            </p>
            <div className="bg-ocean-50/50 border border-ocean-100 rounded-xl p-6 my-8">
              <div className="flex items-start gap-3">
                <Ship className="w-5 h-5 text-ocean-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 text-sm font-medium mb-1">From the founder</p>
                  <p className="text-gray-500 text-sm italic leading-relaxed">
                    "The name Tunnel Picks reflects our philosophy. Like the tides, the VPN
                    landscape is constantly shifting — new protocols, new providers, new threats.
                    We stay driven by the tide of real data, not marketing currents. Our mission
                    is simple: make privacy accessible by making VPN choices clear."
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-ocean-500 text-white text-xs font-bold flex items-center justify-center">
                      AC
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">Aubrey Clark</p>
                      <p className="text-[10px] text-gray-400">CEO, Tunnel Picks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== VALUES ======== */}
      <section className="px-6 py-16 bg-ocean-50/20">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
              <Anchor className="w-4 h-4 text-ocean-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">What We Stand For</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white border border-ocean-100 rounded-xl p-6 hover:border-ocean-200 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-ocean-50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-ocean-500" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== TEAM ======== */}
      <section className="px-6 py-16 bg-white" id="team">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-ocean-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Meet the Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-ocean-100 rounded-xl p-6 hover:border-ocean-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 text-white text-sm font-bold flex items-center justify-center mb-4 shadow-sm">
                  {member.initials}
                </div>
                <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                <p className="text-xs text-ocean-500 font-medium mb-2">{member.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              We are always looking for feedback and suggestions. If you have a VPN you
              would like us to review, or if you spot something we should update, let us know.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ocean-500 hover:bg-ocean-600 text-white font-medium rounded-xl transition-all shadow-sm"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ======== LOCATION ======== */}
      <section className="px-6 py-16 bg-ocean-50/20">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-ocean-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Based in Helsingborg</h2>
          </div>
          <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
            Our studio is located in Helsingborg, Sweden — a port city on the Öresund strait
            with a strong tech community and a strategic position between Copenhagen and
            Stockholm. From here, we test VPN connections across Europe and beyond,
            ensuring our benchmarks reflect real-world conditions.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-ocean-400" />
              Tier 3 Data Center Access
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-ocean-400" />
              1 Gbps Fiber Line
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-ocean-400" />
              12 Test Locations
            </span>
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="px-6 py-16">
        <div className="max-w-[800px] mx-auto text-center bg-gradient-to-br from-ocean-50 to-white border border-ocean-100 rounded-2xl p-10">
          <Ship className="w-10 h-10 mx-auto mb-4 text-ocean-400" />
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Ready to find your VPN?
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Browse our curated rankings, read in-depth reviews, and compare
            services side by side. All data-backed, all independent.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#rankings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ocean-500 hover:bg-ocean-600 text-white font-medium rounded-xl transition-all"
            >
              See Top Rankings
            </Link>
            <Link
              href="/all-tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-ocean-200 text-ocean-600 hover:bg-ocean-50 font-medium rounded-xl transition-all"
            >
              Browse All VPNs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
