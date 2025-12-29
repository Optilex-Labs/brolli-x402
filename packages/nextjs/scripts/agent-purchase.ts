#!/usr/bin/env ts-node
/**
 * Demo script showing x402 agent purchase flow
 * 
 * This demonstrates how an AI agent can autonomously purchase a Brolli license
 * using the x402 protocol without human intervention.
 * 
 * Usage:
 *   AGENT_PRIVATE_KEY=0x... BROLLI_CONTRACT=0x... yarn ts-node scripts/agent-purchase.ts
 */

import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";
import { X402Client } from "x402-next/client";

// Configuration
const NETWORK = process.env.NETWORK || "baseSepolia";
const AGENT_PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}`;
const BROLLI_API_URL = process.env.BROLLI_API_URL || "http://localhost:3000";
const BROLLI_CONTRACT = process.env.BROLLI_CONTRACT as `0x${string}`;

if (!AGENT_PRIVATE_KEY) {
  console.error("❌ Missing AGENT_PRIVATE_KEY environment variable");
  process.exit(1);
}

if (!BROLLI_CONTRACT) {
  console.error("❌ Missing BROLLI_CONTRACT environment variable");
  console.error("   Find the deployed contract address in packages/nextjs/contracts/deployedContracts.ts");
  process.exit(1);
}

const chain = NETWORK === "base" ? base : baseSepolia;
const account = privateKeyToAccount(AGENT_PRIVATE_KEY);

console.log("🤖 Brolli x402 Agent Purchase Demo");
console.log("=====================================");
console.log(`Network: ${NETWORK}`);
console.log(`Agent Address: ${account.address}`);
console.log(`API URL: ${BROLLI_API_URL}`);
console.log(`Contract: ${BROLLI_CONTRACT}`);
console.log("");

async function main() {
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  // Initialize x402 client for automated payment handling
  const x402Client = new X402Client({
    privateKey: AGENT_PRIVATE_KEY,
    rpcUrl: chain.rpcUrls.default.http[0],
  });

  // Step 1: Request voucher (x402 client handles payment automatically)
  console.log("📡 Step 1: Requesting license voucher via x402...");
  console.log("   X402Client will automatically handle payment if required");
  
  try {
    const response = await x402Client.fetch(`${BROLLI_API_URL}/api/license/authorize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        beneficiary: account.address,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("✅ Voucher received!");
    console.log(`   Nonce: ${data.voucher.nonce}`);
    console.log(`   Valid Until: ${new Date(Number(data.voucher.validUntil) * 1000).toISOString()}`);
    console.log("");

    // Step 3: Mint NFT with voucher
    console.log("🎫 Step 3: Minting Brolli license NFT...");

    const BROLLI_ABI = [
      {
        inputs: [
          {
            components: [
              { name: "beneficiary", type: "address" },
              { name: "nonce", type: "uint256" },
              { name: "validUntil", type: "uint256" },
            ],
            name: "v",
            type: "tuple",
          },
          { name: "sig", type: "bytes" },
          { name: "name", type: "string" },
          { name: "imageUri", type: "string" },
          { name: "provenanceCid", type: "string" },
        ],
        name: "mintOrRenewWithVoucher",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ] as const;

    const hash = await walletClient.writeContract({
      address: BROLLI_CONTRACT,
      abi: BROLLI_ABI,
      functionName: "mintOrRenewWithVoucher",
      args: [
        {
          beneficiary: data.voucher.beneficiary,
          nonce: BigInt(data.voucher.nonce),
          validUntil: BigInt(data.voucher.validUntil),
        },
        data.signature,
        "Brolli License",
        "", // Use default image
        "", // Use default provenance
      ],
    });

    console.log(`   Transaction hash: ${hash}`);
    console.log("   Waiting for confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`✅ License minted successfully!`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
    console.log("");
    console.log("🎉 Agent purchase complete!");
    console.log(`   View on explorer: ${chain.blockExplorers?.default.url}/tx/${hash}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

