"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import Link from "next/link";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function AgentPurchasePage() {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const [beneficiary, setBeneficiary] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Network-aware pricing: $1 on Base Sepolia, $99 on Base mainnet
  const PRICE = process.env.NEXT_PUBLIC_TARGET_NETWORK === "base" ? 99 : 1;

  async function handlePurchase() {
    setError(null);
    
    const trimmedBeneficiary = beneficiary.trim();
    if (!trimmedBeneficiary) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isAddress(trimmedBeneficiary)) {
      setError("Invalid wallet address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the x402-gated single-license API
      const response = await fetch("/api/license/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beneficiary: trimmedBeneficiary }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Purchase failed" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Purchase successful:", data);
      setSuccess(true);
      
      // Redirect to success page
      setTimeout(() => {
        router.push("/agents");
      }, 3000);
    } catch (e) {
      console.error("Purchase error:", e);
      setError(e instanceof Error ? e.message : "Purchase failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="max-w-md w-full bg-base-100 p-8 rounded-2xl border border-primary shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Voucher Received!</h2>
          <p className="mb-4">License voucher generated for {beneficiary}</p>
          <p className="text-sm text-base-content/70">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/agents" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Agent Info
          </Link>
          <h1 className="text-4xl font-bold mb-2">Agent License Purchase</h1>
          <p className="text-lg text-base-content/70">Single License via x402</p>
        </div>

        <div className="bg-base-100 p-8 rounded-2xl border border-base-300 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Beneficiary Wallet</h2>
          <p className="text-sm text-base-content/60 mb-6">
            Enter the wallet address that will receive the license voucher.
          </p>
          
          <div className="mb-6">
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="0x..."
              className="input input-bordered w-full font-mono text-sm"
            />
          </div>

          <div className="bg-base-200 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Price:</span>
              <span className="text-2xl font-bold">
                ${PRICE} <span className="text-sm text-base-content/70">USDC</span>
              </span>
            </div>
            <div className="text-sm text-base-content/60 mt-2">
              Single license purchase
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={isSubmitting || !beneficiary.trim()}
            className="btn w-full text-lg"
            style={{
              backgroundColor: '#A855F7',
              borderColor: '#A855F7',
              color: 'white',
              opacity: (isSubmitting || !beneficiary.trim()) ? 0.5 : 1
            }}
          >
            {isSubmitting ? "Processing Payment..." : `Purchase License for $${PRICE}`}
          </button>

          <p className="text-xs text-base-content/50 text-center mt-4">
            Payment processed via x402 protocol. Automatic USDC payment verification.
          </p>
        </div>
      </div>
    </div>
  );
}

