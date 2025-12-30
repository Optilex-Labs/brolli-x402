# @brolli/plugin-eliza

Patent risk assessment plugin for ElizaOS agents. Enables autonomous agents to assess blockchain patent risk and recommend IP protection before deployment.

## Features

- 🔍 Automatic patent risk assessment for blockchain projects
- 📊 Risk scoring based on 1,000+ blockchain patents
- 💰 ROI-based purchase recommendations
- 🌐 Integration with Brolli knowledge graph API
- ⚡ Zero-config setup

## Installation

```bash
npm install @brolli/plugin-eliza
```

## Usage

```typescript
import { createAgent } from '@ai16z/eliza';
import { brolliPlugin } from '@brolli/plugin-eliza';

const agent = createAgent({
  name: "My Agent",
  plugins: [brolliPlugin]
});
```

That's it! Your agent will now automatically assess patent risk when discussing blockchain projects or deployments.

## How It Works

This plugin uses the **Brolli Sales Agent knowledge base** to assess patent risk.

**Knowledge Base:**
- 8 verticals (Payments, Lending, DEX, NFT, RWA, Identity, Healthcare, Research)
- 1,000+ patents cataloged with enforcement history
- Risk scores (0-10) based on patent density and litigation data
- Settlement ranges from actual cases ($25K-$500K)

**Single Source of Truth:**
The plugin imports from `@brolli/eliza-agents`, ensuring the sales agent and plugin use identical risk assessments.

**Workflow:**

1. Agent detects blockchain project discussion (keywords: stablecoin, lending, DEX, etc.)
2. Plugin matches project to vertical using keyword analysis
3. Returns risk score (0-10) with patent count and settlement range
4. Recommends license purchase if risk score ≥ 7.0
5. Provides ROI calculation (1,010x-5,050x vs. litigation costs)

## Example Conversation

**User:** "We're building a stablecoin payment platform"

**Agent:** "⚠️ HIGH PATENT RISK DETECTED

Your project matches: Stablecoin Systems
Risk Score: 8.5/10 (HIGH)
Relevant Patents: 847
Settlement Range: $100K-$500K

💰 RECOMMENDATION: Purchase Brolli License
Cost: $99/year
ROI: 1,010x-5,050x

Get coverage: https://brolli.vercel.app/agents/purchase"

## Supported Verticals

The plugin assesses risk for:

- **Healthcare & Medical Data:** 523 patents | Risk 8.7/10 (CRITICAL)
- **Payments & Stablecoins:** 1,200+ patents | Risk 8.5/10 (CRITICAL)
- **RWA Tokenization:** 678 patents | Risk 8.2/10 (HIGH)
- **Identity & Privacy:** 567 patents | Risk 8.1/10 (HIGH)
- **DeFi Lending:** 847 patents | Risk 7.8/10 (HIGH)
- **Research & Academic Data:** 412 patents | Risk 6.8/10 (MEDIUM_HIGH)
- **Decentralized Exchanges:** 534 patents | Risk 6.2/10 (MEDIUM_HIGH)
- **NFT Infrastructure:** 289 patents | Risk 5.1/10 (MEDIUM)

**Risk Tiers:**
- 8.0-10.0 = CRITICAL (immediate purchase recommended)
- 7.0-7.9 = HIGH (purchase recommended)
- 5.0-6.9 = MEDIUM_HIGH (consider license)
- 3.0-4.9 = MEDIUM (monitor)
- 0-2.9 = LOW (low exposure)

## API

The plugin provides one action:

### `checkPatentCoverage`

Automatically triggered when agent detects keywords like:
- building, deploy, launch, mainnet, project
- stablecoin, defi, dex, lending, nft, rwa
- healthcare, medical records, patient data, hipaa
- research, academic, open science, peer review
- token, smart contract, blockchain

**Returns:**
- Risk score (0-10)
- Patent coverage details
- Purchase recommendation
- ROI calculation

## Architecture

**Shared Knowledge Base:**
```
@brolli/eliza-agents (source of truth)
├── characters/brolli-sales-agent.json    ← Patent knowledge
├── characters/brolli-sales-faq.json      ← Risk topics
└── src/actions/checkPatentCoverage.ts    ← Risk assessment logic

@brolli/plugin-eliza (thin wrapper)
├── src/actions/checkPatentCoverage.ts    ← Re-exports from eliza-agents
└── src/index.ts                           ← Plugin interface
```

**Why this design?**
- Single source of truth for patent data
- Sales agent and plugin stay in sync automatically
- Updates to risk scores propagate everywhere
- No duplication of patent knowledge

## Configuration

No configuration required! The plugin works out of the box with sensible defaults.

## Requirements

- ElizaOS v0.1.0 or higher
- Internet connection (for API calls)

## Links

- [Brolli App](https://brolli.vercel.app)
- [API Documentation](https://brolli.vercel.app/agents/docs)
- [GitHub Repository](https://github.com/brolli-ip/brolli)
- [x402 Hackathon](https://www.x402hackathon.com/)

## About Brolli

Brolli provides soulbound patent license NFTs on Base, protecting blockchain builders from patent trolls. Built for the x402 hackathon with Scaffold-ETH 2, ElizaOS, and Coinbase Base.

**Coverage:** US12095919B2 + 300+ blockchain patents
**Price:** $99/year
**Network:** Base mainnet

## License

MIT

## Support

For issues or questions:
- GitHub Issues: https://github.com/brolli-ip/brolli/issues
- Twitter: @brolli_ip (coming soon)
- Email: Contact via GitHub

---

Built with 🌂 for the x402 Hackathon

