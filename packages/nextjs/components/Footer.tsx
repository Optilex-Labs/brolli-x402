import React from "react";
import Link from "next/link";


/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <span>© Optilex, LLC</span>
        <span>·</span>
        <a href="https://x.com/OptilexAI" target="_blank" rel="noopener noreferrer" className="link">
          Twitter
        </a>
        <span>·</span>
        <a href="https://github.com/Optilex-Labs/brolli-x402" target="_blank" rel="noopener noreferrer" className="link">
          GitHub
        </a>
        <span>·</span>
        <Link href="/terms" className="link">
          Terms
        </Link>
        <span>·</span>
        <Link href="/privacy-policy" className="link">
          Privacy
        </Link>
      </div>
            
    </div>
  );
};
