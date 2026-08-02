#!/usr/bin/env python3
"""Scan tools.ts and identify unrefined tools - simpler approach."""
import re

with open("/home/edi/tunnelpicks/app/data/tools.ts") as f:
    content = f.read()

# Find ALL_TOOLS array. Locate `= [` after ALL_TOOLS
m = re.search(r'export const ALL_TOOLS[^=]*=\s*\[', content)
arr_start = m.end()
# find matching closing bracket of this array
depth = 0
i = arr_start - 1  # the [
while i < len(content):
    c = content[i]
    if c == '[':
        depth += 1
    elif c == ']':
        depth -= 1
        if depth == 0:
            break
    i += 1
arr_content = content[arr_start:i]

# split entries on top-level braces
entries = []
depth = 0
cur = []
for ch in arr_content:
    if ch == '{':
        if depth == 0:
            cur = []
        depth += 1
    if depth > 0:
        cur.append(ch)
    if ch == '}':
        depth -= 1
        if depth == 0:
            entries.append(''.join(cur))

print(f"Total tools parsed: {len(entries)}")

results = []
for idx, e in enumerate(entries):
    m = re.search(r'id:\s*"([^"]+)"', e)
    tool_id = m.group(1) if m else f"idx{idx}"
    ld = re.search(r'longDescription:', e)
    has_quotes = re.search(r'userQuotes:\s*\[', e)
    refined = bool(ld and has_quotes)
    results.append((idx, tool_id, refined))

for idx, tid, r in results:
    status = "REFINED" if r else "UNREFINED"
    print(f"{idx}\t{tid}\t{status}")
