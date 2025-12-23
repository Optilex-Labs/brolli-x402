import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import externalContracts from "~~/contracts/externalContracts";

type NetworkName = "base" | "baseSepolia" | "hardhat";

function getNetwork(): NetworkName {
  const raw = process.env.NETWORK || process.env.NEXT_PUBLIC_TARGET_NETWORK;
  if (raw === "base" || raw === "baseSepolia" || raw === "hardhat") return raw;
  return "baseSepolia"; // Default
}

function getChainIdFromNetwork(network: NetworkName) {
  if (network === "base") return 8453;
  if (network === "hardhat") return 31337;
  return 84532; // baseSepolia
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

export async function POST(req: Request) {
  const { beneficiary } = (await req.json().catch(() => ({}))) as { beneficiary?: `0x${string}` };
  if (!beneficiary) return NextResponse.json({ error: "Missing beneficiary" }, { status: 400 });

  const privateKey = process.env.LICENSE_SIGNER_PRIVATE_KEY as `0x${string}` | undefined;
  if (!privateKey) return NextResponse.json({ error: "Missing LICENSE_SIGNER_PRIVATE_KEY" }, { status: 500 });

  const resourceWallet = process.env.X402_RESOURCE_WALLET as `0x${string}` | undefined;
  if (!resourceWallet) return NextResponse.json({ error: "Missing X402_RESOURCE_WALLET" }, { status: 500 });

  const network = getNetwork();
  const chainId = getChainIdFromNetwork(network);
  const verifyingContract = getBrolliAddress(chainId);
  if (!verifyingContract) {
    return NextResponse.json(
      { error: `Missing Brolli deployment for chainId ${chainId}. Run hardhat deploy for this network.` },
      { status: 500 },
    );
  }

  // --- Verify USDC Allowance ---
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const usdcContract = externalContracts[chainId as keyof typeof externalContracts]?.USDC;
  if (!usdcContract) {
    return NextResponse.json({ error: `USDC contract not configured for chainId ${chainId}` }, { status: 500 });
  }

  const requiredAmount = parseUnits("1", 6); // $1 USDC with 6 decimals

  try {
    const allowance = (await publicClient.readContract({
      address: usdcContract.address as `0x${string}`,
      abi: usdcContract.abi,
      functionName: "allowance",
      args: [beneficiary, resourceWallet],
    })) as bigint;

    if (allowance < requiredAmount) {
      return NextResponse.json(
        {
          error: "Insufficient USDC allowance. Please approve $1 USDC first.",
          required: requiredAmount.toString(),
          current: allowance.toString(),
        },
        { status: 402 },
      );
    }
  } catch (error) {
    console.error("Error checking USDC allowance:", error);
    return NextResponse.json({ error: "Failed to verify USDC allowance" }, { status: 500 });
  }

  // --- Issue Voucher ---
  const account = privateKeyToAccount(privateKey);
  const nonce = getNonce();
  const validUntil = BigInt(Math.floor(Date.now() / 1000) + 10 * 60); // 10 minutes TTL

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
}

