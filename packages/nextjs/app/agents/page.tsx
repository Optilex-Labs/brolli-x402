"use client";

import { useState } from "react";
import Link from "next/link";
import riskGraph from "@/data/patent-risk-graph.json";

export default function AgentsPage() {
  const [vertical, setVertical] = useState("");
  const [riskResult, setRiskResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  async function assessRisk() {
    if (!vertical) return;
    
    setLoading(true);
    try {
      const verticalData = riskGraph.verticals[vertical as keyof typeof riskGraph.verticals];
      const response = await fetch("/api/risk/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          vertical,
          useCases: Object.keys(verticalData?.useCases || {})
        })
      });
      const data = await response.json();
      setRiskResult(data);
    } catch (error) {
      console.error("Risk assessment failed:", error);
      alert("Failed to assess risk. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 py-20 px-5">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Brolli for Agents</h1>
          <p className="text-2xl mb-8">Automated License Purchasing via x402</p>
          <div className="flex gap-4 justify-center">
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
            <Link
              href="/agents/docs"
              className="btn btn-lg btn-outline px-8 py-3 text-lg font-semibold text-white border-white hover:bg-white hover:text-orange-500"
            >
              API Docs
            </Link>
          </div>
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

        {/* Risk Calculator Widget */}
        <div className="bg-base-100 rounded-3xl p-8 border border-primary/20 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-4">Assess Your Patent Risk</h2>
          <p className="text-base-content/70 mb-8">
            Select your vertical to get a lawyer-curated risk assessment based on patent density and enforcement activity.
          </p>
          
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {Object.entries(riskGraph.verticals).map(([key, v]) => (
              <button
                key={key}
                onClick={() => setVertical(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  vertical === key ? 'border-primary bg-primary/10 scale-105' : 'border-base-300 hover:border-primary/50'
                }`}
              >
                <div className="font-bold text-sm mb-1">{v.name}</div>
                <div className="text-xs text-base-content/60 mb-2">{v.patentCount} patents</div>
                <div className={`text-xs font-semibold px-2 py-1 rounded ${
                  v.riskTier === 'CRITICAL' ? 'bg-error/20 text-error' :
                  v.riskTier === 'HIGH' ? 'bg-warning/20 text-warning' : 
                  v.riskTier === 'MEDIUM_HIGH' ? 'bg-info/20 text-info' :
                  'bg-success/20 text-success'
                }`}>
                  {v.riskTier.replace('_', ' ')}
                </div>
              </button>
            ))}
          </div>
          
          {vertical && (
            <button 
              onClick={assessRisk} 
              disabled={loading}
              className="btn btn-primary w-full mb-6 text-lg"
            >
              {loading ? "Analyzing..." : "Calculate Risk Score"}
            </button>
          )}
          
          {riskResult && (
            <div className="bg-base-200 p-6 rounded-xl border-2 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-5xl font-bold mb-2">
                    {riskResult.riskScore}/10
                  </div>
                  <div className="text-sm text-base-content/60">Risk Score</div>
                </div>
                <div className={`badge badge-lg ${
                  riskResult.riskTier === 'CRITICAL' ? 'badge-error' :
                  riskResult.riskTier === 'HIGH' ? 'badge-warning' : 'badge-info'
                }`}>
                  {riskResult.riskTier.replace('_', ' ')}
                </div>
              </div>
              
              <div className="mb-4 p-4 bg-base-300 rounded-lg">
                <div className="font-bold mb-2">Assessment:</div>
                <p className="text-sm">{riskResult.justification}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-base-300 p-4 rounded-lg">
                  <div className="text-xs text-base-content/60 mb-1">Settlement Range</div>
                  <div className="font-bold">{riskResult.settlementRange}</div>
                </div>
                <div className="bg-base-300 p-4 rounded-lg">
                  <div className="text-xs text-base-content/60 mb-1">License Cost</div>
                  <div className="font-bold text-success">{riskResult.licensePrice}</div>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg">
                <div className="font-bold text-success mb-2">💰 {riskResult.roi}</div>
                <div className="text-xl font-bold text-primary">
                  Recommendation: {riskResult.recommendation.replace('_', ' ')}
                </div>
              </div>
              
              <Link 
                href="/agents/purchase"
                className="btn btn-lg w-full mb-4"
                style={{
                  backgroundColor: '#F97316',
                  borderColor: '#F97316',
                  color: 'white'
                }}
              >
                Purchase License - $99
              </Link>
              
              <div className="text-xs text-base-content/50 text-center">
                {riskResult.disclaimer}
              </div>
            </div>
          )}
        </div>

        {/* ElizaOS Plugin Section */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/30 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">🤖</div>
            <div>
              <h2 className="text-3xl font-bold">ElizaOS Integration</h2>
              <p className="text-base-content/70">Add autonomous patent risk assessment to your agent</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Install the Plugin</h3>
              <div className="bg-base-300 p-4 rounded-lg mb-4 font-mono text-sm">
                npm install @brolli/plugin-eliza
              </div>
              
              <h3 className="text-xl font-bold mb-4">Add to Your Agent</h3>
              <div className="bg-base-300 p-4 rounded-lg mb-4 font-mono text-sm whitespace-pre-wrap">
{`import { brolliPlugin } from '@brolli/plugin-eliza';

const agent = createAgent({
  plugins: [brolliPlugin]
});`}
              </div>
              
              <a 
                href="https://www.npmjs.com/package/@brolli/plugin-eliza"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
              >
                View on npm →
              </a>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">What It Does</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">✓</span>
                  <div>
                    <div className="font-semibold">Automatic Detection</div>
                    <div className="text-sm text-base-content/70">Triggers when agent discusses blockchain projects</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">✓</span>
                  <div>
                    <div className="font-semibold">Risk Assessment</div>
                    <div className="text-sm text-base-content/70">Queries Brolli knowledge graph API for patent risk</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">✓</span>
                  <div>
                    <div className="font-semibold">Smart Recommendations</div>
                    <div className="text-sm text-base-content/70">Provides ROI-based purchase recommendations</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">✓</span>
                  <div>
                    <div className="font-semibold">x402 Integration</div>
                    <div className="text-sm text-base-content/70">Can autonomously purchase licenses</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg">
                <div className="font-bold text-warning mb-2">Example Output:</div>
                <div className="text-sm text-base-content/80">
                  "⚠️ HIGH PATENT RISK DETECTED<br/>
                  Your project matches: Stablecoin Systems<br/>
                  Risk Score: 8.5/10 (HIGH)<br/>
                  <br/>
                  💰 RECOMMENDATION: Purchase Brolli License<br/>
                  Cost: $99/year | ROI: 1,010x-5,050x"
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

