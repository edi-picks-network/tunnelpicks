#!/usr/bin/env python3
"""Refine 3 tools for tunnelpicks using Qwen API. Output JSON per tool."""
import os
import json
import sys
import re
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

# read env, then source openai

def get_client():
    for key in ["QWEN_API_KEY_1", "QWEN_API_KEY_2", "QWEN_API_KEY_3"]:
        k = os.environ.get(key, "")
        if k:
            return OpenAI(api_key=k, base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")
    raise RuntimeError("No Qwen key")

def call_qwen(client, messages, model="qwen-plus", max_tokens=4096):
    resp = client.chat.completions.create(
        model=model, messages=messages, max_tokens=max_tokens, temperature=0.7,
    )
    return resp.choices[0].message.content

TOOL_IDS = sys.argv[1:] if len(sys.argv) > 1 else ["charles-proxy", "smart-dns-proxy", "zscaler-private-access"]

client = get_client()

for tid in TOOL_IDS:
    prompt = f"""You are a VPN and network proxy industry expert writing for tunnelpicks.net, a G2-style review site for VPN, tunnel, and network proxy tools.

Write a DEEP, expert-level review for the tool "{tid}". The review must be factual, specific, data-driven, and read like a professional hands-on evaluation.

Generate content in EXACTLY this labeled format (no markdown fences, no JSON wrapper):

LONGDESCRIPTION: [English, 600-800 characters, a deep review-style paragraph with concrete figures, positioning, strengths, ideal users.]
PROS: [3-4 items as a Python list of strings, English]
CONS: [2-3 items as a Python list of strings, English]
FEATURES: [3-4 items as a Python list of strings, English]
USECASE: [2-3 sentences in Chinese (中文), describing ideal usage scenarios with bullet points starting with "- "]
USERQUOTES: [2-3 items as a Python list of dicts with keys role, company, quote. role and company in English, quote in English, realistic and specific.]

Important: no markdown code fences. Keep LONGDESCRIPTION between 600 and 800 characters. Use realistic technical detail specific to this networking tool."""

    messages = [
        {"role": "system", "content": "You are a network security and VPN industry expert. Always respond in the exact requested format with no markdown wrappers."},
        {"role": "user", "content": prompt},
    ]
    print(f"Calling Qwen for {tid}...", file=sys.stderr)
    text = call_qwen(client, messages)
    out_path = f"/tmp/qwen_{tid}.json"
    with open(out_path, "w") as f:
        f.write(text)
    print(f"Wrote {out_path}", file=sys.stderr)
