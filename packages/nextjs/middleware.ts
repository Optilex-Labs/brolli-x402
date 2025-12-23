import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { x402Middleware } from "x402-next";

// Only enable x402 on Base Sepolia or Base mainnet
function isX402Enabled(): boolean {
  const network = process.env.NEXT_PUBLIC_TARGET_NETWORK || process.env.NETWORK;
  return network === "baseSepolia" || network === "base";
}

// x402 payment configuration
const RESOURCE_WALLET = process.env.X402_RESOURCE_WALLET || "0xbDa36A47a41Fe693CC55316f58146dA556FDEFf3";
const NETWORK = process.env.NEXT_PUBLIC_TARGET_NETWORK || process.env.NETWORK || "baseSepolia";

// Price: $1 for Base Sepolia testing, $99 for mainnet
const PRICE_USD = NETWORK === "base" ? "99" : "1";

// Network ID for x402
const X402_NETWORK = NETWORK === "base" ? "eip155:8453" : "eip155:84532";

const paymentMiddleware = x402Middleware({
  resources: [
    {
      route: "/api/license/authorize",
      price: `$${PRICE_USD}`,
      network: X402_NETWORK,
      recipient: RESOURCE_WALLET as `0x${string}`,
    },
    {
      route: "/api/agents/purchase-batch",
      // NOTE: x402 middleware charges a fixed price per request
      // This is $99 regardless of batch size - agents should be aware
      // For true dynamic pricing, agents may need to call single endpoint multiple times
      price: `$${PRICE_USD}`,
      network: X402_NETWORK,
      recipient: RESOURCE_WALLET as `0x${string}`,
    },
  ],
});

export async function middleware(request: NextRequest) {
  // Skip x402 entirely on localhost/hardhat
  if (!isX402Enabled()) {
    return NextResponse.next();
  }

  // x402-gate AGENT endpoints only
  // Human purchases use /api/license/purchase (no x402)
  if (
    request.nextUrl.pathname === "/api/license/authorize" ||
    request.nextUrl.pathname === "/api/agents/purchase-batch"
  ) {
    return paymentMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/license/authorize", "/api/agents/purchase-batch"], // Only x402-gate agent routes
};

