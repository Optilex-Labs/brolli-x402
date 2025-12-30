import { NextResponse } from "next/server";
import riskGraph from "@/data/patent-risk-graph.json";

export async function POST(req: Request) {
  try {
    const { vertical, useCases, description } = await req.json();
    
    // Validate vertical exists
    const verticalData = riskGraph.verticals[vertical as keyof typeof riskGraph.verticals];
    if (!verticalData) {
      return NextResponse.json(
        { error: "Invalid vertical. Available: payments, lending, dex, nft, rwa" },
        { status: 400 }
      );
    }
    
    // Match use cases
    const matchedUseCases = useCases
      .map((uc: string) => verticalData.useCases[uc as keyof typeof verticalData.useCases])
      .filter(Boolean);
    
    if (matchedUseCases.length === 0) {
      return NextResponse.json(
        { error: "No matching use cases found. Please check available use cases for this vertical." },
        { status: 400 }
      );
    }
    
    // Calculate aggregate risk score
    const avgRiskScore =
      matchedUseCases.reduce((sum: number, uc: any) => sum + uc.riskScore, 0) / matchedUseCases.length;
    
    // Determine recommendation
    let recommendation = "CONSIDER";
    if (avgRiskScore >= 9.0) recommendation = "CRITICAL_PURCHASE";
    else if (avgRiskScore >= 7.0) recommendation = "PURCHASE_RECOMMENDED";
    else if (avgRiskScore >= 5.0) recommendation = "PURCHASE_ADVISED";
    
    return NextResponse.json({
      vertical: verticalData.name,
      riskTier: verticalData.riskTier,
      riskScore: Number(avgRiskScore.toFixed(1)),
      totalPatents: verticalData.patentCount,
      matchedUseCases,
      recommendation,
      justification: `Your use case (${matchedUseCases.map((uc: any) => uc.name).join(", ")}) falls within ${verticalData.name} vertical with ${verticalData.patentCount} active patents. Risk tier: ${verticalData.riskTier}.`,
      settlementRange: riskGraph.settlementData.averageRange,
      licensePrice: "$99/year",
      roi: `Potential savings: ${riskGraph.settlementData.averageRange} vs. $99 license = 1,010x-5,050x ROI`,
      disclaimer: riskGraph.disclaimer,
    });
  } catch (error) {
    console.error("Risk assessment error:", error);
    return NextResponse.json(
      { error: "Failed to assess risk. Please check your request format." },
      { status: 500 }
    );
  }
}

// Allow GET requests to show available verticals
export async function GET() {
  return NextResponse.json({
    version: riskGraph.version,
    lastUpdated: riskGraph.lastUpdated,
    availableVerticals: Object.keys(riskGraph.verticals).map(key => {
      const vertical = riskGraph.verticals[key as keyof typeof riskGraph.verticals];
      return {
        id: key,
        name: vertical.name,
        riskTier: vertical.riskTier,
        patentCount: vertical.patentCount,
        description: vertical.description,
        useCases: Object.keys(vertical.useCases),
      };
    }),
    disclaimer: riskGraph.disclaimer,
  });
}

