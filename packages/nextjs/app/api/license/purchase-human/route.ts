import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http, parseUnits } from "viem";
import { base, baseSepolia, hardhat } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

type NetworkName = "base" | "baseSepolia" | "hardhat";

const USDC_ADDRESSES = {
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  hardhat: "0x0000000000000000000000000000000000000000", // N/A for localhost
} as const;

function getNetwork(): NetworkName {
  const raw = process.env.NEXT_PUBLIC_TARGET_NETWORK || process.env.NETWORK;
  if (raw === "base" || raw === "baseSepolia" || raw === "hardhat") return raw;
  return "baseSepolia";
}

function getChainIdFromNetwork(network: NetworkName) {
  if (network === "base") return 8453;
  if (network === "hardhat") return 31337;
  return 84532; // baseSepolia
}

function getChainFromNetwork(network: NetworkName) {
  if (network === "base") return base;
  if (network === "hardhat") return hardhat;
  return baseSepolia;
}

function getBrolliAddress(chainId: number) {
  const contractsForChain = (deployedContracts as any)?.[chainId];
  return contractsForChain?.Brolli?.address as `0x${string}` | undefined;
}

function getVoucherDomain(chainId: number, verifyingContract: `0x${string}`) {
  return {
    name: "Brolli",
    version: "1",
    chainId,
    verifyingContract,
  } as const;
}

const voucherTypes = {
  Voucher: [
    { name: "beneficiary", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "validUntil", type: "uint256" },
  ],
} as const;

function getNonce() {
  const bytes = randomBytes(12);
  let hex = "0x";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return BigInt(hex);
}

// ERC-20 ABI for allowance check
const ERC20_ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function POST(req: Request) {
  try {
    const { beneficiary } = (await req.json().catch(() => ({}))) as { beneficiary?: `0x${string}` };
    if (!beneficiary) return NextResponse.json({ error: "Missing beneficiary" }, { status: 400 });

    const network = getNetwork();
    const chainId = getChainIdFromNetwork(network);
    
    // Skip payment verification on localhost
    if (network !== "hardhat") {
      const chain = getChainFromNetwork(network);
      const usdcAddress = USDC_ADDRESSES[network];
      const resourceWallet = (process.env.X402_RESOURCE_WALLET || "0xbDa36A47a41Fe693CC55316f58146dA556FDEFf3") as `0x${string}`;
      
      // Verify USDC allowance
      const client = createPublicClient({
        chain,
        transport: http(),
      });

      const allowance = await client.readContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [beneficiary, resourceWallet],
      });

      // Require at least $1 USDC approval (USDC has 6 decimals)
      const requiredAmount = parseUnits("1", 6);
      if (allowance < requiredAmount) {
        return NextResponse.json(
          { error: "Insufficient USDC allowance. Please approve at least $1 USDC." },
          { status: 402 },
        );
      }
    }

    // Issue voucher
    const privateKey = process.env.LICENSE_SIGNER_PRIVATE_KEY as `0x${string}` | undefined;
    if (!privateKey) return NextResponse.json({ error: "Missing LICENSE_SIGNER_PRIVATE_KEY" }, { status: 500 });

    const verifyingContract = getBrolliAddress(chainId);
    if (!verifyingContract) {
      return NextResponse.json(
        { error: `Missing Brolli deployment for chainId ${chainId}. Run hardhat deploy for this network.` },
        { status: 500 },
      );
    }

    const account = privateKeyToAccount(privateKey);
    const nonce = getNonce();
    const validUntil = BigInt(Math.floor(Date.now() / 1000) + 10 * 60);

    const domain = getVoucherDomain(chainId, verifyingContract);
    const message = {
      beneficiary,
      nonce,
      validUntil,
    } as const;

    const signature = await account.signTypedData({
      domain,
      types: voucherTypes,
      primaryType: "Voucher",
      message,
    });

    return NextResponse.json({
      chainId,
      verifyingContract,
      voucher: {
        beneficiary,
        nonce: nonce.toString(),
        validUntil: validUntil.toString(),
      },
      signature,
    });
  } catch (error) {
    console.error("Error in purchase-human:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

