#!/usr/bin/env python3
"""Append a blog entry to blog-posts.ts"""

# Read the blog content
with open("/tmp/blog_content.md", "r") as f:
    blog_md = f.read()

# Clean curly quotes
replacements = {
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
}
for old, new in replacements.items():
    blog_md = blog_md.replace(old, new)

# Replace backticks in the content with single quotes for code references
blog_md = blog_md.replace('`', "'")

# Check for ${} patterns
import re
dollar_curly = re.findall(r'\$\{', blog_md)
print("Found " + str(len(dollar_curly)) + " ${ occurrences")

# Check for $
if '$' in blog_md:
    # The content has $ symbols for dollar amounts but not ${...} template patterns
    pass

# Build the blog entry using list concatenation (no f-strings)
entry_parts = []
entry_parts.append("  {\n")
entry_parts.append('    slug: "enterprise-vpn-selection-guide-20260620",\n')
entry_parts.append('    title: "\u4f01\u4e1a\u8fdc\u7a0b\u529e\u516cVPN\u9009\u578b\u6307\u5357\uff1a2026\u5e74\u5b8c\u5168\u8bc4\u6d4b\u4e0e\u91c7\u8d2d\u5efa\u8bae",\n')
entry_parts.append('    excerpt:\n')
entry_parts.append('      "2026\u5e74\u4f01\u4e1a\u8fdc\u7a0b\u529e\u516cVPN\u9009\u578b\u6307\u5357\u2014\u2014\u6db5\u76d6Tailscale\u3001Cloudflare Zero Trust\u3001Pritunl\u3001OpenVPN AS\u548cHeadscale\u4e94\u5927\u65b9\u6848\uff0c\u4ece\u5b89\u5168\u6027\u3001\u53ef\u6269\u5c55\u6027\u3001\u6027\u80fd\u3001\u5408\u89c4\u6027\u548c\u6210\u672c\u4e94\u4e2a\u7ef4\u5ea6\u8fdb\u884c\u7cfb\u7edf\u8bc4\u6d4b\uff0c\u63d0\u4f9b\u53ef\u843d\u5730\u7684\u91c7\u8d2d\u5efa\u8bae\u3002",\n')
entry_parts.append("    content: `\n")
entry_parts.append(blog_md)
entry_parts.append("`,\n")
entry_parts.append('    author: "TunnelPicks Enterprise Security Lab",\n')
entry_parts.append('    authorRole: "Enterprise Security Research Team at TunnelPicks",\n')
entry_parts.append('    date: "2026-06-20",\n')
entry_parts.append('    category: "enterprise-vpn",\n')
entry_parts.append('    readTime: 14,\n')
entry_parts.append('    tags: ["enterprise-vpn", "remote-work", "zero-trust", "tailscale", "cloudflare", "pritunl", "openvpn-as", "headscale", "vpn-comparison", "corporate-vpn-selection"],\n')
entry_parts.append('  },\n')

entry_text = "".join(entry_parts)

# Check for backticks in content
if "`" in blog_md:
    print("WARNING: backticks found in blog content - already replaced")

# Read the blog-posts.ts file
with open("/home/edi/tunnelpicks/app/data/blog-posts.ts", "r") as f:
    content = f.read()

# Find the last ]; before the end
last_bracket = content.rfind("];")
if last_bracket > 0:
    new_content = content[:last_bracket] + "\n" + entry_text + content[last_bracket:]
    with open("/home/edi/tunnelpicks/app/data/blog-posts.ts", "w") as f:
        f.write(new_content)
    print("Successfully appended blog entry at position " + str(last_bracket))
    print("New file length: " + str(len(new_content)) + " chars")
else:
    print("ERROR: Could not find '];' in blog-posts.ts")
