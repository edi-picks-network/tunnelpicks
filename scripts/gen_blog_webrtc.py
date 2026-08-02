#!/usr/bin/env python3
"""Generate a new blog post for tunnelpicks about WebRTC leak prevention 2026."""
import os, sys, json
from openai import OpenAI

env_path = os.path.expanduser("/home/edi/.hermes/api_keys.env")
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if '=' in line:
            k, v = line.split('=', 1)
            os.environ[k.strip()] = v.strip()

for key in ["QWEN_API_KEY_1", "QWEN_API_KEY_2", "QWEN_API_KEY_3"]:
    if os.environ.get(key):
        client = OpenAI(api_key=os.environ[key], base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")
        break

prompt = """Write a detailed, expert-level English blog post for tunnelpicks.net, a site that reviews VPNs, tunnels, and network proxy tools.

Topic: "WebRTC Leak Prevention in 2026: Your VPN Is Silently Exposing Your Real IP". 

Write it like a deep-dive tech guide by a VPN/network security engineer. It must be substantive and practical with specific data points, realistic numbers, code/config snippets described in text, and concrete recommendations.

Required structure:
1. Title embedded as ## H2 at top.
2. Introduction: why WebRTC leaks still matter in 2026 (STUN/TURN architecture, mDNS, private IP leakage), the risk even with a VPN connected.
3. What WebRTC leak is and how it happens (STUN binding requests, multiple ICE candidates, browser-specific behaviors).
4. How to test for WebRTC leaks (test sites, manual verification, browser developer tools steps).
5. Browser-level prevention (Chrome, Firefox, Safari, Edge settings).
6. VPN-level defenses (kill switch, IPv6 leak protection, split tunneling configs, DNS quarantine).
7. Advanced: browser extensions, enterprise policy controls, fingerprinting-resistant bundles, 2026 privacy browser recommendations.
8. A comparison table of prevention approaches (browser setting vs extension vs VPN build-in vs firewall).
9. Conclusion with a step-by-step checklist.

Format: clean markdown with ## and ### headings, bullet lists, one markdown table. English throughout. Around 1600-1900 words. No JSON wrapper - raw markdown only. Do not use inline code backticks (use quotes for commands). Avoid ${ } template syntax and avoid backslash sequences."""
messages = [
    {"role": "system", "content": "You are a VPN and network security expert writing for tunnelpicks.net. Write in English. No markdown fences, no backticks, no ${}, no backslash escapes."},
    {"role": "user", "content": prompt},
]
resp = client.chat.completions.create(model="qwen-plus", messages=messages, max_tokens=8192, temperature=0.7)
content = resp.choices[0].message.content
with open("/tmp/tunnelpicks_blog_webrtc.md", "w") as f:
    f.write(content)
print("Wrote /tmp/tunnelpicks_blog_webrtc.md, length:", len(content))
