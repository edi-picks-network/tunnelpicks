#!/usr/bin/env python3
"""Scan tools.ts by longDescription length."""
import re

with open("/home/edi/tunnelpicks/app/data/tools.ts") as f:
    content = f.read()

m = re.search(r'export const ALL_TOOLS[^=]*=\s*\[', content)
arr_start = m.end()
depth = 0
i = arr_start - 1
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

results = []
for idx, e in enumerate(entries):
    m = re.search(r'id:\s*"([^"]+)"', e)
    tool_id = m.group(1) if m else f"idx{idx}"
    ld = re.search(r'longDescription:\s*(".*?"|\`.*?\`)', e, re.DOTALL)
    ld_len = 0
    if ld:
        raw = ld.group(1)
        ld_len = len(raw) - 2  # strip quotes
    has_quotes = bool(re.search(r'userQuotes:\s*\[', e))
    results.append((idx, tool_id, ld_len, has_quotes))

# sort by length
results.sort(key=lambda x: x[2])
print("Tools sorted by longDescription length:")
for idx, tid, l, hq in results:
    flag = "<1000" if l < 1000 else ""
    hqf = "noQuotes" if not hq else ""
    print(f"{tid}\tlen={l}\t{flag}\t{hqf}")
