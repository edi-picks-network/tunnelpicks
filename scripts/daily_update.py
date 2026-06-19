#!/usr/bin/env python3
"""Daily content update: refine tools + generate blog post using Qwen API."""

import os
import json
import sys
import re
from openai import OpenAI

# Read env
env_path = os.path.expanduser("/home/edi/.hermes/api_keys.env")
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if '=' in line:
            k, v = line.split('=', 1)
            os.environ[k.strip()] = v.strip()

QWEN_KEY = os.environ.get("QWEN_API_KEY_1", "")
if not QWEN_KEY:
    print("ERROR: No QWEN_API_KEY_1 found")
    sys.exit(1)

client = OpenAI(
    api_key=QWEN_KEY,
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

def call_qwen(messages, model="qwen-plus", max_tokens=4096):
    resp = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        temperature=0.7,
    )
    content = resp.choices[0].message.content
    if content is None:
        raise ValueError("Got None content from Qwen")
    return content

def refine_tool(name, description, current_long_desc, current_pros, current_cons, current_features, current_uses, current_quotes):
    """Generate refined content for a tool."""
    prompt = f"""You are a VPN industry expert writing for tunnelpicks.net, a site that reviews VPN, tunnel, and network proxy tools.

I need you to refine the content for the VPN tool "{name}".

Current description: {description}

Current longDescription (you should IMPROVE and EXPAND this):
{current_long_desc}

Generate NEW content in the following format ONLY (no markdown wrappers, just the data):

LONGDESCRIPTION: [Write a comprehensive 250-300 character Chinese description. Focus on the tool's positioning, key strengths, target users, and unique value proposition. Be specific and data-driven where possible. Write in Chinese/中文.]

PROS: [3-4 pros as a Python list of strings in English]

CONS: [2-3 cons as a Python list of strings in English]

FEATURES: [3-4 features as a Python list of strings in English]

USECASE: [2-3 use case scenarios in Chinese, formatted as a single string with bullet points like "- Scenario 1 description" etc.]

USERQUOTES: [2-3 user quotes as a Python list of dicts with keys: role, company, quote. Quotes in English.]"""

    messages = [
        {"role": "system", "content": "You are a VPN technology expert who writes detailed, accurate tool reviews. Always respond in the exact format requested."},
        {"role": "user", "content": prompt}
    ]
    
    result = call_qwen(messages)
    return result

def parse_refined(text):
    """Parse the structured output from Qwen."""
    data = {}
    
    # Extract longDescription (Chinese text between LONGDESCRIPTION: and PROS:)
    m = re.search(r'LONGDESCRIPTION:\s*(.*?)(?=\n\s*PROS:)', text, re.DOTALL)
    if m:
        data['longDescription'] = m.group(1).strip()
    
    # Extract PROS
    m = re.search(r'PROS:\s*(\[.*?\])(?=\n\s*CONS:)', text, re.DOTALL)
    if m:
        try:
            data['pros'] = eval(m.group(1))
        except:
            data['pros'] = []
    
    # Extract CONS
    m = re.search(r'CONS:\s*(\[.*?\])(?=\n\s*FEATURES:)', text, re.DOTALL)
    if m:
        try:
            data['cons'] = eval(m.group(1))
        except:
            data['cons'] = []
    
    # Extract FEATURES
    m = re.search(r'FEATURES:\s*(\[.*?\])(?=\n\s*USECASE:)', text, re.DOTALL)
    if m:
        try:
            data['features'] = eval(m.group(1))
        except:
            data['features'] = []
    
    # Extract USECASE
    m = re.search(r'USECASE:\s*(.*?)(?=\n\s*USERQUOTES:)', text, re.DOTALL)
    if m:
        data['useCase'] = m.group(1).strip()
    
    # Extract USERQUOTES
    m = re.search(r'USERQUOTES:\s*(\[.*\])', text, re.DOTALL)
    if m:
        try:
            data['userQuotes'] = eval(m.group(1))
        except:
            data['userQuotes'] = []
    
    return data


def generate_blog_post():
    """Generate a blog post about enterprise remote work VPN selection."""
    prompt = """Write a detailed, expert-level blog post for tunnelpicks.net about "Enterprise Remote Work VPN Selection Guide" (企业远程办公VPN选型指南).

The post should be comprehensive, data-driven, and practical. Write in Chinese/中文.

Structure:
1. Title: 企业远程办公VPN选型指南：2026年完全评测与采购建议
2. Introduction explaining why enterprise VPN selection matters in 2026
3. Section 1: Key evaluation criteria (security, scalability, performance, compliance, management)
4. Section 2: Top enterprise VPN solutions compared (WireGuard-based solutions, OpenVPN Access Server, Cloudflare Zero Trust, Tailscale, Headscale, Pritunl, etc.)
5. Section 3: Head-to-head comparison table (at least 5 solutions compared across 8+ criteria)
6. Section 4: Deployment considerations (SSO integration, MDM compatibility, split tunneling policies, logging)
7. Section 5: Cost analysis (per-user pricing, infrastructure costs, hidden fees)
8. Section 6: Real-world case studies or scenarios
9. Conclusion with recommendations

Format as clean markdown. Write in Chinese/中文 throughout.
Use realistic data points, specific numbers, and practical advice.
Keep it around 1500-2000 words.
No JSON wrapping - just the raw markdown content."""

    messages = [
        {"role": "system", "content": "You are a network security and VPN industry expert writing for tunnelpicks.net. Write in Chinese/中文."},
        {"role": "user", "content": prompt}
    ]
    
    return call_qwen(messages, max_tokens=8192)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "blog":
        content = generate_blog_post()
        print(content)
    elif len(sys.argv) > 1 and sys.argv[1] == "tool":
        tool_name = sys.argv[2] if len(sys.argv) > 2 else ""
        print(f"Tool generation requested for: {tool_name}")
    else:
        print("Usage: daily_update.py [blog|tool]")
