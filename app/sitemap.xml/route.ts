import { MetadataRoute } from "next";

const BLOG_SLUGS = [
  "nordvpn-vs-expressvpn-vs-surfshark-2026-comparison",
  "vpn-protocols-2026-wireguard-openvpn-ikev2",
  "hidden-cost-free-vpns-2026",
  "best-vpn-tunneling-proxy-services-2026-comparison",
  "nordvpn-vs-mullvad-vs-pia-2026",
  "enterprise-vpn-solutions-remote-teams-2026",
  "wireguard-vs-openvpn-vs-ipsec-2026-benchmark",
  "secure-remote-access-vpn-ztna-swg-2026",
  "beyond-the-tunnel-why-your-vpn-strategy-needs-a-modern-overhaul-in-2026",
  "vpn-vs-proxy-vs-ssh-tunneling-2026",
  "vpn-protocols-comparison-guide-2026-tunneling",
  "wireguard-mesh-networking-2026-practical-guide",
  "choosing-right-vpn-protocol-2026-wireguard-openvpn-ikev2-lightway",
  "enterprise-vpn-selection-guide-2026",
  "wireguard-mesh-networking-remote-teams-2026",
  "burp-suite-vs-open-source-web-security-testing-2026",
  "split-tunneling-explained-when-and-why",
  "enterprise-vpn-vs-consumer-vpn-2026",
  "socks5-vs-http-proxies-2026",
  "ssh-tunneling-2026-remote-access-port-forwarding",
  "dns-leak-testing-prevention-2026",
  "socks5-vs-http-proxy-2026-comparison",
  "best-vpn-streaming-2026-netflix-bbc-iplayer-disney",
  "site-to-site-vpn-vs-remote-access-vpn-2026-architecture-guide",
  "how-to-choose-best-vpn-remote-work-2026",
  "mullvad-vs-protonvpn-2026-privacy-focused-showdown",
  "ztna-vs-traditional-vpn-migration-guide-2026",
  "sase-vs-vpn-2026-enterprise-architecture-showdown",
  "ai-powered-vpns-adaptive-tunneling-2026",
  "split-tunnel-vpn-configuration-optimization-2026",
  "understanding-vpn-latency-causes-and-solutions",
  "best-vpn-routers-home-office-2026",
  "vpn-kill-switch-testing-guide-2026",
  "enterprise-vpn-security-architecture-best-practices-2026",
  "proxy-chaining-multihop-vpn-architectures-2026",
  "wireguard-openvpn-ipsec-performance-benchmark-2026",
  "multi-cloud-vpn-interconnect-architecture-2026",
] as const;

const TOOL_SLUGS = [
  "nordvpn",
    "expressvpn",
    "surfshark",
    "mullvad-vpn",
    "protonvpn",
    "cyberghost-vpn",
    "private-internet-access",
    "windscribe",
    "tunnelbear",
    "vyprvpn",
    "hotspot-shield",
    "ipvanish",
    "atlas-vpn",
    "hide.me",
    "perfect-privacy-vpn",
    "wireguard",
    "openvpn",
    "tailscale",
    "cloudflare-warp",
    "zscaler-private-access",
    "palo-alto-prisma-access",
    "fortinet-forticlient",
    "cisco-anyconnect",
    "netmotion-mobility",
    "perimeter-81",
    "twingate",
    "openvpn-cloud",
    "algo-vpn",
    "strongswan",
    "softether-vpn",
    "socks5-proxy",
    "smart-dns-proxy",
    "squid-proxy",
    "haproxy",
    "nginx-proxy-manager",
    "traefik-proxy",
    "privoxy",
    "v2ray",
    "shadowsocks",
    "trojan-proxy",
    "charles-proxy",
    "fiddler-everywhere",
    "mitmproxy",
    "proxyman",
    "burp-suite-proxy",
    "pfsense",
    "opnsense",
    "fortinet-fortigate",
    "cisco-firepower",
    "sonicwall-tz-series",
    "watchguard-firebox",
    "sophos-xg-firewall",
    "ubiquiti-unifi-gateway",
    "check-point-quantum",
    "palo-alto-networks",
    "untangle-ng-firewall",
    "ipfire",
    "clearos",
    "endian-firewall-community",
    "vyos",
] as const;

const CATEGORY_SLUGS = [
  "consumer-vpn",
    "enterprise-vpn",
    "firewall-security",
    "proxy",
] as const;

export async function GET() {
  const baseUrl = "https://tunnelpicks.net";

  const urls: string[] = [];

  urls.push(`<url><loc>${baseUrl}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/blog</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`);
  urls.push(`<url><loc>${baseUrl}/disclosure</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`);

  for (const slug of CATEGORY_SLUGS) {
    urls.push(`<url><loc>${baseUrl}/category/${slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
  }

  for (const slug of BLOG_SLUGS) {
    urls.push(`<url><loc>${baseUrl}/blog/${slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  }

  for (const slug of TOOL_SLUGS) {
    urls.push(`<url><loc>${baseUrl}/tools/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
