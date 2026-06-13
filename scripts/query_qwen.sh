#!/bin/bash
source /home/edi/.hermes/api_keys.env
curl -s -x http://127.0.0.1:7890 https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Authorization: Bearer $QWEN_API_KEY_1" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-plus",
    "messages": [
      {"role": "system", "content": "You are a VPN/cybersecurity technical writer for TunnelPicks.net. Write a comprehensive, data-driven blog post in markdown format. Use professional tone with technical depth. Include comparison tables, benchmarks, and real-world deployment guidance. The output must be the blog content only, ready to insert as a TypeScript template literal. Do not use html tags. Use markdown only."},
      {"role": "user", "content": "Write a blog post titled \"Securing Remote Access in 2026: VPN vs ZTNA vs Secure Web Gateway — A Complete Guide for IT Teams\". The slug is \"secure-remote-access-vpn-ztna-swg-2026\". Write 750-1000 words. Cover: 1) The shift from traditional VPN to Zero Trust (ZTNA), 2) Comparison table of VPN vs ZTNA vs SWG across key metrics, 3) When to use each approach, 4) Practical deployment recommendations. Date: 2026-06-13. Author: Aiden Murphy. Category: Remote Access. Start with ## and use markdown for tables."}
    ],
    "max_tokens": 3500,
    "temperature": 0.7
  }' > /home/edi/tunnelpicks/scripts/qwen_response.json 2>&1
echo "Done: status=$?"
