"use client";

import Link from "next/link";
import Image from "next/image";
import type { NextPage } from "next";
import { PromoBanner } from "~~/components/promo-banner";

const OptilexLanding: NextPage = () => {
  return (
    <>
    <PromoBanner />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900">
        {/* Hero Section */}
        <section className="relative h-[40vh] flex items-center justify-center">
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Optilex
            </h1>
            <p className="text-lg text-gray-400 mb-6 max-w-xl mx-auto">
              Agentic Litigation Finance Infrastructure
            </p>
            <div className="flex justify-center mb-6">
              <Image
                src="/optilex-logo.svg"
                alt="Optilex"
                width={60}
                height={60}
                className="opacity-30"
              />
            </div>
            <p className="text-2xl md:text-3xl text-gray-200">
              The economics of law will never be the same.
            </p>
          </div>
        </section>

        {/* Business Case */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-4 text-center">Why Agentic Litigation Finance?</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Legal claims are underutilized assets. Most individuals and small companies can't afford to enforce their rights or defend against threats.
                </p>
                <p>
                  Traditional litigation finance is opaque, centralized, and accessible only to large claimants. Onchain infrastructure enables transparent capital pooling, automated distributions, and collective decision-making at any scale.
                </p>
                <p>
                  AI agents can assess risk, match capital to claims, and execute strategies autonomously. The economics of law fundamentally change when legal action becomes programmable, pooled, and agent-executable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founding Membership */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Founding Membership
              </h2>
              <div className="flex justify-center mb-6">
                <Image
                  src="/hero.png"
                  alt="Brolli"
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <p className="text-xl text-base-content/70">
                First 50 Brolli purchasers get priority access to Optilex pools
              </p>
            </div>

            <div className="bg-base-200 p-8 rounded-xl border-2 border-white text-center max-w-md mx-auto">
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$99</span>
                <p className="text-base-content/70 mt-2">USDC on Base</p>
              </div>
              <div className="mb-8">
                <p className="text-base-content mb-4">
                  Patent license + early access to litigation finance infrastructure
                </p>
                <p className="text-sm text-base-content/50">
                  Ends January 9, 2026 • 50 memberships only
                </p>
              </div>
              <Link 
                href="/mint"
                className="btn btn-primary w-full text-lg"
              >
                Get Brolli
              </Link>
            </div>

            <div className="mt-12 text-center text-sm text-base-content/50 max-w-2xl mx-auto">
              <p>
                Membership grants rights to future pool participation (not automatic investment). 
                Infrastructure under development. No guarantees on launch dates or features.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default OptilexLanding;
