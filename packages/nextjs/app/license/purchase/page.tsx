"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface VoucherResponse {
  chainId: number;
  verifyingContract: `0x${string}`;
  voucher: {
    beneficiary: `0x${string}`;
    nonce: string;
    validUntil: string;
  };
  signature: `0x${string}`;
}

const DEFAULT_IMAGE_URI =
  "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreialme2ca3b36nzq5rqqdqaw3k2le4uvgrdxtdj33t2j4sn44amisi";
const DEFAULT_PROVENANCE_CID =
  "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreidc7qbkdsfirbetsu5owm56oeqkhwhqlxpfgjio4qy3xexigod2nq";

function getDisplayedPrice() {
  if (process.env.NEXT_PUBLIC_TARGET_NETWORK === "hardhat" || process.env.NETWORK === "hardhat") return "$0.00 (dev)";
  return process.env.NEXT_PUBLIC_TARGET_NETWORK === "base" || process.env.NETWORK === "base" ? "$99.00" : "$1.00";
}

export default function PurchasePage() {
  const { address } = useAccount();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: expiry } = useScaffoldReadContract({
    contractName: "Brolli",
    functionName: "licenseExpiry",
    args: address ? [address] : undefined,
    enabled: Boolean(address),
  } as any);

  const expirySeconds = useMemo(() => {
    try {
      return typeof expiry === "bigint" ? Number(expiry) : 0;
    } catch {
      return 0;
    }
  }, [expiry]);

  const nowSeconds = Math.floor(Date.now() / 1000);
  const hasActiveLicense = expirySeconds > nowSeconds;

  const { writeContractAsync } = useScaffoldWriteContract("Brolli");

  async function handleAuthorizeAndMintOrRenew() {
    if (!address) return;
    if (!hasAcceptedTerms) {
      setErrorMessage("Please accept the Terms before purchasing.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/license/authorize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ beneficiary: address }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Authorization failed (${res.status})`);
      }

      const body = (await res.json()) as VoucherResponse;

      await writeContractAsync({
        functionName: "mintOrRenewWithVoucher",
        args: [
          {
            beneficiary: body.voucher.beneficiary,
            nonce: BigInt(body.voucher.nonce),
            validUntil: BigInt(body.voucher.validUntil),
          },
          body.signature,
          "Brolli License",
          DEFAULT_IMAGE_URI,
          DEFAULT_PROVENANCE_CID,
        ],
      });
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 border border-base-300">
        <h1 className="text-3xl font-bold text-center mb-3 text-primary">Purchase / Renew License</h1>
        <p className="text-center text-base-content/70 mb-8">
          1-year, non-transferable license. Price: <span className="font-semibold">{getDisplayedPrice()}</span>
        </p>

        {!address ? (
          <div className="alert alert-warning">
            <span>Connect a wallet to continue.</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-base-200 rounded-xl p-4">
              <div className="text-sm text-base-content/70">Current status</div>
              <div className="font-semibold">{hasActiveLicense ? "Active (renewable)" : "Not active"}</div>
              {expirySeconds > 0 && (
                <div className="text-sm text-base-content/70">
                  Valid until: <span className="font-mono">{new Date(expirySeconds * 1000).toISOString()}</span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mt-1"
                checked={hasAcceptedTerms}
                onChange={e => setHasAcceptedTerms(e.target.checked)}
              />
              <span className="text-sm">
                I have read and accept the{" "}
                <Link href="/terms" className="link link-primary" target="_blank" rel="noreferrer">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="link link-primary" target="_blank" rel="noreferrer">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {errorMessage && (
              <div className="alert alert-error">
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              className="btn btn-primary w-full"
              onClick={handleAuthorizeAndMintOrRenew}
              disabled={!hasAcceptedTerms || isSubmitting}
            >
              {isSubmitting ? "Processing..." : hasActiveLicense ? "Renew for 1 year" : "Purchase 1-year license"}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}


