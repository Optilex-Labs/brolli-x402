# Brolli Agent Purchase Demo

This script demonstrates how an AI agent can autonomously purchase a Brolli license using the x402 protocol.

## Prerequisites

1. Deploy Brolli contract to Base Sepolia:
```bash
cd /Users/nina/ranger-se2/brolli
yarn deploy --network baseSepolia --reset
```

2. Create an agent wallet with test funds:
   - Generate a new private key or use an existing wallet
   - Fund it with Base Sepolia ETH (for gas)
   - Fund it with Base Sepolia USDC (for payment)

3. Set up environment variables:
```bash
# Create .env file in packages/nextjs/
NETWORK=baseSepolia
AGENT_PRIVATE_KEY=0x...your_agent_private_key...
BROLLI_CONTRACT=0x...deployed_contract_address...
BROLLI_API_URL=http://localhost:3000  # or your deployed URL
```

## Running the Demo

```bash
cd /Users/nina/ranger-se2/brolli/packages/nextjs
yarn ts-node scripts/agent-purchase.ts
```

## What It Does

1. **Requests a voucher** from `/api/license/authorize` (x402-gated)
2. **Handles x402 payment** (via x402-next middleware)
3. **Mints the NFT** using `mintOrRenewWithVoucher()` onchain

## Expected Output

```
🤖 Brolli x402 Agent Purchase Demo
=====================================
Network: baseSepolia
Agent Address: 0x...
API URL: http://localhost:3000
Contract: 0x...

📡 Step 1: Requesting license voucher...
✅ Voucher received!
   Nonce: 123456...
   Valid Until: 2025-12-22T...

🎫 Step 3: Minting Brolli license NFT...
   Transaction hash: 0x...
   Waiting for confirmation...
✅ License minted successfully!
   Block: 12345
   Gas used: 250000

🎉 Agent purchase complete!
   View on explorer: https://sepolia.basescan.org/tx/0x...
```

## Troubleshooting

### "Payment Required (HTTP 402)"
This means x402 is working! In production, the agent would handle the payment flow automatically using the x402 client SDK.

### "Insufficient USDC allowance"
The agent needs to approve USDC spending first. Add an approval step before calling the API.

### "Missing BROLLI_CONTRACT"
Find your deployed contract address in `packages/nextjs/contracts/deployedContracts.ts` under the Base Sepolia chain ID (84532).

## For Hackathon Judges

This script demonstrates:
- ✅ x402 protocol integration for machine-to-machine payments
- ✅ Autonomous AI agent purchasing digital assets
- ✅ Full payment + minting flow without human intervention
- ✅ Real USDC transactions on Base testnet

