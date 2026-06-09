#!/usr/bin/env python3
"""Generate a blog post about VPN/tunneling/proxy services comparison for 2026."""
import json
import re
import sys
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

# Read existing blog-posts.ts to get the last entry
with open('/home/edi/tunnelpicks/app/data/blog-posts.ts', 'r') as f:
    existing_content = f.read()

# Count existing posts
count = existing_content.count('slug:')
print(f"Existing blog posts: {count}")

# Find existing slugs
import re
existing_slugs = re.findall(r'slug:\s*"([^"]+)"', existing_content)
print(f"Existing slugs: {existing_slugs}")

prompt = """You are a professional VPN/security analyst writing for TunnelPicks.net, an English-language comparison site similar to G2. Write a comprehensive, in-depth blog post comparing the best VPN, tunneling, and proxy services in 2026.

Title: "Best VPN, Tunneling & Proxy Services of 2026: In-Depth Comparison & Buying Guide"

The post should be 2800-4500 characters of content (not counting JSON wrappers), written in a G2-style analytical tone — first/third person mixed, data-driven, with opinions and recommendations.

STRUCTURE REQUIREMENTS:
1. **Title**: "Best VPN, Tunneling & Proxy Services of 2026: In-Depth Comparison & Buying Guide"
2. **Slug**: "best-vpn-tunneling-proxy-services-2026-comparison"
3. **Excerpt**: 100-150 characters summary
4. **Content** (2800-4500 chars) with these sections:
   - Introduction (why this matters in 2026)
   - A comparison TABLE (markdown format with | columns |) comparing at least 6 major services across: Speed, Security, Streaming, Price, Devices, Best For
   - Detailed analysis of each category (Consumer VPNs, Enterprise Tunneling, Proxy Services)
   - A second TABLE comparing pricing tiers of top 3-4 services
   - FAQ section (3-5 questions with answers)
   - Conclusion with bottom-line recommendations
5. **Author**: "Ethan Cross"
6. **AuthorRole**: "VPN & Privacy Analyst at TunnelPicks"
7. **Date**: "2026-06-09"
8. **Category**: "VPN Comparisons"
9. **ReadTime**: 8-10 minutes
10. **Tags**: Array of 6-9 relevant tags

IMPORTANT RULES:
- All in English only
- Be factual and specific with data points, G2 ratings
- Do NOT use backtick template literals in the content - use regular quotes
- The content field should be a long string, not breaking JSON structure
- Content must be between 2800-4500 characters

Return ONLY a valid JSON object with these keys: slug, title, excerpt, content, author, authorRole, date, category, readTime, tags

The content should be a plain string (not markdown code blocks inside it) and can contain markdown for headings and tables.
Do NOT use template literals or backticks in the response."""

try:
    response = client.chat.completions.create(
        model="qwen-plus",
        messages=[
            {"role": "system", "content": "You are a professional VPN/security tech analyst writer for a comparison website. Generate detailed, data-rich blog posts in JSON format."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=8192,
        temperature=0.8,
    )
    text = response.choices[0].message.content.strip()
    
    # Clean markdown code fences
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    text = text.strip()
    
    blog = json.loads(text)
    
    # Validate
    required = ['slug', 'title', 'excerpt', 'content', 'author', 'authorRole', 'date', 'category', 'readTime', 'tags']
    for field in required:
        if field not in blog:
            print(f"ERROR: Missing field '{field}'")
            sys.exit(1)
    
    # Check slug uniqueness
    blog_slug = blog['slug']
    if blog_slug in existing_slugs:
        print(f"ERROR: Slug '{blog_slug}' already exists!")
        sys.exit(1)
    
    content_len = len(blog['content'])
    print(f"Content length: {content_len} chars")
    if content_len < 2500 or content_len > 5000:
        print(f"WARNING: Content length {content_len} outside 2500-5000 range")
    
    # Escape content for JS string
    content = blog['content']
    # Escape backslashes and double quotes
    content = content.replace('\\', '\\\\').replace('"', '\\"')
    # Remove any backtick template literals
    content = content.replace('`', "'")
    
    # Build the blog post entry
    tags_str = ', '.join(f'"{t}"' for t in blog['tags'])
    
    entry = f"""  {{
    slug: "{blog['slug']}",
    title: "{blog['title']}",
    excerpt:
      "{blog['excerpt']}",
    content: `{content}`,
    author: "{blog['author']}",
    authorRole: "{blog['authorRole']}",
    date: "{blog['date']}",
    category: "{blog['category']}",
    readTime: {blog['readTime']},
    tags: [{tags_str}],
  }},
"""
    
    # Find insertion point: before the closing "];" of BLOG_POSTS
    insert_pos = existing_content.rfind('];')
    if insert_pos == -1:
        print("ERROR: Could not find '];' in blog-posts.ts")
        sys.exit(1)
    
    new_content = existing_content[:insert_pos] + entry + existing_content[insert_pos:]
    
    # Write the file
    with open('/home/edi/tunnelpicks/app/data/blog-posts.ts', 'w') as f:
        f.write(new_content)
    
    print(f"\n✓ Blog post '{blog['slug']}' added successfully!")
    print(f"  Title: {blog['title']}")
    print(f"  Content length: {content_len} chars")
    print(f"  Tags: {blog['tags']}")
    
    # Output slug for sitemap update
    print(f"\nSLUG={blog['slug']}")
    
except json.JSONDecodeError as e:
    print(f"ERROR: JSON parse error: {e}")
    print(f"Raw response: {text[:500]}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
