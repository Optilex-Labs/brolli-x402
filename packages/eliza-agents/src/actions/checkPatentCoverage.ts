import type { Action, Memory, State } from '@ai16z/eliza';
import { brolliSalesAgentCharacter } from '../../index';

interface RiskMatch {
  vertical: string;
  useCase: string;
  riskScore: number;
  riskTier: string;
  patentCount: number;
  confidence: number;
}

interface RiskAssessmentResponse {
  matches?: RiskMatch[];
}

export const checkPatentCoverage: Action = {
  name: "CHECK_PATENT_COVERAGE",
  similes: ["ASSESS_PATENT_RISK", "CHECK_IP_COVERAGE", "EVALUATE_PATENT_RISK"],
  description: "Assess blockchain patent risk using Brolli's knowledge base",
  
  validate: async (runtime: any, message: Memory, state?: State) => {
    const content = message.content?.text?.toLowerCase() || '';
    const patentKnowledge = (brolliSalesAgentCharacter as any).patentKnowledge;
    
    // Check if message contains any vertical keywords
    for (const [verticalKey, verticalData] of Object.entries(patentKnowledge.verticals)) {
      const vData = verticalData as any;
      if (vData.keywords.some((kw: string) => content.includes(kw.toLowerCase()))) {
        return true;
      }
    }
    
    // Also trigger on general risk/project keywords
    const triggers = [
      'building', 'deploy', 'launch', 'mainnet', 'project',
      'risk', 'patent', 'ip coverage', 'litigation'
    ];
    return triggers.some(trigger => content.includes(trigger));
  },
  
  handler: async (runtime: any, message: Memory, state?: State) => {
    try {
      const content = message.content?.text || '';
      const patentKnowledge = (brolliSalesAgentCharacter as any).patentKnowledge;
      
      // Match content to verticals using keywords
      let bestMatch: { vertical: string; score: number } | null = null;
      
      for (const [verticalKey, verticalData] of Object.entries(patentKnowledge.verticals)) {
        const vData = verticalData as any;
        let score = 0;
        for (const kw of vData.keywords) {
          if (content.toLowerCase().includes(kw.toLowerCase())) {
            score += kw.length; // Longer matches = higher confidence
          }
        }
        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { vertical: verticalKey, score };
        }
      }
      
      if (!bestMatch) {
        return {
          text: "I can help assess your patent risk! Tell me what you're building:\n" +
                "• Stablecoin/payment system?\n" +
                "• Lending protocol?\n" +
                "• DEX/AMM?\n" +
                "• NFT platform?\n" +
                "• RWA tokenization?\n" +
                "• Identity/privacy features?",
          action: "REQUEST_MORE_INFO"
        };
      }
      
      const vertical = (patentKnowledge.verticals as any)[bestMatch.vertical];
      const riskScore = vertical.riskScore;
      const licensePrice = brolliSalesAgentCharacter.program.listPriceUsd;
      
      // Calculate ROI
      const settlementLow = parseInt(vertical.settlementRange.split('-')[0].replace(/\D/g, ''));
      const settlementHigh = parseInt(vertical.settlementRange.split('-')[1].replace(/\D/g, ''));
      const roiLow = Math.round(settlementLow / licensePrice);
      const roiHigh = Math.round(settlementHigh / licensePrice);
      
      if (riskScore >= 8.0) {
        return {
          text: `⚠️ CRITICAL PATENT RISK DETECTED\n\n` +
                `Vertical: ${vertical.name}\n` +
                `Risk Score: ${riskScore}/10 (${vertical.riskTier})\n` +
                `Relevant Patents: ${vertical.patentCount}\n` +
                `Settlement Range: ${vertical.settlementRange}\n\n` +
                `💰 STRONG RECOMMENDATION: Purchase Brolli License\n` +
                `Cost: $${licensePrice}/year\n` +
                `ROI: ${roiLow}x-${roiHigh}x vs. potential litigation\n\n` +
                `Notable patents in this space:\n` +
                vertical.notablePatents.map((p: string) => `• ${p}`).join('\n') +
                `\n\nReady to purchase? I can walk you through the checkout.`,
          action: "RECOMMEND_LICENSE_IMMEDIATE",
          data: { vertical: bestMatch.vertical, riskScore, recommendation: vertical.recommendation }
        };
      } else if (riskScore >= 7.0) {
        return {
          text: `⚠️ HIGH PATENT RISK\n\n` +
                `Vertical: ${vertical.name}\n` +
                `Risk Score: ${riskScore}/10 (${vertical.riskTier})\n` +
                `Relevant Patents: ${vertical.patentCount}\n` +
                `Settlement Range: ${vertical.settlementRange}\n\n` +
                `💡 RECOMMENDATION: Purchase Brolli License\n` +
                `Cost: $${licensePrice}/year | ROI: ${roiLow}x-${roiHigh}x\n\n` +
                `This is a cost-effective way to reduce tail risk before fundraising or mainnet launch.`,
          action: "RECOMMEND_LICENSE",
          data: { vertical: bestMatch.vertical, riskScore, recommendation: vertical.recommendation }
        };
      } else if (riskScore >= 5.0) {
        return {
          text: `⚠️ MODERATE PATENT RISK\n\n` +
                `Vertical: ${vertical.name}\n` +
                `Risk Score: ${riskScore}/10 (${vertical.riskTier})\n` +
                `Settlement Range: ${vertical.settlementRange}\n\n` +
                `Consider: Brolli license for added protection ($${licensePrice}/year)\n` +
                `Many teams buy it for investor diligence even at moderate risk levels.`,
          action: "CONSIDER_LICENSE",
          data: { vertical: bestMatch.vertical, riskScore, recommendation: vertical.recommendation }
        };
      } else {
        return {
          text: `✅ LOW PATENT RISK\n\n` +
                `Vertical: ${vertical.name}\n` +
                `Risk Score: ${riskScore}/10 (${vertical.riskTier})\n\n` +
                `Your project has minimal patent exposure in this area. License is optional.`,
          action: "LOW_RISK",
          data: { vertical: bestMatch.vertical, riskScore, recommendation: vertical.recommendation }
        };
      }
    } catch (error) {
      console.error('Patent coverage check error:', error);
      return {
        text: "Error assessing patent risk. Let me help you manually - what type of project are you building?",
        action: "ERROR"
      };
    }
  },
  
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "We're building a stablecoin payment platform" }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Let me check the patent risk for stablecoin platforms...",
          action: "CHECK_PATENT_COVERAGE"
        }
      }
    ]
  ]
};

