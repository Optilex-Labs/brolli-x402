export interface SalesAgentFaqItem {
  q: string;
  a: string;
}

export interface SalesAgentStyle {
  tone: string[];
  do: string[];
  dont: string[];
}

export interface SalesAgentProgram {
  promotionName: string;
  listPriceUsd: number;
  maxLicenses: number;
  onePerWallet: boolean;
  teamPurchases: string;
  timing: string;
}

export interface SalesAgentCharacter {
  name: string;
  productName: string;
  tagline: string;
  elevatorPitch: string[];
  positioning?: {
    dirtyIp?: string[];
    umbrellaProtection?: string[];
    patentStrategy?: string[];
    cautionaryExamples?: string[];
  };
  canonicalLinks?: {
    patentStrategy?: string;
    businessProcessPatents?: string;
    blockchainPatentLandscape?: string;
    dirtyIp?: string;
    deriskingPlaybook?: string;
    ipFaq?: string;
  };
  program: SalesAgentProgram;
  acceptsPayments: string[];
  keyFacts: string[];
  whatItIs: string[];
  whatItIsNot: string[];
  faq: SalesAgentFaqItem[];
  disclaimers: string[];
  style: SalesAgentStyle;
  cta: string[];
}


