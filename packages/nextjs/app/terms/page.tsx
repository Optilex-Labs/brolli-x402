import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-base-100 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-primary">
          Brolli License Terms
        </h1>

        <div className="mb-6 text-center text-base-content/70">
          <p className="text-lg font-medium">Brolli for BUIDLers v.1.1</p>
          <p className="text-sm">Effective Date: December 20, 2025</p>
        </div>

        <div className="space-y-6 text-base-content">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              1. License Grant & Proof
            </h2>
            <p>
              Brolli is a Web3 licensing product. Holding a Brolli soulbound NFT in your wallet is intended to serve as
              cryptographic proof that you have been granted a license, subject to these Terms and the provenance package
              referenced by the NFT metadata.
            </p>
            <p className="mt-3">
              Your license is <strong>time-limited</strong>. Unless otherwise stated in the provenance package, the license
              term is <strong>one (1) year</strong> from purchase/renewal and may be renewable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              2. Term, Renewal, and Non-Transferability
            </h2>
            <p>
              The Brolli NFT is designed to be non-transferable (soulbound). The license is associated with the wallet that
              holds the Brolli NFT and is subject to on-chain expiry. Renewal extends the license term; renewal does not
              necessarily mint a new NFT.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              3. Payments (x402 / USDC on Base)
            </h2>
            <p>
              Access to purchase/renewal may be gated using the x402 (HTTP 402) protocol. Payments are intended to be made in
              USDC on Base networks (e.g., Base Sepolia for testing and Base mainnet for production), as configured at the
              time of purchase.
            </p>
            <p className="mt-3">
              Blockchain transactions are generally irreversible. Refunds, chargebacks, and cancellations (if any) are
              governed by a separate written agreement or published refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              4. Provenance Package Controls
            </h2>
            <p>
              The provenance package referenced in the NFT metadata (for example, an IPFS-hosted document bundle) describes
              key license details and may include additional terms or scope limitations. In the event of inconsistency,
              interpret these Terms and the provenance package together as a single agreement, with the provenance package
              controlling on technical identifiers and referenced materials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              5. Assignment
            </h2>
            <p>
              Licensor may assign the subject patent and/or this agreement to an affiliated or successor entity without licensee consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              6. No Warranties / No Legal Advice
            </h2>
            <p>
              The Service is provided \"as-is\" and \"as available.\" Nothing in the Service or NFT metadata constitutes legal,
              financial, or tax advice. You should consult your own advisors for your specific situation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              7. Risks and Blockchain Transparency
            </h2>
            <p>
              Wallet addresses and on-chain activity are publicly visible. You are responsible for wallet security, private-key
              management, gas fees, and any consequences of interacting with smart contracts and third-party tooling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              8. Limitations of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential,
              or punitive damages, or any loss of profits, revenues, data, or goodwill, arising out of or related to your use
              of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              9. Governing Law and Venue
            </h2>
            <p>
              These Terms are governed by the laws of <strong>[Insert Jurisdiction]</strong>, without regard to conflict-of-law
              principles. Any disputes must be resolved in the courts of that jurisdiction.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-base-300 text-center">
          <p className="text-sm text-base-content/60">
            Please read these Terms carefully before purchasing or renewing a Brolli license. Your use constitutes acceptance
            of these Terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
