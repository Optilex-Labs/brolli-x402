# Hardhat → Base Sepolia ($1) switch checklist

## 0) Preconditions
- You have a funded **deployer** (Base Sepolia ETH for gas)
- You have a funded **buyer** (Base Sepolia USDC for the $1 test)

## 1) Hardhat package (deploy)
Set env vars (Hardhat):
- `DEPLOYER_PRIVATE_KEY=...`
- `LICENSE_SIGNER_ADDRESS=0x...` (public address of the server-side signer key)

Deploy to Base Sepolia:
- `yarn deploy --network baseSepolia`

## 2) NextJS package (Brolli frontend)
Set env vars (NextJS):
- `NEXT_PUBLIC_TARGET_NETWORK=baseSepolia`
- `NETWORK=baseSepolia`
- `NEXT_PUBLIC_FACILITATOR_URL=...`
- `RESOURCE_WALLET_ADDRESS=0x...` (your payTo wallet)
- `LICENSE_SIGNER_PRIVATE_KEY=0x...` (server-side signer; must match `LICENSE_SIGNER_ADDRESS`)
- `OPENAI_API_KEY=...` (only for chatbot)

Start:
- `yarn start`

## 3) Test buy flow ($1)
1. Open `/license/purchase`
2. Accept Terms
3. Trigger purchase/renew (should go through x402 and then mint/renew)
4. Verify on-chain:
   - `licenseExpiry(address)` increases
   - NFT exists for the wallet


