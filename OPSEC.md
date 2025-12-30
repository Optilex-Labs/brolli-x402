# Brolli MVP OPSEC Checklist (deployer + signer + revenue wallet)

This is an engineering checklist to reduce operational risk. It is not legal, tax, or compliance advice.

## Wallet roles (separate keys)
- **Deployer (EVM)**: deploys/verifies contracts. Not used to receive revenue.
- **License signer (server key)**: signs short-lived vouchers after x402 payment. Should not hold meaningful funds.
- **Resource wallet (revenue)**: the `payTo` address for x402 (receives USDC).

Recommended minimum: **3 distinct addresses**.

## Key storage & handling
- **Deployer**: hardware wallet preferred. If using hot key, store in a password manager + encrypted local env; rotate after deployment.
- **License signer** (server): treat as a hot key; store only in your hosting provider’s secret manager (e.g. Vercel env var). Rotate periodically.
- **Resource wallet**: hardware wallet or Safe multisig. Keep this key offline when possible.

Never paste private keys into chat logs, screenshots, or terminals that might be recorded.

## Environment variables (do not commit)
In Brolli NextJS (`packages/nextjs`):
- `NEXT_PUBLIC_FACILITATOR_URL` (x402)
- `RESOURCE_WALLET_ADDRESS` (x402 payee / revenue wallet)
- `NETWORK` (`baseSepolia` for staging, `base` for prod)
- `LICENSE_SIGNER_PRIVATE_KEY` (server-only; **never** `NEXT_PUBLIC_*`)
- `NEXT_PUBLIC_TARGET_NETWORK` (`baseSepolia` or `base` for UI network targeting)

In Brolli Hardhat (`packages/hardhat`):
- `DEPLOYER_PRIVATE_KEY`
- `LICENSE_SIGNER_ADDRESS` (public address matching the server key)

## Deployment hygiene
- Deploy to **Base Sepolia** first, validate:\n  - x402 gate returns 402 and accepts payment\n  - `/api/license/authorize` issues vouchers\n  - `mintOrRenewWithVoucher` updates `licenseExpiry`\n- Only after staging success, deploy to **Base mainnet**.\n- After mainnet deploy:\n  - Verify contract\n  - Confirm `licenseSigner` is set correctly\n  - Ensure `RESOURCE_WALLET_ADDRESS` is correct\n  - Confirm price is `$99.00` (middleware config)\n
## Revenue handling / cash-out path (post-MVP)
- Keep revenue in the **resource wallet** initially.\n- As soon as practical, migrate to your licensed money transmitter / custodial workflow (e.g. Coinbase) following their onboarding and compliance requirements.\n- Plan for a Safe multisig treasury once you have meaningful revenue.

## Incident response basics
- If **license signer key** leaks: rotate immediately (update env + call `setLicenseSigner` on-chain).
- If **resource wallet key** leaks: move funds immediately; rotate the `payTo` address in middleware.
- If **deployer key** leaks: rotate and stop using it; contract ownership might need transfer depending on your ownership model.


