#!/usr/bin/env python3
"""Generate fresh content for 3 tools using Qwen API and update tools.ts.
Safe approach: find exact entries by id and replace only the entry content."""
import json
import re
import sys
import os
from openai import OpenAI

# Read API key
api_key = None
with open('/home/edi/.hermes/api_keys.env') as f:
    for line in f:
        if line.startswith('QWEN_API_KEY_1='):
            api_key = line.strip().split('=', 1)[1]
            break

if not api_key:
    print("ERROR: Could not read QWEN_API_KEY_1")
    sys.exit(1)

client = OpenAI(
    api_key=api_key,
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

def escape_js_string(s):
    """Escape a string for use in JS double-quoted string, single line."""
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    s = s.replace('\n', ' ').replace('\r', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def generate_tool_content(tool_id, tool_name, category):
    """Generate fresh content for a tool using Qwen API."""
    
    prompt = f"""You are a professional VPN/proxy/security software reviewer writing for TunnelPicks.net (an English-language B2B comparison site, similar to G2 or Capterra). Generate a comprehensive review for: {tool_name}.

CURRENT DATA:
- id: {tool_id}
- name: {tool_name}
- category: {category}

Return a JSON object with exactly these fields (all strings, no markdown formatting, no code fences):

1. "description": A short one-sentence tagline (max 150 chars), engaging and benefit-focused.
2. "longDescription": A detailed review (1000-1500 characters, SINGLE LINE, no line breaks) covering: market positioning, key capabilities, standout features, target audience, strengths and weaknesses, why someone would choose this over alternatives. Use a professional reviewer tone. Include specific facts, data points, and G2-style analysis. Ratings sourced from G2 should be noted.
3. "pros": An array of 5-7 specific, detailed pro statements. Each should be a complete sentence or substantial phrase (not just one word).
4. "cons": An array of 3-4 specific, detailed con statements.
5. "pricing": A short pricing string like "From $X/mo"
6. "pricingDetail": A detailed pricing description (1-2 sentences, SINGLE LINE)
7. "features": An array of 10-12 specific feature names
8. "useCase": A detailed use case description (2-3 sentences, SINGLE LINE)
9. "scoreBreakdown": An object with "features", "reviews", "momentum", "popularity" (each 0-100)
10. "userQuotes": An array of 2 quote objects, each with "role", "company", "quote"
11. "alternatives": An array of 2-3 alternative tool IDs (just the id strings, like ["nordvpn", "surfshark"])

IMPORTANT RULES:
- All text in English only
- longDescription, pricingDetail, useCase must each be a SINGLE LINE (no embedded newlines)
- Do not use any markdown formatting, code fences, or backticks in the output
- Be factual and specific — include real features, pricing ranges, and use cases
- The output MUST be valid JSON only, nothing else before or after

Return ONLY the JSON object, no other text."""

    try:
        response = client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": "You are a professional VPN and cybersecurity reviewer. Generate accurate, detailed tool reviews in JSON format only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4096,
            temperature=0.7,
        )
        text = response.choices[0].message.content.strip()
        # Remove markdown code fences if present
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        text = text.strip()
        
        data = json.loads(text)
        
        # Validate
        required = ['description', 'longDescription', 'pros', 'cons', 'pricing', 'pricingDetail', 
                    'features', 'useCase', 'scoreBreakdown', 'userQuotes', 'alternatives']
        for field in required:
            if field not in data:
                print(f"ERROR: Missing field '{field}' in response for {tool_id}")
                return None
        
        for arr_field in ['pros', 'cons', 'features', 'userQuotes', 'alternatives']:
            if not isinstance(data[arr_field], list):
                print(f"ERROR: '{arr_field}' is not an array for {tool_id}")
                return None
        
        sb = data['scoreBreakdown']
        for k in ['features', 'reviews', 'momentum', 'popularity']:
            if k not in sb:
                print(f"ERROR: scoreBreakdown missing '{k}' for {tool_id}")
                return None
        
        return data
    except json.JSONDecodeError as e:
        print(f"ERROR: JSON parse error for {tool_id}: {e}")
        print(f"Raw response: {text[:500]}")
        return None
    except Exception as e:
        print(f"ERROR: API call failed for {tool_id}: {e}")
        return None


def find_tool_boundary(content, tool_id, start_search=0):
    """Find the start and end positions of a tool entry by id.
    Returns (start, end) where start includes the leading '{' and end includes the trailing '},'"""
    
    # Pattern: find id: "tool_id"
    id_pattern = rf'id:\s*"{re.escape(tool_id)}"'
    match = re.search(id_pattern, content[start_search:])
    if not match:
        return None, None
    
    abs_start = start_search + match.start()
    
    # Go backwards to find the opening '{' of this entry
    # The entry starts after "}," or at the first "  {" before id:
    search_back = content[max(0, abs_start - 200):abs_start]
    brace_pos = search_back.rfind('{')
    if brace_pos == -1:
        return None, None
    entry_start = max(0, abs_start - 200) + brace_pos
    
    # Now go forward to find the closing "}," that ends this entry
    # We need to track braces
    i = abs_start
    brace_count = 0
    in_single_quote = False
    in_double_quote = False
    found_first_brace = False
    
    while i < len(content):
        c = content[i]
        
        # Handle escape sequences
        if c == '\\' and (in_single_quote or in_double_quote):
            i += 2
            continue
        
        if c == '"' and not in_single_quote:
            in_double_quote = not in_double_quote
        elif c == "'" and not in_double_quote:
            in_single_quote = not in_single_quote
        
        if not in_single_quote and not in_double_quote:
            if c == '{':
                brace_count += 1
                found_first_brace = True
            elif c == '}':
                brace_count -= 1
                if found_first_brace and brace_count == 0:
                    # Found the closing brace
                    entry_end = i + 1
                    # Check if followed by ","
                    if i + 1 < len(content) and content[i+1:i+3] == '},':
                        entry_end = i + 3
                    # Also check if followed by "," on next line
                    trailing = content[i+1:i+10].strip()
                    if trailing.startswith(','):
                        entry_end = i + 1 + content[i+1:].index(',') + 1
                    return entry_start, entry_end
        
        i += 1
    
    return None, None


def build_new_entry(tool_id, tool_data, original_entry):
    """Build the new tool entry, preserving icon, rating, reviewCount, websiteUrl from original."""
    
    def extract_field(pattern, default=''):
        m = re.search(pattern, original_entry)
        return m.group(1) if m else default
    
    icon = extract_field(r'icon:\s*(\w+)', 'Globe')
    rating = extract_field(r'rating:\s*([\d.]+)', '4.5')
    review_count = extract_field(r'reviewCount:\s*(\d+)', '10000')
    website_url = extract_field(r'websiteUrl:\s*"([^"]*)"', f'https://{tool_id}.com')
    category = extract_field(r'category:\s*"([^"]*)"', tool_data.get('category', 'Consumer VPN'))
    
    lines = []
    lines.append('  {')
    lines.append(f'    id: "{tool_id}",')
    lines.append(f'    name: "{escape_js_string(tool_data["name"])}",')
    lines.append(f'    category: "{escape_js_string(category)}",')
    lines.append(f'    rating: {rating},')
    lines.append(f'    reviewCount: {review_count},')
    lines.append(f'    icon: {icon},')
    
    desc = escape_js_string(tool_data.get('description', ''))
    lines.append(f'    description: "{desc}",')
    
    long_desc = escape_js_string(tool_data.get('longDescription', ''))
    lines.append('    longDescription:')
    lines.append(f'      "{long_desc}",')
    
    lines.append('    pros: [')
    for p in tool_data['pros']:
        lines.append(f'      "{escape_js_string(p)}",')
    lines.append('    ],')
    
    lines.append('    cons: [')
    for c in tool_data['cons']:
        lines.append(f'      "{escape_js_string(c)}",')
    lines.append('    ],')
    
    pricing = escape_js_string(tool_data.get('pricing', ''))
    lines.append(f'    pricing: "{pricing}",')
    
    pricing_detail = escape_js_string(tool_data.get('pricingDetail', ''))
    lines.append(f'    pricingDetail: "{pricing_detail}",')
    
    lines.append('    features: [')
    for f in tool_data['features']:
        lines.append(f'      "{escape_js_string(f)}",')
    lines.append('    ],')
    
    use_case = escape_js_string(tool_data.get('useCase', ''))
    lines.append(f'    useCase: "{use_case}",')
    
    lines.append(f'    websiteUrl: "{website_url}",')
    
    lines.append('    alternatives: [')
    for a in tool_data['alternatives']:
        lines.append(f'        "{a}",')
    lines.append('    ],')
    
    sb = tool_data['scoreBreakdown']
    lines.append('    scoreBreakdown: {')
    lines.append(f'      features: {sb["features"]},')
    lines.append(f'      reviews: {sb["reviews"]},')
    lines.append(f'      momentum: {sb["momentum"]},')
    lines.append(f'      popularity: {sb["popularity"]},')
    lines.append('    },')
    
    lines.append('    userQuotes: [')
    for q in tool_data['userQuotes']:
        role = escape_js_string(q.get('role', ''))
        company = escape_js_string(q.get('company', ''))
        quote = escape_js_string(q.get('quote', ''))
        lines.append('      {')
        lines.append(f'        role: "{role}",')
        lines.append(f'        company: "{company}",')
        lines.append(f'        quote: "{quote}"')
        lines.append('      },')
    lines.append('    ],')
    lines.append('  },')
    
    return '\n'.join(lines)


# Define the 3 tools to refresh
tools_to_refresh = [
    {'id': 'charles-proxy', 'name': 'Charles Proxy', 'category': 'Proxy'},
    {'id': 'windscribe', 'name': 'Windscribe', 'category': 'Consumer VPN'},
    {'id': 'expressvpn', 'name': 'ExpressVPN', 'category': 'Consumer VPN'},
]

# Generate content for each tool
generated = {}
for tool in tools_to_refresh:
    print(f"\n=== Generating content for {tool['name']} ({tool['id']}) ===")
    data = generate_tool_content(tool['id'], tool['name'], tool['category'])
    if data is None:
        print(f"FAILED to generate content for {tool['id']}")
        sys.exit(1)
    data['name'] = tool['name']
    data['category'] = tool['category']
    generated[tool['id']] = data
    print(f"✓ Generated content for {tool['id']}")

# Read the current tools.ts file
with open('/home/edi/tunnelpicks/app/data/tools.ts', 'r') as f:
    tools_content = f.read()

print("\n=== Updating tools.ts ===")

# Sort by position in file (process from end to start to preserve positions)
entries = []
for tool in tools_to_refresh:
    tool_id = tool['id']
    start, end = find_tool_boundary(tools_content, tool_id)
    if start is None:
        print(f"ERROR: Could not find entry for {tool_id}")
        sys.exit(1)
    entries.append((start, end, tool_id))
    print(f"Found {tool_id}: start={start}, end={end}")

# Sort by position descending to avoid offset issues
entries.sort(key=lambda x: x[0], reverse=True)

# Process replacements
new_content = tools_content
for start, end, tool_id in entries:
    old_entry = new_content[start:end]
    tool_data = generated[tool_id]
    new_entry = build_new_entry(tool_id, tool_data, old_entry)
    print(f"Replacing {tool_id}: {len(old_entry)} chars -> {len(new_entry)} chars")
    new_content = new_content[:start] + new_entry + new_content[end:]

# Write the updated file
with open('/home/edi/tunnelpicks/app/data/tools.ts', 'w') as f:
    f.write(new_content)

# Verify no duplicate ids
for tool_id in [t['id'] for t in tools_to_refresh]:
    count = new_content.count(f'id: "{tool_id}"')
    print(f"  {tool_id}: {count} occurrence(s) in file")
    if count != 1:
        print(f"  WARNING: Expected 1 occurrence!")
        sys.exit(1)

# Verify file starts correctly
if not new_content.startswith('import {'):
    print(f"ERROR: File starts with: {new_content[:50]}")
    sys.exit(1)

print(f"\n✓ tools.ts updated successfully!")
print(f"File size: {len(new_content)} bytes")
