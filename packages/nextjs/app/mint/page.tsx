"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount, usePublicClient } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth/networks";
import { BrolliChatWidget } from "~~/components/brolli-chat/brolli-chat-widget";
import { BrolliFaq } from "~~/components/brolli-faq/brolli-faq";
import { PromoBanner } from "~~/components/promo-banner";

interface LicenseFormState {
  name: string;
  imageUri: string;
  provenanceCid: string;
}

// IPFS link for license details (full URL, not just hash)
const PROVENANCE_LINK = "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreidc7qbkdsfirbetsu5owm56oeqkhwhqlxpfgjio4qy3xexigod2nq";

const initialState: LicenseFormState = {
  name: "",
  imageUri: "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreialme2ca3b36nzq5rqqdqaw3k2le4uvgrdxtdj33t2j4sn44amisi",
  provenanceCid: PROVENANCE_LINK,
};

const RESOURCE_WALLET = "0xbDa36A47a41Fe693CC55316f58146dA556FDEFf3";

const BrolliLicensePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();
  const { targetNetwork } = useTargetNetwork();
  const publicClient = usePublicClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<LicenseFormState>(initialState);

  const [yourLicenses, setYourLicenses] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { data: balance } = useScaffoldReadContract({
    contractName: "Brolli",
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: Boolean(connectedAddress),
  } as any);

  const { data: hasExistingLicense } = useScaffoldReadContract({
    contractName: "Brolli",
    functionName: "hasLicense",
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: Boolean(connectedAddress),
  } as any);

  const { data: mintPrice } = useScaffoldReadContract({
    contractName: "Brolli",
    functionName: "mintPrice",
  } as any);

  const { data: contract } = useScaffoldContract({ contractName: "Brolli" });
  const { writeContractAsync: writeBrolliAsync } = useScaffoldWriteContract("Brolli");
  const { writeContractAsync: writeUsdcAsync } = useScaffoldWriteContract("USDC");

  function update<K extends keyof LicenseFormState>(key: K, value: LicenseFormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (contract && balance && connectedAddress) {
        const total = (balance as unknown as bigint) ?? 0n;
        const items = [] as any[];
        for (let tokenIndex = 0n; tokenIndex < total; tokenIndex++) {
          try {
            const tokenId = await contract.read.tokenOfOwnerByIndex([connectedAddress, tokenIndex]);
            const tokenURI = await contract.read.tokenURI([tokenId]);
            const jsonManifestString = atob(tokenURI.substring(29));
            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              items.push({ id: tokenId, uri: tokenURI, ...jsonManifest });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
        setYourLicenses(items);
      } else {
        setYourLicenses([]);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, connectedAddress, Boolean(contract)]);

  function handleMint() {
    if (!connectedAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    setShowTermsModal(true);
  }

  async function handlePurchase() {
    if (!connectedAddress || !acceptedTerms) {
      alert("Please accept terms and conditions.");
      return;
    }

    if (!contract?.address) {
      alert("Contract not loaded. Please refresh the page.");
      return;
    }

    setShowTermsModal(false);
    setIsSubmitting(true);

    try {
      // Read the actual mint price from contract
      const approvalAmount = mintPrice || BigInt("99000000"); // Fallback to $99 if not loaded
      
      // Step 1: Approve Brolli contract to spend USDC (following Vendor.sol pattern)
      console.log(`Approving ${approvalAmount.toString()} USDC for Brolli contract...`);
      const approvalTxHash = await writeUsdcAsync({
        functionName: "approve",
        args: [contract.address, approvalAmount],
      });
      
      // Wait for approval transaction to be confirmed
      if (approvalTxHash && publicClient) {
        console.log("Waiting for approval confirmation...");
        await publicClient.waitForTransactionReceipt({ hash: approvalTxHash });
        console.log("Approval confirmed!");
      }

      // Step 2: Mint NFT (contract will pull USDC payment)
      console.log("Minting NFT...");
      await writeBrolliAsync({
        functionName: "mint",
        args: ["", form.imageUri, form.provenanceCid],
      });

      setForm(initialState);
      setAcceptedTerms(false);
      alert("License purchased successfully!");
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Purchase failed. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderImage(src: string, alt: string) {
    const isExternal = src.startsWith("http");
    if (isExternal) return <img src={src} alt={alt} width={300} height={300} />;
    return <Image src={src} alt={alt} width={300} height={300} />;
  }

  return (
    <>
    <PromoBanner />
    {/* Hero Section with Video Background and Logo Overlay */}
    <div className="relative h-[55vh] w-full overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover object-top"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75" />
      
      {/* Logo Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pb-12">
        <div className="text-center z-10">
                      <Image
              src="/hero.png"
              alt="Brolli for BUIDLers"
              width={600}
              height={600}
              className="mx-auto drop-shadow-2xl"
            />

            <p className="text-lg md:text-xl text-white font-medium mt-4 mb-6 drop-shadow-lg">
              Tokenized IP protection for fintech innovators
            </p>

            {/* CTA Button */}
            <button
              onClick={handleMint}
              className="btn px-8 py-3 text-lg font-semibold mb-8"
              style={{
                backgroundColor: '#4f46e5',
                borderColor: '#4f46e5',
                color: 'white'
              }}
              disabled={isSubmitting || Boolean(hasExistingLicense)}
            >
              {isSubmitting
                ? "Processing Purchase..."
                : Boolean(hasExistingLicense)
                  ? "You already own Brolli"
                  : !connectedAddress
                    ? "Connect Wallet to Purchase"
                    : "Get Brolli - $99"
              }
            </button>
        </div>
      </div>
    </div>

    {/* Promotional Details Section */}
    <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 py-12 px-5">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Holiday Hacker Special</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-6 max-w-2xl mx-auto">
          <div className="backdrop-blur-sm rounded-2xl p-6 border-2" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: '#A855F7' }}>
            <div className="mb-2">
              <span className="text-5xl font-bold text-purple-400">$99</span>
            </div>
            <div className="text-xl mb-2">Hacker Special</div>
            <div className="text-sm opacity-90">Ends Jan 9, 2026</div>
            <div className="text-xs opacity-75 mt-2">Early Access to Optilex Litigation Finance Infrastructure</div>
          </div>
          <div className="backdrop-blur-sm rounded-2xl p-6 border-2" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: '#A855F7' }}>
            <div className="text-5xl font-bold mb-2 text-purple-400">50</div>
            <div className="text-xl mb-2">Total Supply</div>
            <div className="text-sm opacity-90">Soulbound • One per Wallet</div>
          </div>
        </div>
        <p className="text-lg opacity-95">
          Are you hacking on innovative fintech, real world asset, stablecoin or crypto apps this season? This special is for you!
        </p>
      </div>
    </div>

 <div className="flex flex-col items-center justify-center flex-grow pt-10 px-5">
  <div className="w-full max-w-3xl bg-base-200 p-6 rounded-xl border-2 border-primary flex flex-col items-center space-y-6">
    
    <h2 className="text-2xl font-bold text-center">Brolli NFT Minter</h2>
    
    <p className="text-center text-lg text-base-content/70">
      Patent License: Zero-Knowledge Compliance Infrastructure for Real-World Asset Finance
    </p>
    
    <Link 
      href="/details" 
      className="btn btn-lg"
      style={{
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
        color: 'white'
      }}
    >
      View Brolli NFT Details
    </Link>
    
    <button 
      onClick={handleMint} 
      className="text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transform hover:scale-105 transition-all duration-200"
      style={{
        backgroundColor: '#4f46e5',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
      disabled={isSubmitting || Boolean(hasExistingLicense)}
    >
      {isSubmitting 
        ? "Processing Purchase..." 
        : Boolean(hasExistingLicense)
          ? "License active"
          : !connectedAddress
            ? "Connect Wallet to Purchase"
            : "Get Brolli - $99"
      }
    </button>
    
    {Boolean(hasExistingLicense) && (
      <p className="text-sm text-warning text-center">
        You already own Brolli!
      </p>
    )}
  </div>
</div>

    <BrolliFaq />


    {/* Enhanced Content Section After Minter */}
    <div className="flex items-center flex-col flex-grow pt-16">
      <div className="px-6 max-w-6xl mx-auto">
        {/* Main Value Proposition */}
        <div className="text-center mb-12">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Why Brolli for BUIDLers?
          </h2>
        </div>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 text-center">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-sm text-base-content/70 uppercase tracking-wide">Blockchain Patents</div>
            <div className="text-xs text-base-content/50 mt-1">Issued in the U.S.</div>
          </div>
          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">85%</div>
            <div className="text-sm text-base-content/70 uppercase tracking-wide">Held by Enterprises</div>
            <div className="text-xs text-base-content/50 mt-1">Banks & Tech Giants</div>
          </div>
          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 text-center">
            <div className="text-4xl font-bold text-accent mb-2">!</div>
            <div className="text-sm text-base-content/70 uppercase tracking-wide">Waiting to Strike</div>
            <div className="text-xs text-base-content/50 mt-1">Patent Trolls Target Success</div>
          </div>
        </div>

        {/* The Problem */}
        <div className="bg-gradient-to-br from-base-100 to-base-200 p-8 rounded-3xl shadow-xl border border-base-300 mb-12">
          

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-red-500 text-xl mt-1 font-bold">•</div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Patent Trolls Wait</h4>
                  <p className="text-base-content/70">They monitor successful projects and strike when you're most vulnerable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-purple-500 text-xl mt-1 font-bold">•</div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Enterprise Dominance</h4>
                  <p className="text-base-content/70">Banks, consultancies, and tech giants hold most blockchain patents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl mt-1 font-bold">•</div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Targets: BUILDers</h4>
                  <p className="text-base-content/70">Startups, DAOs, and open-science projects are prime targets.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Image
                src="/Brolli.png"
                width="180"
                height="180"
                alt="Brolli Logo"
                className="mx-auto mb-6 rounded-lg shadow-lg"
              />
              <div className="text-3xl font-bold mb-4 text-primary">PROTECTION</div>
              <p className="text-sm text-base-content/60">Collective protection for the ecosystem</p>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-3xl border border-primary/20 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">code+law</h3>
            <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
              NFT license framework anchored on-chain, providing broad protection for real-world asset web3 systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-base-300 p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="flex flex-col items-center mb-4">
                <svg className="w-8 h-8 text-base-content/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="text-3xl font-bold text-secondary">PROVENANCE</div>
              </div>

              <p className="text-sm text-base-content">Legal affidavit notarized and stored on-chain for maximum credibility.</p>
            </div>
            <div className="bg-base-300 p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="flex flex-col items-center mb-4">
                <svg className="w-8 h-8 text-base-content/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="text-3xl font-bold text-secondary">PROOF</div>
              </div>

              <p className="text-sm text-base-content">Portable proof of coverage that travels with your project.</p>
            </div>
            <div className="bg-base-300 p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="flex flex-col items-center mb-4">
                <svg className="w-8 h-8 text-base-content/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <div className="text-3xl font-bold text-secondary">VALIDATION</div>
              </div>

              <p className="text-sm text-base-content">Complete evidence bundle ready for verification and disputes.</p>
            </div>
          </div>
        </div>

        {/* Brolli Hero Logo - Centered between container rows */}
        <div className="text-center my-12">
          <Image
            src="/hero.png"
            width="250"
            height="250"
            alt="Brolli Logo"
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>

        
        {/* Duplicated  MINT Button */}
        <div className="text-center my-8">
          <button
            onClick={handleMint}
            className="btn px-8 py-3 text-lg font-semibold"
            style={{
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
              color: 'white'
            }}
            disabled={isSubmitting || Boolean(hasExistingLicense)}
          >
            {isSubmitting
              ? "Processing Purchase..."
              : Boolean(hasExistingLicense)
                ? "You already own Brolli"
                : !connectedAddress
                  ? "Connect Wallet to Purchase"
                  : "Get Brolli - $99"
            }
          </button>
        </div>

        {/* Call to Action */}
        


      </div>
    </div>
      <div className="flex items-center justify-center min-h-screen w-full py-10">
        <div className="w-full max-w-7xl px-5">
          <div className="bg-base-300 w-full p-8 rounded-3xl">
            <div className="text-center">
            {loading ? (
              <p className="my-2 font-medium">Loading...</p>
            ) : !yourLicenses?.length ? (
                <p className="my-2 font-medium">Brolli for BUIDLers</p>
            ) : (
              <div>
                  <h3 className="text-2xl font-bold mb-6 text-secondary">My Brolli</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
                  {yourLicenses.map(license => {
                    return (
                        <div key={license.id} className="flex flex-col bg-base-100 p-5 text-center items-center max-w-xs rounded-3xl shadow-lg border border-neutral">
                        <h2 className="text-xl font-bold"></h2>
                        {license.image && renderImage(license.image, license.name)}
                        <p className="mt-2 text-sm">{license.description}</p>

                        {/* Provenance Link */}
                        {license.resources?.provenance && (
                          <div className="mt-2">
                            <a
                              href={license.resources.provenance}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-xs btn-outline btn-secondary"
                            >
                              View Provenance
                            </a>
                          </div>
                        )}

                        {/* Block Explorer Links */}
                        <div className="mt-4 w-full">
                          <a
                            href={contract?.address ? getBlockExplorerAddressLink(targetNetwork as any, contract.address) : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            View Contract
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Get Brolli - $99 USDC</h3>

            {/* Terms Acceptance */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded accent-[#4f46e5]"
                />
                <span className="text-sm">
                  I accept the{" "}
                  <Link href="/terms" className="underline text-[#4f46e5]" target="_blank">
                    Terms & Conditions
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy-policy" className="underline text-[#4f46e5]" target="_blank">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                disabled={!acceptedTerms || isSubmitting}
                className="btn w-full"
                style={{
                  backgroundColor: '#4f46e5',
                  borderColor: '#4f46e5',
                  color: 'white',
                  opacity: (!acceptedTerms || isSubmitting) ? 0.5 : 1
                }}
              >
                {isSubmitting ? "Processing..." : "Get Brolli"}
              </button>

              <button
                onClick={() => {
                  setShowTermsModal(false);
                  setAcceptedTerms(false);
                }}
                className="btn w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BrolliChatWidget />
    </>
  );
};

export default BrolliLicensePage; 