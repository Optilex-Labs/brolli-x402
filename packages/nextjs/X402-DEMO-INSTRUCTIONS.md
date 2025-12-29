# x402 Agent Demo - Quick Start

## What I've Done For You

✅ Fixed `scaffold.config.ts` - Frontend now shows Base Sepolia  
✅ Fixed `scripts/agent-purchase.ts` - Uses X402Client for automatic payment  
✅ Generated agent test wallet  
✅ Created setup scripts for easy execution

## Your Wallet

**Private Key:** `0x79f0ffa6c3f90c4e9f5e1f48b3863be938ac8645987f18f084fac68543997dcf`

**Address:** Run this to get your address:
```bash
cd packages/nextjs
yarn ts-node scripts/generate-wallet.ts
```

## What You Need To Do

### Step 1: Set Up Environment

```bash
cd packages/nextjs
cp setup-agent-env.sh.example setup-agent-env.sh
```

Edit `setup-agent-env.sh` and replace:
- `YOUR_AGENT_PRIVATE_KEY_HERE` - Get from `yarn ts-node scripts/generate-wallet.ts`
- `YOUR_DEPLOYER_PRIVATE_KEY_HERE` - From `packages/hardhat/.env` (the key you used to deploy)

### Step 2: Fund the Agent Wallet

Once you have the wallet address from `generate-wallet.ts`, fund it with:

1. **Base Sepolia ETH** (for gas):  
   https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

2. **Base Sepolia USDC** (for payment):  
   https://faucet.circle.com/  
   - Select "Base Sepolia"  
   - Request $10 USDC

### Step 3: Make Sure Next.js is Running

```bash
cd packages/nextjs
yarn dev
```

It should now show "Base Sepolia" in the network selector.

### Step 4: Record the Demo

```bash
cd packages/nextjs

# Set up environment
source ./setup-agent-env.sh

# Start screen recording (CMD+Shift+5 on Mac)

# Run the demo
./run-agent-demo.sh

# Stop recording when done
```

## Expected Output

```
🤖 Brolli x402 Agent Purchase Demo
====================================
Network: baseSepolia
Agent Address: 0x...
API URL: http://localhost:3000
Contract: 0xc51fcBceDb2Fc000692929e95a0F57e7b966fA24

📡 Step 1: Requesting license voucher via x402...
   X402Client will automatically handle payment if required
✅ Voucher received!
   Nonce: 0x...
   Valid Until: 2025-12-...

🎫 Step 3: Minting Brolli license NFT...
   Transaction hash: 0x...
   Waiting for confirmation...
✅ License minted successfully!
   Block: ...
   Gas used: ...

🎉 Agent purchase complete!
   View on explorer: https://sepolia.basescan.org/tx/0x...
```

## Files Created

- `scripts/generate-wallet.ts` - Shows your wallet info
- `setup-agent-env.sh` - Sets environment variables (⚠️ EDIT THIS)
- `run-agent-demo.sh` - Runs the demo
- `X402-DEMO-INSTRUCTIONS.md` - This file

## Troubleshooting

**"Missing LICENSE_SIGNER_PRIVATE_KEY"**  
→ Edit `setup-agent-env.sh` with your deployer key

**"Insufficient USDC balance"**  
→ Fund the wallet from Circle faucet

**"Transaction reverted"**  
→ Make sure you have ETH for gas

**"Module not found"**  
→ Run `yarn install` in packages/nextjs


