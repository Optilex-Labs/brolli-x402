import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { privateKeyToAccount } from "viem/accounts";
import deployedContracts from "~~/contracts/deployedContracts";

type NetworkName = "base" | "baseSepolia" | "hardhat";

function getNetwork(): NetworkName {
  const raw = process.env.NETWORK;
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
  // 96 bits of randomness is plenty for an on-chain uint256 nonce
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
}


