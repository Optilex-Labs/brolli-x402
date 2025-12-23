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
  const [wallets, setWallets] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Network-aware pricing: $1 on Base Sepolia, $99 on Base mainnet
  const PRICE_PER_LICENSE = process.env.NEXT_PUBLIC_TARGET_NETWORK === "base" ? 99 : 1;

  // Read USDC balance of connected wallet
  const { data: usdcBalance } = useScaffoldReadContract({
    contractName: "USDC",
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: Boolean(connectedAddress),
  } as any);

  function addWallet() {
    setWallets([...wallets, ""]);
  }

  function removeWallet(index: number) {
    if (wallets.length === 1) return; // Keep at least one
    setWallets(wallets.filter((_, i) => i !== index));
  }

  function updateWallet(index: number, value: string) {
    const newWallets = [...wallets];
    newWallets[index] = value;
    setWallets(newWallets);
  }

  function validateWallets(): { valid: boolean; message?: string } {
    // Filter out empty wallets FIRST, then trim
    const nonEmpty = wallets
      .map(w => w.trim())
      .filter(w => w.length > 0);
    
    if (nonEmpty.length === 0) {
      return { valid: false, message: "Please enter at least one wallet address" };
    }

    for (const wallet of nonEmpty) {
      if (!isAddress(wallet)) {
        return { valid: false, message: `Invalid address: ${wallet.slice(0, 10)}...` };
      }
    }

    // Check for duplicates (only among non-empty addresses)
    const unique = new Set(nonEmpty);
    if (unique.size !== nonEmpty.length) {
      return { valid: false, message: "Duplicate wallet addresses detected" };
    }

    return { valid: true };
  }

  async function handlePurchase() {
    setError(null);
    const validation = validateWallets();
    if (!validation.valid) {
      setError(validation.message || "Invalid input");
      return;
    }

    const beneficiaries = wallets.filter(w => w.trim().length > 0);
    setIsSubmitting(true);

    try {
      // Call the x402-gated batch API
      const response = await fetch("/api/agents/purchase-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beneficiaries }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Purchase failed" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Purchase successful:", data);
      setSuccess(true);
      
      // Redirect to success page or show vouchers
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

  const totalPrice = wallets.filter(w => w.trim().length > 0).length * PRICE_PER_LICENSE;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="max-w-md w-full bg-base-100 p-8 rounded-2xl border border-primary shadow-xl text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4">Purchase Successful!</h2>
          <p className="mb-4">Licenses purchased for {wallets.filter(w => w.trim()).length} wallets.</p>
          <p className="text-sm text-base-content/70">Redirecting to agent dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/agents" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Agent Info
          </Link>
          <h1 className="text-4xl font-bold mb-2">Brolli for Agents</h1>
          <p className="text-lg text-base-content/70">Batch License Purchases</p>
        </div>

        {/* Wallet Connection Section */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">Your Wallet (Payor)</h3>
              {connectedAddress && (
                <div className="text-sm text-base-content/70">
                  {usdcBalance !== undefined && (
                    <p>USDC Balance: ${(Number(usdcBalance) / 1000000).toFixed(2)}</p>
                  )}
                </div>
              )}
            </div>
            <RainbowKitCustomConnectButton />
          </div>
          {!connectedAddress && (
            <p className="text-sm text-warning mt-3">
              Connect your wallet to purchase licenses for your team.
            </p>
          )}
        </div>

        <div className="bg-base-100 p-8 rounded-2xl border border-base-300 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Enter Wallet Addresses</h2>
          <p className="text-sm text-base-content/60 mb-6">
            Licenses will be minted to these wallets. You pay, they receive.
          </p>
          
          <div className="space-y-3 mb-6">
            {wallets.map((wallet, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => updateWallet(index, e.target.value)}
                  placeholder={`Wallet ${index + 1} (0x...)`}
                  className="input input-bordered flex-1 font-mono text-sm"
                />
                {wallets.length > 1 && (
                  <button
                    onClick={() => removeWallet(index)}
                    className="btn btn-square btn-outline btn-error"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addWallet}
            className="btn btn-outline w-full mb-6"
            type="button"
          >
            + Add Another Wallet
          </button>

          <div className="bg-base-200 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                ${totalPrice} <span className="text-sm text-base-content/70">USD</span>
              </span>
            </div>
            <div className="text-sm text-base-content/60 mt-2">
              {wallets.filter(w => w.trim()).length} license(s) × ${PRICE_PER_LICENSE}/license
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={!connectedAddress || isSubmitting || wallets.filter(w => w.trim()).length === 0}
            className="btn w-full text-lg"
            style={{
              backgroundColor: '#F97316',
              borderColor: '#F97316',
              color: 'white',
              opacity: (!connectedAddress || isSubmitting || wallets.filter(w => w.trim()).length === 0) ? 0.5 : 1
            }}
          >
            {!connectedAddress
              ? "Connect Wallet to Purchase"
              : isSubmitting
                ? "Processing Payment..."
                : `Pay $${totalPrice} with x402`}
          </button>

          <p className="text-xs text-base-content/50 text-center mt-4">
            Payment processed via x402 protocol. Your agent wallet will be prompted to sign the transaction.
          </p>
        </div>
      </div>
    </div>
  );
}

