"use client";

import Link from "next/link";
import Image from "next/image";

export default function AgentsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 py-20 px-5">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Brolli for Agents</h1>
          <p className="text-2xl mb-8">Automated License Purchasing via x402</p>
          <Link
            href="/agents/purchase"
            className="btn btn-lg px-8 py-3 text-lg font-semibold"
            style={{
              backgroundColor: 'white',
              color: '#F97316',
              border: 'none'
            }}
          >
            Purchase License
          </Link>
        </div>
      </div>

      {/* Use Case Section */}
      <div className="max-w-5xl mx-auto px-5 py-16">
        <div className="bg-base-100 rounded-3xl p-8 border border-base-300 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-6">Use Case: Agent Wallet Licensing</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                AI agents can autonomously purchase Brolli licenses for their wallet using the x402 payment protocol.
              </p>
              
              <div className="bg-base-200 p-4 rounded-lg mb-4">
                <h3 className="font-bold mb-2">Example Use Cases:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">→</span> Developer Agent acquiring access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">→</span> Trading Agent purchasing IP rights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">→</span> PM Agent provisioning for team member
                  </li>
                </ul>
              </div>

              <p className="text-sm text-base-content/70">
                Single payment via x402 protocol provisions one license automatically.
              </p>
            </div>

            <div className="bg-base-200 p-6 rounded-2xl">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🤖</div>
                <div className="font-bold text-lg">Agent Workflow</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-success font-bold">1.</span>
                  <span>Specify beneficiary wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-success font-bold">2.</span>
                  <span>Call x402-gated API</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-success font-bold">3.</span>
                  <span>x402 verifies USDC payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-success font-bold">4.</span>
                  <span>Receive EIP-712 voucher</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-success font-bold">5.</span>
                  <span>Mint license to beneficiary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* x402 Explainer */}
        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-3xl p-8 border border-primary/20 mb-12">
          <h2 className="text-3xl font-bold mb-6">What is x402?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">Instant Settlement</h3>
              <p className="text-sm text-base-content/70">
                2-second payment finality on Base network
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔓</div>
              <h3 className="font-bold mb-2">HTTP 402 Protocol</h3>
              <p className="text-sm text-base-content/70">
                Standard payment protocol for the internet
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold mb-2">Agent-Native</h3>
              <p className="text-sm text-base-content/70">
                Built for autonomous systems and workflows
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="https://docs.cdp.coinbase.com/x402/welcome" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Learn more about x402 →
            </a>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-base-100 rounded-3xl p-8 border border-base-300 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-6">Example Code</h2>
          
          <div className="bg-base-300 p-6 rounded-xl overflow-x-auto">
            <pre className="text-sm">
              <code>{`// Agent single license purchase example
import { X402Client } from "x402-next/client";

const client = new X402Client({
  privateKey: process.env.AGENT_PRIVATE_KEY,
  network: "eip155:8453", // Base mainnet
});

const beneficiaryWallet = "0xBENEFICIARY_WALLET";

// x402 automatically handles USDC payment
const response = await client.fetch(
  "/api/license/authorize",
  {
    method: "POST",
    body: JSON.stringify({ 
      beneficiary: beneficiaryWallet 
    }),
  }
);

const { voucher, signature } = await response.json();

// Mint license using the voucher
await mintLicense(voucher, signature);`}</code>
            </pre>
          </div>

          <div className="mt-4 text-sm text-base-content/70">
            <p>Full example script available in the GitHub repository.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-base-content/60">
            Built for the x402 Hackathon • Powered by Coinbase Base
          </p>
        </div>
      </div>
    </div>
  );
}

