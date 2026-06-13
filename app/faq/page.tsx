"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a VPN?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A VPN, or Virtual Private Network, is a service that creates an encrypted tunnel between your device and a remote server operated by the VPN provider. This encrypted connection ensures that your internet traffic is hidden from your ISP, hackers, and advertisers. Your real IP address is replaced with the VPN server's IP, masking your location and identity online. VPNs are used for privacy protection, secure browsing on public Wi-Fi, accessing geo-restricted content, and bypassing internet censorship in restrictive regions.",
      },
    },
    {
      "@type": "Question",
      name: "Are VPNs legal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, VPNs are legal in most countries including the United States, Canada, the United Kingdom, Australia, and most of Europe. However, some countries restrict or ban VPN usage — including China, Russia, Iran, Iraq, Belarus, and North Korea. Even where VPNs are legal, using them for illegal activities remains unlawful. Always check local laws before using a VPN while traveling. In countries where VPNs are restricted, they're often blocked rather than actively prosecuted for individual users.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a VPN at home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While your home network is generally more secure than public Wi-Fi, a VPN at home still offers important benefits. It prevents your ISP from tracking and selling your browsing history, encrypts your traffic against local network snooping, allows secure access to your home network while traveling, and lets you access geo-blocked content from streaming services. If you're concerned about privacy, use torrents, or want to bypass ISP throttling, a home VPN is a valuable addition to your digital security toolkit.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between free and paid VPNs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free VPNs often come with significant trade-offs: limited data caps (typically 500MB–10GB per month), slower speeds due to crowded servers, fewer server locations, and most concerning — questionable privacy practices. Many free VPNs log your data and sell it to advertisers to monetize their service. Paid VPNs offer unlimited bandwidth, faster speeds with dedicated server infrastructure, thousands of servers worldwide, robust no-logs policies verified by independent audits, better encryption protocols, 24/7 customer support, and advanced features like split tunneling and kill switches.",
      },
    },
    {
      "@type": "Question",
      name: "Can a VPN be detected?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, VPN traffic can be detected by websites and services. Detection methods include checking IP addresses against known VPN server ranges, analyzing traffic patterns for VPN protocol signatures, inspecting packet headers for VPN encapsulation, and using deep packet inspection (DPI). Streaming services like Netflix and BBC iPlayer actively block VPN IP addresses to enforce geo-restrictions. Some websites also block known VPN ranges. Premium VPNs combat this with obfuscated servers that disguise VPN traffic as regular HTTPS traffic.",
      },
    },
    {
      "@type": "Question",
      name: "Does a VPN slow down internet speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Using a VPN typically reduces your internet speed by 10–30% due to encryption overhead, protocol processing, and the distance to the VPN server. However, a high-quality VPN with optimized servers can minimize this impact. In some cases, a VPN can actually improve speeds by preventing ISP throttling — some ISPs deliberately slow down certain types of traffic like streaming or torrenting. Factors affecting speed include the VPN protocol used (WireGuard is fastest), server proximity, server load, and your base internet connection speed.",
      },
    },
    {
      "@type": "Question",
      name: "What is a no-logs VPN policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A no-logs policy means the VPN provider does not collect, store, or share any data about your online activity, connection timestamps, IP addresses, or browsing history. This is the gold standard for VPN privacy. However, policies vary — some providers keep minimal connection logs (like bandwidth usage) while true no-logs providers keep nothing at all. The most trustworthy no-logs policies are verified by independent third-party audits and have been tested in real-world legal cases where providers were unable to produce user data because none existed.",
      },
    },
    {
      "@type": "Question",
      name: "What is a VPN kill switch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A VPN kill switch is a critical security feature that automatically cuts your internet connection if the VPN connection drops unexpectedly. Without a kill switch, your real IP address and unencrypted traffic could be exposed for even a split second during a VPN disconnection. Kill switches work at the system level (blocking all traffic) or application level (blocking specific apps). This is especially important for torrenting, journalists in restrictive countries, and anyone who needs guaranteed privacy protection at all times.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use a VPN with Netflix and streaming services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, many VPNs can unblock Netflix libraries from different countries, but success varies. Netflix actively blocks VPN IP addresses to enforce regional content licensing agreements. Premium VPNs with dedicated streaming servers regularly update their IP pools to stay ahead of blocks. A good streaming VPN can access US Netflix, UK Netflix, and other regional libraries from anywhere. However, no VPN can guarantee 100% access forever — it's an ongoing cat-and-mouse game. For reliable streaming, choose a VPN known for consistent unblocking capabilities.",
      },
    },
    {
      "@type": "Question",
      name: "What VPN protocols should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WireGuard is the current gold standard — it offers excellent speeds, modern cryptography, and a lean codebase that's easier to audit. OpenVPN remains a solid choice with extensive configuration options and proven security, though it's slower than WireGuard. IKEv2/IPSec is good for mobile devices due to its ability to handle network changes seamlessly. Avoid older protocols like PPTP which has known security vulnerabilities. Most top VPN providers now default to WireGuard, making it the best choice for both speed and security.",
      },
    },
    {
      "@type": "Question",
      name: "How do I choose the best VPN provider?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choosing the best VPN depends on your specific needs. Key factors to evaluate include a verified no-logs policy (ideally audited), strong encryption standards (AES-256 or ChaCha20), a large global server network, fast connection speeds (WireGuard protocol), reliable kill switch and split tunneling features, simultaneous device connections, customer support quality, and reasonable pricing with a money-back guarantee. Also check independent reviews and speed tests. Avoid free VPNs — they're not truly free. Top-rated providers include ExpressVPN, NordVPN, Surfshark, and ProtonVPN.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to use a VPN on public Wi-Fi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Using a VPN on public Wi-Fi is one of the most important security practices you can adopt. Public Wi-Fi networks in cafes, airports, hotels, and libraries are notoriously insecure — attackers can easily intercept unencrypted traffic, steal login credentials, inject malware, or perform man-in-the-middle attacks. A VPN encrypts all your traffic, making it unreadable to anyone monitoring the network. Even on a compromised public Wi-Fi hotspot, your data remains fully protected. This is one of the primary use cases for consumer VPNs.",
      },
    },
  ],
};

const FAQ_ITEMS = [
  {
    question: "What is a VPN?",
    answer:
      "A VPN, or Virtual Private Network, is a service that creates an encrypted tunnel between your device and a remote server operated by the VPN provider. This encrypted connection ensures that your internet traffic is hidden from your ISP, hackers, and advertisers. Your real IP address is replaced with the VPN server's IP, masking your location and identity online. VPNs are used for privacy protection, secure browsing on public Wi-Fi, accessing geo-restricted content, and bypassing internet censorship in restrictive regions.",
  },
  {
    question: "Are VPNs legal?",
    answer:
      "Yes, VPNs are legal in most countries including the United States, Canada, the United Kingdom, Australia, and most of Europe. However, some countries restrict or ban VPN usage — including China, Russia, Iran, Iraq, Belarus, and North Korea. Even where VPNs are legal, using them for illegal activities remains unlawful. Always check local laws before using a VPN while traveling. In countries where VPNs are restricted, they're often blocked rather than actively prosecuted for individual users.",
  },
  {
    question: "Do I need a VPN at home?",
    answer:
      "While your home network is generally more secure than public Wi-Fi, a VPN at home still offers important benefits. It prevents your ISP from tracking and selling your browsing history, encrypts your traffic against local network snooping, allows secure access to your home network while traveling, and lets you access geo-blocked content from streaming services. If you're concerned about privacy, use torrents, or want to bypass ISP throttling, a home VPN is a valuable addition to your digital security toolkit.",
  },
  {
    question: "What's the difference between free and paid VPNs?",
    answer:
      "Free VPNs often come with significant trade-offs: limited data caps (typically 500MB–10GB per month), slower speeds due to crowded servers, fewer server locations, and most concerning — questionable privacy practices. Many free VPNs log your data and sell it to advertisers to monetize their service. Paid VPNs offer unlimited bandwidth, faster speeds with dedicated server infrastructure, thousands of servers worldwide, robust no-logs policies verified by independent audits, better encryption protocols, 24/7 customer support, and advanced features like split tunneling and kill switches.",
  },
  {
    question: "Can a VPN be detected?",
    answer:
      "Yes, VPN traffic can be detected by websites and services. Detection methods include checking IP addresses against known VPN server ranges, analyzing traffic patterns for VPN protocol signatures, inspecting packet headers for VPN encapsulation, and using deep packet inspection (DPI). Streaming services like Netflix and BBC iPlayer actively block VPN IP addresses to enforce geo-restrictions. Some websites also block known VPN ranges. Premium VPNs combat this with obfuscated servers that disguise VPN traffic as regular HTTPS traffic.",
  },
  {
    question: "Does a VPN slow down internet speed?",
    answer:
      "Using a VPN typically reduces your internet speed by 10–30% due to encryption overhead, protocol processing, and the distance to the VPN server. However, a high-quality VPN with optimized servers can minimize this impact. In some cases, a VPN can actually improve speeds by preventing ISP throttling — some ISPs deliberately slow down certain types of traffic like streaming or torrenting. Factors affecting speed include the VPN protocol used (WireGuard is fastest), server proximity, server load, and your base internet connection speed.",
  },
  {
    question: "What is a no-logs VPN policy?",
    answer:
      "A no-logs policy means the VPN provider does not collect, store, or share any data about your online activity, connection timestamps, IP addresses, or browsing history. This is the gold standard for VPN privacy. However, policies vary — some providers keep minimal connection logs (like bandwidth usage) while true no-logs providers keep nothing at all. The most trustworthy no-logs policies are verified by independent third-party audits and have been tested in real-world legal cases where providers were unable to produce user data because none existed.",
  },
  {
    question: "What is a VPN kill switch?",
    answer:
      "A VPN kill switch is a critical security feature that automatically cuts your internet connection if the VPN connection drops unexpectedly. Without a kill switch, your real IP address and unencrypted traffic could be exposed for even a split second during a VPN disconnection. Kill switches work at the system level (blocking all traffic) or application level (blocking specific apps). This is especially important for torrenting, journalists in restrictive countries, and anyone who needs guaranteed privacy protection at all times.",
  },
  {
    question: "Can I use a VPN with Netflix and streaming services?",
    answer:
      "Yes, many VPNs can unblock Netflix libraries from different countries, but success varies. Netflix actively blocks VPN IP addresses to enforce regional content licensing agreements. Premium VPNs with dedicated streaming servers regularly update their IP pools to stay ahead of blocks. A good streaming VPN can access US Netflix, UK Netflix, and other regional libraries from anywhere. However, no VPN can guarantee 100% access forever — it's an ongoing cat-and-mouse game. For reliable streaming, choose a VPN known for consistent unblocking capabilities.",
  },
  {
    question: "What VPN protocols should I use?",
    answer:
      "WireGuard is the current gold standard — it offers excellent speeds, modern cryptography, and a lean codebase that's easier to audit. OpenVPN remains a solid choice with extensive configuration options and proven security, though it's slower than WireGuard. IKEv2/IPSec is good for mobile devices due to its ability to handle network changes seamlessly. Avoid older protocols like PPTP which has known security vulnerabilities. Most top VPN providers now default to WireGuard, making it the best choice for both speed and security.",
  },
  {
    question: "How do I choose the best VPN provider?",
    answer:
      "Choosing the best VPN depends on your specific needs. Key factors to evaluate include a verified no-logs policy (ideally audited), strong encryption standards (AES-256 or ChaCha20), a large global server network, fast connection speeds (WireGuard protocol), reliable kill switch and split tunneling features, simultaneous device connections, customer support quality, and reasonable pricing with a money-back guarantee. Also check independent reviews and speed tests. Avoid free VPNs — they're not truly free. Top-rated providers include ExpressVPN, NordVPN, Surfshark, and ProtonVPN.",
  },
  {
    question: "Is it safe to use a VPN on public Wi-Fi?",
    answer:
      "Using a VPN on public Wi-Fi is one of the most important security practices you can adopt. Public Wi-Fi networks in cafes, airports, hotels, and libraries are notoriously insecure — attackers can easily intercept unencrypted traffic, steal login credentials, inject malware, or perform man-in-the-middle attacks. A VPN encrypts all your traffic, making it unreadable to anyone monitoring the network. Even on a compromised public Wi-Fi hotspot, your data remains fully protected. This is one of the primary use cases for consumer VPNs.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* FAQ Schema structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#3B82F6] bg-[#162440] px-3 py-1.5 rounded-md mb-4">
              FAQ
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#F0F4F8] tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-[#8BA3BE] max-w-xl mx-auto leading-relaxed">
              Everything you need to know about VPNs, online privacy, and
              secure internet browsing — from how they work to choosing the
              right provider.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-[#0F1D32] border border-[#1E3A5F] rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#162440] transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-[#F0F4F8] font-medium pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#3B82F6] flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 text-[#8BA3BE] leading-relaxed text-sm border-t border-[#1E3A5F] pt-4">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-[#8BA3BE] text-sm">
              Still have questions?{" "}
              <a
                href="/contact"
                className="text-[#3B82F6] hover:underline font-medium"
              >
                Contact our team
              </a>{" "}
              and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
