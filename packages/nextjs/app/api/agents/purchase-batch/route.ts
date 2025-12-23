import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { privateKeyToAccount } from "viem/accounts";
import { isAddress } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";

type NetworkName = "base" | "baseSepolia" | "hardhat";

function getNetwork(): NetworkName {
  const raw = process.env.NETWORK || process.env.NEXT_PUBLIC_TARGET_NETWORK;
  if (raw === "base" || raw === "baseSepolia" || raw === "hardhat") return raw;
  return "baseSepolia";
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
  const { beneficiaries } = (await req.json().catch(() => ({}))) as { beneficiaries?: string[] };
  
  if (!beneficiaries || !Array.isArray(beneficiaries) || beneficiaries.length === 0) {
    return NextResponse.json({ error: "Missing or invalid beneficiaries array" }, { status: 400 });
  }

  // Validate all addresses
  for (const addr of beneficiaries) {
    if (!isAddress(addr)) {
      return NextResponse.json({ error: `Invalid address: ${addr}` }, { status: 400 });
    }
  }

  // Check for duplicates
  const unique = new Set(beneficiaries);
  if (unique.size !== beneficiaries.length) {
    return NextResponse.json({ error: "Duplicate addresses detected" }, { status: 400 });
  }

  const privateKey = process.env.LICENSE_SIGNER_PRIVATE_KEY as `0x${string}` | undefined;
  if (!privateKey) return NextResponse.json({ error: "Missing LICENSE_SIGNER_PRIVATE_KEY" }, { status: 500 });

  const network = getNetwork();
  const chainId = getChainIdFromNetwork(network);
  const verifyingContract = getBrolliAddress(chainId);
  if (!verifyingContract) {
    return NextResponse.json(
      { error: `Missing Brolli deployment for chainId ${chainId}. Run hardhat deploy for this network.` },
      { status: 500 },
    );
  }

  const account = privateKeyToAccount(privateKey);
  const domain = getVoucherDomain(chainId, verifyingContract);
  const validUntil = BigInt(Math.floor(Date.now() / 1000) + 10 * 60); // 10 minutes TTL

  // Generate a voucher for each beneficiary
  const vouchers = [];
  const signatures = [];

  for (const beneficiary of beneficiaries) {
    const nonce = getNonce();
    const message = {
      beneficiary: beneficiary as `0x${string}`,
      nonce,
      validUntil,
    } as const;

    const signature = await account.signTypedData({
      domain,
      types: voucherTypes,
      primaryType: "Voucher",
      message,
    });

    vouchers.push({
      beneficiary,
      nonce: nonce.toString(),
      validUntil: validUntil.toString(),
    });
    signatures.push(signature);
  }

  return NextResponse.json({
    chainId,
    verifyingContract,
    count: beneficiaries.length,
    vouchers,
    signatures,
  });
}

