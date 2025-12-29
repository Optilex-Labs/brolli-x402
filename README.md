# 🌂 Brolli for BUIDLers

**Tokenized IP protection for fintech innovators**

Brolli provides soulbound, 1-year renewable patent license NFTs on Base, enabling developers and teams to demonstrate IP coverage for blockchain-based financial+RWA applications.

**Live on Base Mainnet:** [`0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0`](https://basescan.org/address/0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0)

---

## 🎯 Problem / Solution

### The Problem
- **10,000+ blockchain patents** have been issued in the U.S., with 85% held by banks, consultancies, and tech giants
- **Patent trolls target successful projects** after they gain traction and funding
- **Startups, DAOs, and open-science projects** lack affordable, portable IP coverage
- **Investors and regulators** increasingly ask about IP diligence during funding rounds

### The Solution
Brolli offers **on-chain proof of patent license coverage** through:
- ✅ **Soulbound NFTs** (non-transferable, wallet-bound)
- ✅ **USDC payment integration** ($99 per license, renewable annually)
- ✅ **IPFS-anchored legal provenance** (notarized affidavits)
- ✅ **Team & agent purchase flows** (human + AI agent distribution)
- ✅ **Portable verification** (on-chain license expiry tracking)

---

## 🏗️ Architecture

### Tech Stack
- **Smart Contracts:** Solidity 0.8.17, Hardhat deployment
- **Frontend:** Next.js 14 (App Router), RainbowKit, Wagmi, Tailwind CSS
- **Blockchain:** Base (Ethereum L2)
- **Payment:** USDC (ERC-20) via SafeERC20 pattern
- **AI Agent:** ElizaOS conversational sales agent
- **Payment Protocol:** Coinbase x402 (HTTP 402 for agent purchases)

### Smart Contract: `Brolli.sol`

**Key Features:**
- ERC-721 Enumerable (NFT standard)
- Soulbound (non-transferable via `_beforeTokenTransfer` override)
- USDC payment pull pattern (user approves, contract pulls)
- 1-year license term with on-chain expiry tracking
- Max supply: 50 licenses (limited Holiday Hacker release)
- Voucher system for agent/batch purchases (EIP-712 signatures)

**Core Functions:**
```solidity
function mint(string memory name, string memory imageUri, string memory provenanceCid) 
    external nonReentrant returns (uint256)
    
function hasLicense(address who) public view returns (bool)

function mintOrRenewWithVoucher(Voucher calldata v, bytes calldata sig, ...)
    external nonReentrant returns (uint256)
```

### Payment Flows

**Human Purchase Flow (Main Page):**
1. User connects wallet (MetaMask, Coinbase Wallet, etc.)
2. User accepts terms & conditions
3. User approves Brolli contract to spend $99 USDC
4. User calls `mint()` → contract pulls USDC → NFT minted

**Agent Purchase Flow (x402-gated API):**
1. Agent calls x402-protected `/api/license/authorize` endpoint
2. x402 middleware verifies USDC payment automatically
3. Backend issues signed EIP-712 voucher for beneficiary
4. Agent calls `mintOrRenewWithVoucher()` with voucher + signature

**Batch Purchase Flow (Team/Group) - Coming Soon:**
- Future feature for multi-wallet provisioning in single transaction
- Agents will call single-license endpoint N times for team purchases

---

## 🙏 Built With

### [Scaffold-ETH 2](https://scaffoldeth.io/) by [BuidlGuidl](https://buidlguidl.com/)
Rapid prototyping framework for Ethereum dApps. Brolli leverages:
- **Proven contract patterns** (`Vendor.sol`, `DEX.sol` for ERC-20 payment flows)
- **Frontend hooks** (`useScaffoldWriteContract`, `useScaffoldReadContract`)
- **Deployment infrastructure** (`hardhat-deploy` scripts)
- **UI components** (`Address`, `Balance`, `AddressInput`)

### [ElizaOS](https://github.com/ai16z/eliza)
AI agent framework for conversational interfaces. Brolli's sales agent uses:
- Canonical knowledge base (patent FAQs, licensing info)
- OpenAI LLM integration
- Custom character persona for non-verbose, technical communication

### [Coinbase x402](https://github.com/coinbase/x402)
HTTP 402 payment protocol for AI agents. Enables:
- Programmatic USDC payments from agents
- Signed voucher issuance after payment verification
- Team/batch purchase workflows

---

## 🎁 Holiday Hacker Limited Release

**This version of Brolli is a special limited release (50 licenses) for teams and developers participating in hackathons during the 2025 holiday season.**

### Holiday Pricing
- **$99 per license** (through January 9, 2026)
- **Regular price: $199** (starting January 10, 2026)
- **Limited to 50 total licenses** (first-come, first-served)

### Target Audience
- Hackathon teams building fintech, RWA, stablecoin, or DeFi projects
- Developers seeking IP coverage for investor/regulatory diligence
- DAOs and open-science projects requiring patent license documentation

---

## 📋 TODOs

### Phase 1: Payment & Distribution (Holiday Hacker MVP)
- [x] Single-license x402 payment flow for agents
- [x] Human USDC payment flow (approve + mint)
- [x] EIP-712 voucher system for agent redemption
- [ ] Complete end-to-end agent voucher redemption (payment verified, `mintOrRenewWithVoucher` not tested)
- [ ] Test x402 on Base mainnet (currently only tested on Sepolia)
- [ ] Finish multi-token payment support (add USDT, DAI alongside USDC)

### Phase 2: User Experience
- [ ] Add batch/team purchase flow (multi-wallet minting with single x402 payment)
- [ ] Add GitHub OAuth for streamlined onboarding
- [ ] Refine sales agent behavior (reduce verbosity, improve technical accuracy)
- [ ] Add license renewal UI (existing holders)
- [ ] Agent wallet funding guide (Base Sepolia USDC faucet instructions)

### Phase 3: Backend Hardening
- [ ] Add nonce persistence (currently in-memory, needs Redis/database)
- [ ] Implement royalty segregation (creator fees, donation pools)
- [ ] Add admin dashboard for voucher management
- [ ] Harden rate limiting and abuse prevention for x402 endpoints
- [ ] Set up automated license expiry notifications

### Phase 4: Post-Launch
- [ ] Gather user feedback from hackathon participants
- [ ] Evaluate expansion to additional patent portfolios
- [ ] Consider DAO governance for licensing terms

---

## 🔗 Links

- **Live App:** [TBD - Vercel URL]
- **Base Mainnet Contract:** [`0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0`](https://basescan.org/address/0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0)
- **Scaffold-ETH 2:** https://scaffoldeth.io
- **ElizaOS:** https://github.com/ai16z/eliza
- **Coinbase x402:** https://github.com/coinbase/x402

---

**Built with 🏗️ by rangers using Scaffold-ETH 2, ElizaOS, and Coinbase x402**
