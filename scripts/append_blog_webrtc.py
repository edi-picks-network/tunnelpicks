#!/usr/bin/env python3
"""Append the new WebRTC blog post to blog-posts.ts."""
import re

with open("/tmp/tunnelpicks_blog_webrtc.md") as f:
    blog_md = f.read()

# Convert curly quotes to straight
blog_md = blog_md.replace("\u2018", "'").replace("\u2019", "'")
blog_md = blog_md.replace("\u201c", '"').replace("\u201d", '"')

# Escape backslashes so registry paths survive in template literal
blog_md = blog_md.replace("\\", "\\\\")

# Safety checks
assert "`" not in blog_md, "Found backtick in content"
assert "${" not in blog_md, "Found ${ in content"
print("Backslash after escape:", blog_md.count("\\\\"))

slug = "webrtc-leak-prevention-vpn-real-ip-2026"
title = "WebRTC Leak Prevention in 2026: Your VPN Is Silently Exposing Your Real IP"
excerpt = ("A deep engineering guide to WebRTC leaks in 2026: how STUN/ICE candidate "
           "gathering exposes your real public and private IPs even through an active VPN "
           "tunnel, plus browser-level, VPN-level, and enterprise policy defenses. Includes "
           "empirical test methodology and a 7-step prevention checklist.")
author = "Marcus Webb"
authorRole = "Network & VPN Infrastructure Engineer"
date = "2026-08-03"
category = "VPN & Security"
readTime = 11
tags = '["webrtc", "ip-leak", "vpn-security", "stun", "privacy", "remote-work"]'

entry = """  {
    slug: "%s",
    title: "%s",
    excerpt:
      "%s",
    content: `
%s`,
    author: "%s",
    authorRole: "%s",
    date: "%s",
    category: "%s",
    readTime: %d,
    tags: %s
  },""" % (slug, title, excerpt, blog_md, author, authorRole, date, category, readTime, tags)

# Append using anchor "\n];"
path = "/home/edi/tunnelpicks/app/data/blog-posts.ts"
with open(path) as f:
    content = f.read()

anchor = "\n];"
idx = content.rfind(anchor)
if idx == -1:
    raise SystemExit("ERROR: anchor not found")
new_content = content[:idx] + "\n" + entry + anchor + content[idx + len(anchor):]

with open(path, "w") as f:
    f.write(new_content)
print("Appended blog entry. New slug:", slug)
