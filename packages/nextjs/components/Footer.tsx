import React from "react";
import Link from "next/link";


/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="flex flex-wrap gap-2 justify-center">
        <span>© Optilex, LLC</span>
        <span>·</span>
        <Link href="/privacy-policy" className="link">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link href="/terms" className="link">
          Terms
        </Link>
        <span>·</span>
        <a href="https://github.com/martianina/brolli" target="_blank" rel="noopener noreferrer" className="link">
          GitHub
        </a>
      </div>
            
    </div>
  );
};
