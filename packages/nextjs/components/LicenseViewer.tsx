"use client";

interface LicenseViewerProps {
  className?: string;
}

// IPFS hash for now
const IPFS_HASH = "bafkreidc7qbkdsfirbetsu5owm56oeqkhwhqlxpfgjio4qy3xexigod2nq";

const LICENSE_DETAILS = {
  title: "Brolli for BUIDLers",
  description: "IP Cover for Web3 Developers",
  coverage: [
    "Protection against patent trolls",
    "Defensive patent portfolio access",
    "Legal backing for decentralized protocols",
    "Community-driven IP protection",
  ],
  terms: {
    duration: "1 year (renewable)",
    territory: "Worldwide",
    field:
      "Decentralized Systems, Zero Knowledge Proofs, and Real World Evidence",
    transferable: false,
  },
  ipfsHash: IPFS_HASH,
};

export const LicenseViewer = ({ className = "" }: LicenseViewerProps) => {
  return (
    <div
      className={`bg-base-200 p-6 rounded-xl border-2 border-primary ${className}`}
    >
      <h2 className="text-2xl font-bold text-center mb-4">Brolli Details</h2>
      <p>
        Dynamic data compliance controls at the highest directives and standards
        applicable with a net-sum formula as a zero-knowledge proof compliance
        validation key
      </p>

      <div className="space-y-4">
        {/* License Info Card */}
        <div className="bg-base-100 rounded-lg p-4 border border-base-300">
          <h3 className="text-lg font-semibold mb-2">{LICENSE_DETAILS.title}</h3>
          <p className="text-sm text-base-content/70 mb-3">
            {LICENSE_DETAILS.description}
          </p>

          {/* IPFS Hash Display */}
          <div className="bg-base-200 rounded p-3 mb-3">
            <div className="text-xs text-base-content/60 mb-1">
              IPFS Hash (Provenance)
            </div>
            <div className="font-mono text-sm break-all text-primary">
              {LICENSE_DETAILS.ipfsHash}
            </div>
          </div>

          {/* Coverage */}
          <div>
            <h4 className="font-semibold mb-2">Coverage Includes:</h4>
            <ul className="space-y-1">
              {LICENSE_DETAILS.coverage.map((item, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-success mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Terms */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">License Terms:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Duration:</span>{" "}
                {LICENSE_DETAILS.terms.duration}
              </div>
              <div>
                <span className="font-medium">Territory:</span>{" "}
                {LICENSE_DETAILS.terms.territory}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Field of Use:</span>{" "}
                {LICENSE_DETAILS.terms.field}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Transferable:</span>
                <span
                  className={`ml-1 ${
                    LICENSE_DETAILS.terms.transferable
                      ? "text-success"
                      : "text-warning"
                  }`}
                >
                  {LICENSE_DETAILS.terms.transferable
                    ? "Yes"
                    : "No (Soulbound)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Patents Link */}
        <div className="text-center">
          <a
            href="https://patents.google.com/patent/US12095919B2"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary font-medium"
          >
            View on Google Patents
          </a>
        </div>
      </div>
    </div>
  );
};
