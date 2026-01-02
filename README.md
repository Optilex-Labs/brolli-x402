# Brolli: Founding Membership in Optilex LitFi Infrastructure

**Patent license + early access to agentic litigation finance pools**

Brolli is the first product from Optilex, an onchain litigation finance infrastructure for web3. The first 50 Brolli purchases grant Founding Membership status with priority access to future Optilex capital pooling, claims distribution, and governance mechanisms.

**Live on Base Mainnet:** [`0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0`](https://basescan.org/address/0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0)

---

## What You Get

### 1. Patent License (Immediate)
- Soulbound NFT on Base proving license coverage
- 1-year renewable term for US Patent 12,095,919 B2
- IPFS-anchored legal provenance (notarized affidavits)
- Coverage: Cryptographic licensing and distribution systems for blockchain-based financial applications

### 2. Optilex Founding Membership (Future Access)
- Priority pool participation when Optilex LitFi infrastructure launches (Q1 2026)
- Early access to capital pooling, claims NFTs, and governance
- Limited to 50 founding members (one per wallet, ends January 9, 2026)

**Important:** Founding Membership grants rights to future pool participation (an option), not automatic investment. Future participation requires separate opt-in and compliance verification.

---

## The Vision: Agentic Litigation Finance

Traditional litigation finance is slow, opaque, and centralized. Legal claims are underutilized assets - most individuals and small companies can't afford to enforce their rights.

**Optilex brings litigation finance onchain:**
- Capital Pooling: Collective funding for legal claims at any scale
- Claims Distribution: Automated settlement distributions via smart contracts
- Multi-Party Governance: Transparent decision-making for claim selection and strategy
- Agent-Executable: AI agents assess risk, match capital to claims, execute autonomously

**The economics of law will never be the same.**

Brolli is the first step - tokenized patent licenses demonstrating IP coverage. The founding membership model tests market demand while building toward the broader LitFi infrastructure.

---

## x402 Integration: Purchases for AI Agents

Brolli leverages **Coinbase x402** (HTTP 402 payment protocol) to enable autonomous agent purchases:

### Agent Purchase Flow
1. Agent calls x402-protected `/api/license/authorize` endpoint
2. x402 middleware verifies USDC payment automatically ($99)
3. Backend issues signed EIP-712 voucher for beneficiary wallet
4. Agent calls `mintOrRenewWithVoucher()` with voucher + signature
5. Soulbound license NFT minted to beneficiary

### Why x402?
- Programmatic payments: Agents pay in USDC without human intervention
- Signed vouchers: Backend cryptographically authorizes minting after payment
- Team provisioning: Single agent can purchase licenses for multiple wallets
- Verifiable flow: All payments and vouchers recorded onchain

---

## Architecture

### Tech Stack
- Smart Contracts: Solidity 0.8.17, Hardhat deployment on Base
- Frontend: Next.js 14 (App Router), RainbowKit, Wagmi, Tailwind CSS
- Payment: USDC (ERC-20) via SafeERC20 pull pattern
- IPFS Storage: Pinata for legal provenance and NFT metadata
- Payment Protocol: Coinbase x402 for agent purchases
- Framework: Scaffold-ETH 2 for rapid prototyping

### Smart Contract: `Brolli.sol`

**Key Features:**
- ERC-721 Enumerable (soulbound via `_beforeTokenTransfer` override)
- USDC payment pull pattern (user approves, contract pulls $99)
- 1-year license term with on-chain expiry tracking
- Max supply: 50 licenses (founding membership release)
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

**Human Purchase:**
1. Connect wallet
2. Accept terms
3. Approve USDC
4. Mint NFT

**Agent Purchase (x402):**
1. Agent pays via x402
2. Backend verifies
3. Issues EIP-712 voucher
4. Agent mints

---

## Founding Membership Terms

**Limited Time Offer (Ends January 9, 2026):**
- $99 in USDC (one-time payment on Base)
- 50 founding memberships total (one per wallet)
- Non-transferable (soulbound NFT)

**What Founding Members Receive:**
1. Patent license (immediate utility)
2. Priority access to Optilex litigation finance pools (Q1 2026)
3. Early infrastructure access (capital pooling, claims NFTs, governance)

**Legal Clarity:**
- Membership grants right to participate in future pools (not automatic investment)
- Infrastructure under development (no guarantees on launch dates or features)
- Separate agreements required for actual pool participation

---

## Roadmap

### Phase 1: Founding Membership Distribution (Now - Jan 9)
- [x] Base mainnet deployment
- [x] Human USDC payment flow (approve + mint)
- [x] x402 agent payment integration
- [x] EIP-712 voucher system
- [ ] End-to-end agent voucher redemption testing
- [ ] x402 mainnet testing (currently Sepolia-tested)

### Phase 2: Optilex LitFi Infrastructure (Q1 2026)
- [ ] Claims NFTs (ERC-1155) for representing legal interests
- [ ] Capital pooling contracts with USDC
- [ ] Multi-party approval workflows
- [ ] Automated distribution mechanisms
- [ ] Founding member onboarding to first pools

### Phase 3: Agentic Integration
- [ ] ElizaOS plugin for autonomous risk assessment
- [ ] Agent-to-agent license transfers (within compliance bounds)
- [ ] Batch purchase flows for team provisioning
- [ ] API-driven pool participation for agents

### Phase 4: Governance & Scale
- [ ] Multi-pool support (different claim types, jurisdictions)
- [ ] DAO governance for claim selection
- [ ] Cross-jurisdictional legal framework
- [ ] Additional patent portfolios and IP licensing

---

## Built With

### [Scaffold-ETH 2](https://scaffoldeth.io/)
Rapid prototyping framework for Ethereum dApps. Brolli leverages proven contract patterns, frontend hooks, and deployment infrastructure from the BuidlGuidl community.

### [Coinbase x402](https://github.com/coinbase/x402)
HTTP 402 payment protocol enabling programmatic USDC payments from AI agents. Core hackathon integration demonstrating autonomous agent purchases.

### [Pinata](https://pinata.cloud/)
IPFS infrastructure for decentralized storage. Brolli stores notarized affidavits and patent documentation permanently on IPFS via Pinata.

### [ElizaOS](https://github.com/ai16z/eliza) (Coming Soon)
AI agent framework for conversational interfaces. Future Brolli plugin will enable autonomous patent risk assessment and license purchases.

---

## Links

- **Website:** [brolli.optilex.ai](https://brolli.vercel.app)
- **Base Mainnet Contract:** [`0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0`](https://basescan.org/address/0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0)
- **GitHub:** [Optilex-Labs/brolli-x402](https://github.com/Optilex-Labs/brolli-x402)
- **Scaffold-ETH 2:** https://scaffoldeth.io
- **Coinbase x402:** https://github.com/coinbase/x402

---

**Built for the x402 Hackathon by Optilex Labs**

Demonstrating autonomous agent purchases via x402 while distributing founding memberships in litigation finance infrastructure.
