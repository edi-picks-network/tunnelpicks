#!/usr/bin/env python3
"""Fix backticks in blog-posts.ts that are inside template literals."""
import re

with open('/home/edi/tunnelpicks/app/data/blog-posts.ts', 'r') as f:
    content = f.read()

# Find the second blog post's template literal content
# Strategy: find all content: ` ... ` patterns and fix embedded backticks

lines = content.split('\n')
fixed_lines = []
in_template = False
template_depth = 0
template_lines = []

for line in lines:
    if 'content: `' in line and not in_template:
        # Opening of a template literal
        in_template = True
        template_lines.append(line)
    elif in_template:
        # Check if this line ends the template literal
        # Template literal ends with `, on a line by itself
        stripped = line.strip()
        if stripped == '`,' or stripped.endswith('`,'):
            template_lines.append(line)
            # Process the template block
            full_block = '\n'.join(template_lines)
            # Escape backticks inside the template content (not the opening/closing ones)
            # Extract the inner content
            idx = full_block.index('content: `')
            inner_start = idx + len('content: `')
            # Find the last backtick before the comma
            inner_end = full_block.rfind('`')
            inner = full_block[inner_start:inner_end]
            escaped = inner.replace('`', '\\`')
            full_block_fixed = full_block[:inner_start] + escaped + full_block[inner_end:]
            fixed_lines.append(full_block_fixed)
            template_lines = []
            in_template = False
        else:
            template_lines.append(line)
    else:
        fixed_lines.append(line)

result = '\n'.join(fixed_lines)
with open('/home/edi/tunnelpicks/app/data/blog-posts.ts', 'w') as f:
    f.write(result)

# Count total backticks to verify
count = result.count('`')
print(f"Total backtick characters remaining: {count}")

# Show backtick positions
for i, ch in enumerate(result):
    if ch == '`':
        start = max(0, i-40)
        end = min(len(result), i+40)
        print(f"  Pos {i}: ...{result[start:end]}...")
