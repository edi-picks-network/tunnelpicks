#!/usr/bin/env python3
"""Parse Qwen output files into clean JSON and apply per-field safe replacement in tools.ts."""
import re
import json
import sys

def parse_qwen(text):
    data = {}
    m = re.search(r'LONGDESCRIPTION:\s*(.*?)(?=\n\s*PROS:)', text, re.DOTALL)
    if m:
        data['longDescription'] = m.group(1).strip()
    m = re.search(r'PROS:\s*(\[.*?\])(?=\n\s*CONS:)', text, re.DOTALL)
    if m:
        data['pros'] = eval(m.group(1))
    m = re.search(r'CONS:\s*(\[.*?\])(?=\n\s*FEATURES:)', text, re.DOTALL)
    if m:
        data['cons'] = eval(m.group(1))
    m = re.search(r'FEATURES:\s*(\[.*?\])(?=\n\s*USECASE:)', text, re.DOTALL)
    if m:
        data['features'] = eval(m.group(1))
    m = re.search(r'USECASE:\s*(.*?)(?=\n\s*USERQUOTES:)', text, re.DOTALL)
    if m:
        uc = m.group(1).strip()
        # If wrapped in quotes (a TS string), unescape
        if uc.startswith('"') and uc.endswith('"'):
            try:
                import ast
                uc = ast.literal_eval(uc)
            except Exception:
                uc = uc[1:-1]
                uc = uc.replace('\\\\', '\\').replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")
        else:
            uc = uc.replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")
        data['useCase'] = uc
    m = re.search(r'USERQUOTES:\s*(\[.*\])', text, re.DOTALL)
    if m:
        data['userQuotes'] = eval(m.group(1))
    return data

# ---- Load all tools into a list of entry strings ----
def split_entries():
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
    # offsets in original content: arr_content starts at arr_start
    entries = []  # (start_offset, end_offset, text)
    depth = 0
    cur_start = None
    for j, ch in enumerate(arr_content):
        if ch == '{':
            if depth == 0:
                cur_start = j
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and cur_start is not None:
                entries.append((arr_start + cur_start, arr_start + j + 1, arr_content[cur_start:j+1]))
                cur_start = None
    return content, arr_start, arr_content, entries

def replace_field(text, entry_start, entry_end, field, new_value, is_string):
    """Replace a field within entry region [entry_start, entry_end)."""
    # Find the field: starting after entry_start
    field_re = re.compile(r'(\n\s*' + field + r':\s*)([^\n])', re.DOTALL)
    m = field_re.search(text, entry_start, entry_end)
    if not m:
        raise ValueError(f"Field {field} not found")
    val_start = m.start(2)
    val_start_ws = m.start(1) + len(m.group(1))
    # Determine region of value: from val_start to matching end
    if is_string:
        # string value: quoted with "..." possibly multi-line, or template `...`
        if text[val_start] == '"':
            # find closing quote not escaped
            i = val_start + 1
            while i < entry_end:
                if text[i] == '\\':
                    i += 2
                    continue
                if text[i] == '"':
                    break
                i += 1
            val_end = i + 1
        elif text[val_start] == '`':
            i = val_start + 2
            while i < entry_end:
                if text[i] == '\\':
                    i += 2
                    continue
                if text[i] == '`':
                    break
                i += 1
            val_end = i + 1
        else:
            raise ValueError(f"String value not quoted for {field}: {text[val_start:val_start+20]!r}")
    else:
        # array value: [ ... ] with nested brackets, find matching
        depth = 0
        i = val_start
        while i < entry_end:
            if text[i] == '[':
                depth += 1
            elif text[i] == ']':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        val_end = i + 1
    new_str = m.group(1) + new_value
    # Cut prefix at start of group(1) (the leading newline+indent+label) to avoid duplicating the label
    new_text = text[:m.start(1)] + new_str + text[val_end:]
    return new_text

def ts_string(s):
    # escape for double-quoted TS string
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n') + '"'

def ts_array(arr):
    items = []
    for it in arr:
        items.append(ts_string(it))
    return '[\n      ' + ',\n      '.join(items) + '\n    ]'

def ts_quotes(quotes):
    parts = []
    for q in quotes:
        parts.append('      {\n        role: ' + ts_string(q['role']) + ',\n        company: ' + ts_string(q['company']) + ',\n        quote: ' + ts_string(q['quote']) + '\n      }')
    return '[\n' + ',\n'.join(parts) + '\n    ]'

def main():
    tid_list = sys.argv[1:]
    with open("/home/edi/tunnelpicks/app/data/tools.ts") as f:
        content = f.read()
    for tid in tid_list:
        # re-split entries from current content each time to keep offsets fresh
        _, _, _, entries = split_entries_all(content)
        found = None
        for e in entries:
            m = re.search(r'id:\s*"([^"]+)"', e[2])
            if m and m.group(1) == tid:
                found = e
                break
        if not found:
            print(f"NOT FOUND {tid}")
            continue
        qwen = parse_qwen(open(f"/tmp/qwen_{tid}.json").read())
        if qwen.get('longDescription'):
            ld = qwen['longDescription'].strip('"').strip()
            content = replace_field(content, found[0], found[1], 'longDescription', ts_string(ld), True)
        if qwen.get('pros'):
            content = replace_field(content, found[0], found[1], 'pros', ts_array(qwen['pros']), False)
        if qwen.get('cons'):
            content = replace_field(content, found[0], found[1], 'cons', ts_array(qwen['cons']), False)
        if qwen.get('features'):
            content = replace_field(content, found[0], found[1], 'features', ts_array(qwen['features']), False)
        if qwen.get('useCase'):
            content = replace_field(content, found[0], found[1], 'useCase', ts_string(qwen['useCase']), True)
        if qwen.get('userQuotes'):
            content = replace_field(content, found[0], found[1], 'userQuotes', ts_quotes(qwen['userQuotes']), False)
        print(f"Processed {tid}")
    with open("/home/edi/tunnelpicks/app/data/tools.ts", "w") as f:
        f.write(content)
    print("Wrote tools.ts")

def split_entries_all(content):
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
    cur_start = None
    for j, ch in enumerate(arr_content):
        if ch == '{':
            if depth == 0:
                cur_start = j
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and cur_start is not None:
                entries.append((arr_start + cur_start, arr_start + j + 1, arr_content[cur_start:j+1]))
                cur_start = None
    return content, arr_start, arr_content, entries

if __name__ == "__main__":
    main()
