---
title: "My First Blog Post"
date: 2026-04-28
tags: [AWS, Cloud, Architecture]
readtime: 5 min
---

## Welcome to My Blog

This is the first post on my new terminal-themed blog. I'll be writing about cloud infrastructure, autonomous systems, and AI systems. Fun fact: This website was partially generated with the help of latest SOTA Locally hostable LLMs: Qwen3.6 27B and 35B-A3B models (Unsloth versions) ran on llama-server + OpenCode.

### Why a Blog?

Writing helps me consolidate what I learn. Whether it's a new AWS service, a Kubernetes pattern, or a computer vision algorithm, I believe in documenting the journey.

### What to Expect

- **Cloud Architecture** — AWS patterns, infrastructure design, and lessons from production
- **Autonomous Systems** — Integration challenges in factory automation
- **Backend Engineering** — Java microservices, performance tuning, and scalability

Here's a quick code snippet to get things started:

```python
import boto3

def list_s3_buckets():
    """List all S3 buckets in the account."""
    s3 = boto3.client('s3')
    response = s3.list_buckets()
    for bucket in response['Buckets']:
        print(f"- {bucket['Name']} ({bucket['CreationDate']})")

list_s3_buckets()
```

Stay tuned for more posts!
