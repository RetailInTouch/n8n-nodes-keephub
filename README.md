# n8n-nodes-starter

This starter repository helps you build custom integrations for [n8n](https://n8n.io). It includes example nodes, credentials, the node linter, and all the tooling you need to get started.

## Quick Start

> [!TIP]
> **New to building n8n nodes?** The fastest way to get started is with `npm create @n8n/node`. This command scaffolds a complete node package for you using the [@n8n/node-cli](https://www.npmjs.com/package/@n8n/node-cli).

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
