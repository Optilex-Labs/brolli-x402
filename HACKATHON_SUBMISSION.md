# Brolli - x402 Hackathon Submission

## 🌂 Project Overview

**Brolli: Soulbound patent license NFTs with native ElizaOS integration. Agents protect themselves from patent trolls autonomously.**

Brolli provides tokenized IP protection for blockchain builders through soulbound NFTs on Base, with both human and AI agent purchase flows powered by Coinbase x402.

---

## 🔗 Links

- **Live App:** https://brolli.vercel.app
- **ElizaOS Plugin:** https://www.npmjs.com/package/@brolli/plugin-eliza
- **GitHub:** https://github.com/brolli-ip/brolli
- **API Documentation:** https://brolli.vercel.app/agents/docs
- **Risk Assessment Tool:** https://brolli.vercel.app/agents
- **Base Contract:** [`0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0`](https://basescan.org/address/0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0)

---

## 🚀 Key Features

### ✅ x402 Payment Integration
- AI agents can purchase licenses autonomously using Coinbase x402
- Single-license workflow with automatic USDC payment verification
- EIP-712 voucher system for secure on-chain minting
- Works on Base Sepolia (testnet) and Base mainnet

### ✅ ElizaOS Plugin for Agent Autonomy
- `npm install @brolli/plugin-eliza` - zero-config setup
- Automatic patent risk detection in agent conversations
- Knowledge graph API with 1,000+ blockchain patents
- ROI-based purchase recommendations (1,010x-5,050x vs. litigation)
- Agents can autonomously assess risk and buy licenses

### ✅ Comprehensive Risk Assessment API
- `/api/risk/assess` - Programmatic risk scoring by vertical
- `/api/risk/match` - Semantic matching of project descriptions
- Covers 8 verticals: Payments, Lending, DEX, NFT, RWA, Identity, Supply Chain, Legal
- Lawyer-curated patent data with enforcement history

### ✅ Dual Purchase Flows
- **Human Flow:** RainbowKit wallet connection → USDC approval → mint (Scaffold-ETH 2 patterns)
- **Agent Flow:** x402-gated API → payment verification → voucher → mint

---

## 🎯 Why Brolli Stands Out

### 1. Deep x402 Integration
- Not just a "payment accepted" wrapper - full verification stack
- On-chain USDC transfer validation
- Signature verification with nonce tracking
- EIP-712 vouchers for secure redemption

### 2. ElizaOS Ecosystem Integration
- First patent risk assessment plugin for ElizaOS
- Published to npm for immediate adoption
- Enables agents to protect themselves autonomously
- Demonstrates agent-to-agent discovery & sales

### 3. Real-World Problem
- 10,000+ blockchain patents create genuine litigation risk
- $100K-$500K average settlement costs
- $99 license = 1,010x-5,050x ROI
- Investors/regulators increasingly require IP diligence

### 4. Production-Ready
- Live on Base mainnet with USDC payments
- Soulbound NFTs prevent license resale/abuse
- 1-year renewable licenses with on-chain expiry tracking
- Pinata IPFS-anchored legal provenance (notarized affidavits)
- Permanent, verifiable storage of license documentation

---

## 🛠️ Tech Stack

**Blockchain:**
- Solidity 0.8.17 (ERC-721, SafeERC20, ReentrancyGuard)
- Hardhat deployment & testing
- Base (Ethereum L2)

**Frontend:**
- Next.js 14 (App Router)
- Scaffold-ETH 2 (RainbowKit, Wagmi)
- TailwindCSS + DaisyUI

**Storage:**
- Pinata IPFS for legal provenance and NFT metadata
- Immutable storage of notarized affidavits
- Verifiable on-chain links to IPFS content

**AI & Agents:**
- ElizaOS plugin architecture
- OpenAI GPT-4 for sales agent
- Knowledge graph API (patent risk data)

**Payment:**
- Coinbase x402 protocol
- USDC (ERC-20) via SafeERC20
- EIP-712 typed signatures

---

## 🤖 Agent Use Case

### Problem
AI agents building blockchain applications need to assess patent risk before deploying to mainnet, but:
- Cannot evaluate enforceability of patents
- Cannot price litigation risk credibly
- Cannot navigate USPTO databases effectively

### Solution
Brolli ElizaOS plugin provides autonomous risk assessment:

1. **Detection:** Agent mentions "building a stablecoin" in conversation
2. **Assessment:** Plugin calls `/api/risk/match` with description
3. **Recommendation:** "⚠️ HIGH PATENT RISK DETECTED - Risk Score: 8.5/10"
4. **Action:** Agent can autonomously purchase via x402

### Installation
```bash
npm install @brolli/plugin-eliza
```

```typescript
import { brolliPlugin } from '@brolli/plugin-eliza';

const agent = createAgent({
  plugins: [brolliPlugin]
});
```

---

## 📊 Impact & Metrics

### For Developers
- Affordable IP coverage ($99 vs. $100K-$500K litigation)
- On-chain proof for investors/regulators
- Portable across projects (soulbound to wallet, not project)

### For Agents
- Programmatic risk assessment (no human review needed)
- Autonomous purchase capability (x402)
- Procurement-ready justification (below $100 threshold)

### For Ecosystem
- First ElizaOS plugin for patent risk
- Demonstrates agent-to-agent B2B sales
- Expands x402 use case beyond API access to legal services

---

## 🏆 What We Built

### Phase 1: Core Infrastructure (Completed)
- ✅ Brolli smart contract with USDC payment integration
- ✅ Human purchase flow (approve → mint)
- ✅ x402 middleware for agent payments
- ✅ EIP-712 voucher system
- ✅ Deployed to Base mainnet

### Phase 2: Agent Enablement (Completed)
- ✅ Knowledge graph API with 1,000+ patents
- ✅ `/api/risk/assess` and `/api/risk/match` endpoints
- ✅ ElizaOS plugin published to npm
- ✅ Interactive risk calculator widget
- ✅ API documentation for agents

### Phase 3: Post-Hackathon (Planned)
- [ ] Multi-wallet batch purchasing
- [ ] Additional payment tokens (USDT, DAI)
- [ ] Agent wallet funding guide
- [ ] Brolli sales agent (ElizaOS character)
- [ ] Discord/Telegram bot deployment

---

## 🙏 Credits

Built with:
- [Scaffold-ETH 2](https://scaffoldeth.io/) by [BuidlGuidl](https://buidlguidl.com/) - Smart contract patterns and frontend infrastructure
- [ElizaOS](https://github.com/ai16z/eliza) by ai16z - AI agent framework and plugin architecture
- [Coinbase x402](https://github.com/coinbase/x402) - Autonomous payment protocol for agents
- [Pinata](https://pinata.cloud/) - IPFS infrastructure for legal provenance and NFT metadata
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection UX

### Personal Thanks

I learned full-stack development from **Austin Griffith** (Scaffold-ETH 2) and **Nader Dabit** (ElizaOS). As a lawyer and former commercial paper developer, their frameworks and teaching enabled me to build this in 30 days.

This project proves that their tools empower non-traditional developers to ship production-grade blockchain applications.

Special thanks to the x402 hackathon organizers and mentors! 🙏

---

## 📝 License

MIT License - see LICENSE file for details

---

## 👥 Team

**Nina (martianina)** - Solo developer
- Legal background (patent law familiarity)
- Full-stack web3 development
- ElizaOS agent development

---

## 🎬 Demo Video

[Link to demo video will be added]

**Demo includes:**
1. Human purchase flow on Base mainnet
2. Agent risk assessment via ElizaOS plugin
3. x402 payment flow on Base Sepolia
4. On-chain license verification

---

## 📞 Contact

- GitHub: [@martianina](https://github.com/martianina)
- Twitter: @brolli_ip (coming soon)
- Email: Contact via GitHub issues

---

**Built for the Coinbase x402 Hackathon - December 2025**

