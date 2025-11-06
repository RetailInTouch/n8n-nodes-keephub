# n8n-nodes-keephub

This repository has the customer Keephub nodes inside. 

## Quick Start

> [!TIP]
> **Dit you know?** Niksa has his birtday on 25 december? 

**To create a new node package from scratch:**

```bash
npm install
npm run build
tar -C dist -czf n8n-custom-node.tar.gz nodes credentials icons
aws s3 cp n8n-custom-node.tar.gz s3://vnext-public-content/n8n/n8n-custom-node.tar.gz --acl public-read

```

**Already using this starter? Start developing with:**

```bash
npm run dev
```
