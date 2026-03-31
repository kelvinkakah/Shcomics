# Shcomics 🎨

**AI-powered comic panel generator built on the Aptos blockchain**

Shcomics lets users describe any comic scene, generate stunning AI visual panels, and store them verifiably on Shelby's hot storage layer with full cryptographic provenance (owner, timestamp, hash).

## Live Demo
https://shcomics-ai-image-generation-s2i1.vercel.app/

## Features
- 🎨 AI comic panel generation
- 🔗 Verifiable blob storage on Shelby
- 👛 Petra wallet connection (Shelbynet)
- ⚡ Instant global serving with sub-second reads
- 🔒 Cryptographic provenance for every panel

## Tech Stack
- Next.js + TypeScript
- Aptos blockchain (Shelbynet)
- Shelby Protocol SDK
- OpenAI image generation
- Vercel deployment

## Getting Started
```bash
pnpm install
pnpm --filter=@shelby-protocol/ai-image-generation dev
```

Built on the official [Shelby examples](https://github.com/shelby/examples) — forked and redesigned into a full comic panel creator.
