import Link from "next/link";

export default function AgentDocsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        <Link href="/agents" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Agents
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Brolli Agent API Documentation</h1>
        <p className="text-base-content/70 mb-12">
          Programmatic access to lawyer-curated patent risk framework for blockchain applications
        </p>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="mb-4">
            The Brolli Risk Assessment API provides programmatic access to our lawyer-curated
            patent risk framework for blockchain applications. Agents can query risk scores,
            patent counts, and purchase recommendations before making procurement decisions.
          </p>
          <div className="bg-base-200 p-4 rounded-lg font-mono text-sm">
            Base URL: https://brolli.vercel.app/api
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <p className="mb-4">
            The risk assessment API is public and does not require authentication. 
            License purchases require x402 payment verification.
          </p>
        </section>

        {/* GET /risk/assess */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">GET /risk/assess</h2>
          <p className="mb-4">Get available verticals and use cases</p>
          
          <div className="bg-base-300 p-6 rounded-lg mb-4">
            <div className="font-bold mb-2">Request:</div>
            <pre className="text-sm overflow-x-auto"><code>{`curl https://brolli.vercel.app/api/risk/assess`}</code></pre>
          </div>
          
          <div className="bg-base-300 p-6 rounded-lg">
            <div className="font-bold mb-2">Response:</div>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap"><code>{`{
  "version": "1.0.0",
  "lastUpdated": "2025-12-29",
  "availableVerticals": [
    {
      "id": "payments",
      "name": "Payment Systems",
      "riskTier": "HIGH",
      "patentCount": 1243,
      "useCases": ["stablecoin", "crossBorder"]
    }
  ]
}`}</code></pre>
          </div>
        </section>

        {/* POST /risk/assess */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">POST /risk/assess</h2>
          <p className="mb-4">Assess patent risk for your specific use case</p>
          
          <div className="bg-base-300 p-6 rounded-lg mb-4">
            <div className="font-bold mb-2">Request:</div>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap"><code>{`curl -X POST https://brolli.vercel.app/api/risk/assess \\
  -H "Content-Type: application/json" \\
  -d '{
    "vertical": "payments",
    "useCases": ["stablecoin", "crossBorder"],
    "description": "USDC payment processor"
  }'`}</code></pre>
          </div>
          
          <div className="bg-base-300 p-6 rounded-lg mb-6">
            <div className="font-bold mb-2">Response:</div>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap"><code>{`{
  "vertical": "Payment Systems",
  "riskTier": "HIGH",
  "riskScore": 8.2,
  "totalPatents": 1243,
  "matchedUseCases": [
    {
      "id": "stablecoin",
      "name": "Stablecoin Systems",
      "riskScore": 8.5,
      "patentCount": 847,
      "recommendation": "PURCHASE_RECOMMENDED"
    }
  ],
  "recommendation": "PURCHASE_RECOMMENDED",
  "justification": "Your use case falls within Payment Systems...",
  "settlementRange": "$100K-$500K",
  "licensePrice": "$99/year",
  "roi": "Potential savings: $100K-$500K vs. $99 = 1,010x-5,050x ROI",
  "disclaimer": "This framework represents professional judgment..."
}`}</code></pre>
          </div>

          <div className="bg-info/10 border border-info/30 p-4 rounded-lg">
            <div className="font-bold mb-2">Agent Decision Logic:</div>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap"><code>{`// Example: Agent uses risk score to make purchase decision
const assessment = await fetch('/api/risk/assess', {...});
const { riskScore, recommendation } = await assessment.json();

if (recommendation === 'CRITICAL_PURCHASE' || riskScore >= 7.0) {
  // Auto-purchase license
  await purchaseBrolliLicense();
  return { status: 'PROTECTED', cost: 99 };
} else if (riskScore >= 5.0) {
  // Request human approval
  await notifyTeam('Patent risk detected. Recommend license purchase.');
}`}</code></pre>
          </div>
        </section>

        {/* Available Verticals */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Available Verticals</h2>
          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="font-bold mb-2">
                <code className="bg-base-300 px-2 py-1 rounded">payments</code> - Payment Systems
              </div>
              <div className="text-sm text-base-content/70">
                Stablecoins, cross-border transfers, payment processing (1,243 patents, HIGH risk)
              </div>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="font-bold mb-2">
                <code className="bg-base-300 px-2 py-1 rounded">lending</code> - Lending & Borrowing
              </div>
              <div className="text-sm text-base-content/70">
                Collateralized lending, interest protocols (892 patents, CRITICAL risk)
              </div>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="font-bold mb-2">
                <code className="bg-base-300 px-2 py-1 rounded">dex</code> - Decentralized Exchange
              </div>
              <div className="text-sm text-base-content/70">
                AMMs, liquidity pools, swap protocols (734 patents, MEDIUM_HIGH risk)
              </div>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="font-bold mb-2">
                <code className="bg-base-300 px-2 py-1 rounded">nft</code> - NFT & Tokenization
              </div>
              <div className="text-sm text-base-content/70">
                NFT minting, metadata, royalties (523 patents, MEDIUM risk)
              </div>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="font-bold mb-2">
                <code className="bg-base-300 px-2 py-1 rounded">rwa</code> - Real World Assets
              </div>
              <div className="text-sm text-base-content/70">
                Tokenized securities, commodities (678 patents, HIGH risk)
              </div>
            </div>
          </div>
        </section>

        {/* Purchase License */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Purchase License via x402</h2>
          <p className="mb-4">
            After assessing risk, agents can purchase licenses autonomously using x402 payment protocol:
          </p>
          <div className="bg-base-300 p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap"><code>{`import { X402Client } from "x402-next/client";

// Initialize x402 client
const client = new X402Client({
  privateKey: process.env.AGENT_PRIVATE_KEY,
  network: "eip155:8453" // Base mainnet
});

// Purchase license (x402 handles USDC payment automatically)
const response = await client.fetch(
  "https://brolli.vercel.app/api/license/authorize",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      beneficiary: "0xYOUR_WALLET_ADDRESS" 
    })
  }
);

const { voucher, signature } = await response.json();

// License purchased! Use voucher to mint on-chain
console.log('License voucher received:', voucher);`}</code></pre>
          </div>
        </section>

        {/* Verify License On-Chain */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Verify License On-Chain</h2>
          <p className="mb-4">
            After purchase, agents can verify license validity programmatically:
          </p>
          <div className="bg-base-300 p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap"><code>{`import { ethers } from "ethers";

const BROLLI_ADDRESS = "0xF44d5712826Eca7429ccf7F2fEa4b61f089e3Ea0";
const BROLLI_ABI = [
  "function hasLicense(address who) view returns (bool)",
  "function licenseExpiry(address who) view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
const contract = new ethers.Contract(BROLLI_ADDRESS, BROLLI_ABI, provider);

// Check if wallet has valid license
const hasLicense = await contract.hasLicense("0xWALLET_ADDRESS");
const expiry = await contract.licenseExpiry("0xWALLET_ADDRESS");

console.log('License valid:', hasLicense);
console.log('Expires:', new Date(Number(expiry) * 1000));`}</code></pre>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <p className="text-base-content/70">
            Risk assessment API: Unlimited requests<br/>
            License purchase API: Rate limited by x402 protocol (see Coinbase x402 docs)
          </p>
        </section>

        {/* Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Support</h2>
          <p className="text-base-content/70">
            For questions or issues, please open an issue on our{" "}
            <a href="https://github.com/brolli-ip/brolli" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              GitHub repository
            </a>
          </p>
        </section>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-base-300">
          <Link 
            href="/agents/purchase"
            className="btn btn-lg"
            style={{
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
              color: 'white'
            }}
          >
            Purchase License - $99
          </Link>
        </div>
      </div>
    </div>
  );
}

