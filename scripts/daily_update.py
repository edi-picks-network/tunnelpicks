#!/usr/bin/env python3
"""
Daily content update for TunnelPicks (tunnelpicks.net).
- Refreshes 3 random tools
- Generates 1 blog post
- Uses Qwen API
"""
import requests
import json
import os
import re
import sys
import subprocess
import random

# Get Qwen API key
QWEN_API_KEY = os.environ.get('QWEN_API_KEY_1')
if not QWEN_API_KEY:
    env_file = os.path.expanduser("~/.hermes/api_keys.env")
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('QWEN_API_KEY_1='):
                    QWEN_API_KEY = line.split('=', 1)[1].strip('"').strip("'")
                    break

if not QWEN_API_KEY:
    print("ERROR: QWEN_API_KEY_1 not found")
    sys.exit(1)

print(f"Using API key: {QWEN_API_KEY[:10]}...{QWEN_API_KEY[-4:]}")

TOOLS_TS_PATH = "/home/edi/tunnelpicks/app/data/tools.ts"
BLOG_POSTS_PATH = "/home/edi/tunnelpicks/app/data/blog-posts.ts"

PROXIES = {
    "http": "http://127.0.0.1:7890",
    "https": "http://127.0.0.1:7890"
}

def call_qwen(prompt, max_tokens=6000):
    """Call Qwen API with a prompt and return response text."""
    response = requests.post(
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {QWEN_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "qwen-plus",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": 0.7
        },
        timeout=120,
        proxies=PROXIES
    )
    if response.status_code != 200:
        print(f"API Error: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        raise Exception(f"API call failed: {response.status_code}")
    result = response.json()
    content = result["choices"][0]["message"]["content"]
    print(f"   API response: {len(content)} chars received")
    return content

def parse_json_response(text):
    """Parse JSON response, handling potential formatting issues."""
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    text = text.strip()
    return json.loads(text)

def esc(s):
    """Escape a string for TypeScript double-quoted string."""
    return s.replace('\\', '\\\\').replace('"', '\\"')

def generate_tool_content(tool_name, category):
    """Generate G2-style content for a VPN/security tool."""
    prompt = f"""You are a VPN and cybersecurity analyst writing G2-style deep review content for {tool_name} (category: {category}). 
Generate ALL of the following fields as a JSON object. Return ONLY valid JSON, no other text.

Fields needed:
1. "longDescription": A 700-1000 character narrative review covering: market position, key strengths, honest weaknesses, and who should use it. Use natural evaluative tone, not marketing fluff. Focus on VPN/security context.
2. "pros": Array of exactly 6-7 detailed, specific advantages (each 10-25 words).
3. "cons": Array of exactly 3-4 honest, practical disadvantages (each 10-25 words).
4. "features": Array of exactly 10-12 specific, named features.
5. "pricingDetail": A string with pricing tiers and honest cost notes. Avoid using double quotes inside this string - use single quotes instead.
6. "useCase": Format as: "Best for: [who benefits most]. Not ideal for: [who should look elsewhere]."
7. "scoreBreakdown": {{"features": 0-100, "reviews": 0-100, "momentum": 0-100, "popularity": 0-100}} — realistic scores
8. "userQuotes": Array of exactly 2 objects with "role", "company", "quote" fields. Do NOT use double quotes inside quote values — use single quotes or rephrase.

IMPORTANT: Return ONLY valid JSON. No markdown, no backticks, no explanation."""

    return call_qwen(prompt)

def find_tool_block(content, tool_id):
    """Find the start and end line indices for a tool block."""
    lines = content.split('\n')
    
    tool_start_line = None
    for i, line in enumerate(lines):
        if f'id: "{tool_id}"' in line:
            # Find the opening "  {" preceding this
            for j in range(i, -1, -1):
                if lines[j].strip() == '{':
                    tool_start_line = j
                    break
            break
    
    if tool_start_line is None:
        return None, None
    
    # Find tool end - look for "  }," that closes this tool block
    brace_depth = 0
    tool_end_line = None
    for i in range(tool_start_line, len(lines)):
        stripped = lines[i].strip()
        for ch in stripped:
            if ch == '{':
                brace_depth += 1
            elif ch == '}':
                brace_depth -= 1
        if brace_depth == 0 and stripped == '},':
            tool_end_line = i
            break
    
    if tool_end_line is None:
        return None, None
    
    return tool_start_line, tool_end_line

def build_tool_block(tool_id, data):
    """Build the TypeScript tool block from data dict."""
    new_lines = []
    new_lines.append('  {')
    new_lines.append(f'    id: "{tool_id}",')
    new_lines.append(f'    name: "{esc(data["name"])}",')
    new_lines.append(f'    category: "{esc(data["category"])}",')
    new_lines.append(f'    rating: {data["rating"]},')
    new_lines.append(f'    reviewCount: {data["reviewCount"]},')
    new_lines.append(f'    icon: {data["icon"]},')
    new_lines.append(f'    description: "{esc(data["description"])}",')
    new_lines.append(f'    longDescription:')
    new_lines.append(f'      "{esc(data["longDescription"])}",')
    new_lines.append(f'    pros: [')
    for p in data['pros']:
        new_lines.append(f'      "{esc(p)}",')
    new_lines.append(f'    ],')
    new_lines.append(f'    cons: [')
    for c in data['cons']:
        new_lines.append(f'      "{esc(c)}",')
    new_lines.append(f'    ],')
    new_lines.append(f'    pricing: "{esc(data["pricing"])}",')
    new_lines.append(f'    pricingDetail: "{esc(data["pricingDetail"])}",')
    new_lines.append(f'    features: [')
    for f_item in data['features']:
        new_lines.append(f'      "{esc(f_item)}",')
    new_lines.append(f'    ],')
    new_lines.append(f'    useCase: "{esc(data["useCase"])}",')
    new_lines.append(f'    websiteUrl: "{esc(data["websiteUrl"])}",')
    
    new_lines.append(f'')
    new_lines.append(f'    alternatives: [')
    for a in data.get('alternatives', []):
        new_lines.append(f'        "{a}",')
    new_lines.append(f'    ],')
    new_lines.append(f'    scoreBreakdown: {{')
    sb = data['scoreBreakdown']
    new_lines.append(f'      features: {sb.get("features", 85)},')
    new_lines.append(f'      reviews: {sb.get("reviews", 85)},')
    new_lines.append(f'      momentum: {sb.get("momentum", 85)},')
    new_lines.append(f'      popularity: {sb.get("popularity", 85)},')
    new_lines.append(f'    }},')
    new_lines.append(f'    userQuotes: [')
    for q in data['userQuotes']:
        new_lines.append(f'      {{')
        new_lines.append(f'        role: "{esc(q["role"])}",')
        new_lines.append(f'        company: "{esc(q["company"])}",')
        new_lines.append(f'        quote: "{esc(q["quote"])}"')
        new_lines.append(f'      }},')
    new_lines.append(f'    ],')
    new_lines.append(f'  }},')
    return '\n'.join(new_lines)

def extract_immutable_data(block):
    """Extract immutable fields from a tool block."""
    data = {}
    
    m = re.search(r'name:\s*"([^"]*)"', block)
    if m: data['name'] = m.group(1)
    
    m = re.search(r'category:\s*"([^"]*)"', block)
    if m: data['category'] = m.group(1)
    
    m = re.search(r'rating:\s*([\d.]+)', block)
    if m: data['rating'] = float(m.group(1))
    
    m = re.search(r'reviewCount:\s*(\d+)', block)
    if m: data['reviewCount'] = int(m.group(1))
    
    m = re.search(r'icon:\s*(\w+)', block)
    if m: data['icon'] = m.group(1)
    
    m = re.search(r'description:\s*"([^"]*)"', block)
    if m: data['description'] = m.group(1)
    
    m = re.search(r'pricing:\s*"([^"]*)"', block)
    if m: data['pricing'] = m.group(1)
    
    m = re.search(r'websiteUrl:\s*"([^"]*)"', block)
    if m: data['websiteUrl'] = m.group(1)
    
    # Extract alternatives
    alts_match = re.search(r'alternatives:\s*\[([^\]]*)\]', block, re.DOTALL)
    if alts_match:
        alts = re.findall(r'"([^"]*?)"', alts_match.group(1))
        data['alternatives'] = alts
    else:
        data['alternatives'] = []
    
    return data

def generate_blog_content():
    """Generate a new VPN/security blog post."""
    today = "2026-06-08"
    prompt = f"""You are a VPN and cybersecurity expert writing a blog post for tunnelpicks.net (a VPN comparison hub). 
Write a complete, detailed blog post on the topic: **The Hidden Cost of Free VPNs: Why True Privacy Requires Investment in 2026**

The blog must be comprehensive (1500-2500 words), include markdown tables with comparison data, and follow this data format:

Return a JSON object with these fields:
1. "slug": URL-friendly slug (e.g., "hidden-cost-free-vpns-2026")
2. "title": Compelling blog title
3. "excerpt": 1-2 sentence summary (150-200 chars)
4. "content": Full blog content with:
   - ## markdown headers for sections
   - At least 3 markdown comparison tables (using pipe format)
   - Bullet points where appropriate
   - Detailed technical analysis
   - Use **bold** for emphasis
   - NO html tags, NO h1 headings
   - Write 1500-2500 words, very detailed
5. "author": "Ethan Cross"
6. "authorRole": "VPN & Privacy Analyst at TunnelPicks"
7. "date": "{today}"
8. "category": "VPN Privacy & Security"
9. "readTime": integer (7-11)
10. "tags": Array of 6-9 relevant tag strings

The content should cover:
- How free VPNs monetize users (data harvesting, selling bandwidth, ads)
- Privacy risks: logging, malware injection, weak encryption
- Comparison table of free vs paid VPNs (security features, speed, privacy)
- Hidden costs: limited data, slow speeds, fewer servers
- Case study: what happened with Hola VPN, Betternet, and other free services
- Why 2026's privacy landscape demands paid solutions
- Recommendations for budget-friendly paid VPNs
- How to evaluate if a VPN is truly trustworthy

IMPORTANT: Return ONLY valid JSON. No markdown, no backticks, no explanation before or after."""

    return call_qwen(prompt, max_tokens=8000)


def main():
    print("=" * 60)
    print("TunnelPicks Daily Content Update")
    print("Date: 2026-06-08")
    print("=" * 60)
    
    # Read the current file
    with open(TOOLS_TS_PATH, 'r') as f:
        content = f.read()
    
    # Pick 3 random tools to refresh
    all_tools = [
        ("twingate", "Twingate ZTNA"),
        ("cyberghost-vpn", "CyberGhost VPN"),
        ("vyprvpn", "VyprVPN"),
    ]
    
    generated = {}
    
    for tool_id, prompt_name in all_tools:
        print(f"\n{'='*50}")
        print(f"Generating for: {prompt_name}")
        print(f"{'='*50}")
        
        # Find the tool block
        start, end = find_tool_block(content, tool_id)
        if start is None:
            print(f"ERROR: Could not find tool {tool_id}")
            continue
        
        old_block = '\n'.join(content.split('\n')[start:end+1])
        immutable = extract_immutable_data(old_block)
        print(f"  Extracted immutable data for {tool_id}")
        print(f"  Found at lines {start+1}-{end+1}")
        
        # Generate new content
        raw = generate_tool_content(prompt_name, immutable.get('category', 'VPN'))
        data = parse_json_response(raw)
        
        # Validate and merge
        ld = data.get("longDescription", "")
        if len(ld) > 1000:
            data["longDescription"] = ld[:997] + "..."
        
        # Merge with immutable data
        merged = {**immutable, **data}
        generated[tool_id] = merged
        
        print(f"  longDescription: {len(data.get('longDescription', ''))} chars")
        print(f"  pros: {len(data.get('pros', []))}")
        print(f"  cons: {len(data.get('cons', []))}")
        print(f"  features: {len(data.get('features', []))}")
    
    # Now rebuild the file
    for tool_id in all_tools:
        tid = tool_id[0]
        if tid not in generated:
            continue
        
        data = generated[tid]
        start, end = find_tool_block(content, tid)
        if start is None:
            print(f"ERROR: Could not find tool {tid} in modified content")
            continue
        
        old_block = '\n'.join(content.split('\n')[start:end+1])
        new_block = build_tool_block(tid, data)
        
        if old_block not in content:
            print(f"ERROR: Old block not found for {tid}")
            continue
        
        content = content.replace(old_block, new_block, 1)
        print(f"  Replaced {tid} successfully")
    
    # Write tools.ts
    with open(TOOLS_TS_PATH, 'w') as f:
        f.write(content)
    
    print(f"\n{'='*60}")
    print("Tools.ts updated successfully!")
    print(f"{'='*60}")
    
    # ===================== GENERATE BLOG POST =====================
    print(f"\n{'='*60}")
    print("Generating New Blog Post")
    print(f"{'='*60}")
    
    raw_blog = generate_blog_content()
    blog_data = parse_json_response(raw_blog)
    
    print(f"Blog: {blog_data.get('title', 'N/A')}")
    print(f"Content: {len(blog_data.get('content', ''))} chars")
    
    # Read blog-posts.ts
    with open(BLOG_POSTS_PATH, 'r') as f:
        blog_content = f.read()
    
    # Build the blog entry
    blog_entry = f"""  {{
    slug: "{blog_data['slug']}",
    title: "{esc(blog_data['title'])}",
    excerpt:
      "{esc(blog_data['excerpt'])}",
    content: `{blog_data['content']}`,
    author: "{blog_data.get('author', 'Ethan Cross')}",
    authorRole: "{blog_data.get('authorRole', 'VPN & Privacy Analyst at TunnelPicks')}",
    date: "{blog_data.get('date', '2026-06-08')}",
    category: "{esc(blog_data.get('category', 'VPN Privacy & Security'))}",
    readTime: {blog_data.get('readTime', 9)},
    tags: ["""
    
    for tag in blog_data.get('tags', []):
        blog_entry += f'\n      "{esc(tag)}",'
    
    blog_entry += f'\n    ],\n  }},'
    
    # Insert before the closing ];
    idx = blog_content.rfind('];')
    if idx == -1:
        print("ERROR: Could not find ]; in blog-posts.ts")
    else:
        new_blog_content = blog_content[:idx] + ',\n' + blog_entry + '\n' + blog_content[idx:]
        with open(BLOG_POSTS_PATH, 'w') as f:
            f.write(new_blog_content)
        print("Blog post inserted successfully!")
    
    print(f"\n{'='*60}")
    print("ALL DONE!")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
