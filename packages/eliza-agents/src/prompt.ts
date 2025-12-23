import type { SalesAgentCharacter } from "./types";

function formatBullets(lines: string[]) {
  return lines.map(line => `- ${line}`).join("\n");
}

export function buildSalesSystemPrompt(character: SalesAgentCharacter) {
  const program = character.program;
  const links = character.canonicalLinks;
  const positioning = character.positioning;

  return [
    `You are ${character.name}.`,
    "",
    `Product: ${character.productName}`,
    `Tagline: ${character.tagline}`,
    "",
    "Elevator pitch:",
    formatBullets(character.elevatorPitch),
    "",
    "Promotion and constraints:",
    formatBullets([
      program.promotionName,
      `List price: $${program.listPriceUsd} USD`,
      `Max licenses: ${program.maxLicenses}`,
      program.onePerWallet ? "One license per wallet (enforced onchain)." : "Multiple per wallet (not enforced).",
      program.teamPurchases,
      program.timing,
    ]),
    "",
    "Payments (be precise about staging):",
    formatBullets(character.acceptsPayments),
    "",
    "Key facts:",
    formatBullets(character.keyFacts),
    "",
    "What it is:",
    formatBullets(character.whatItIs),
    "",
    "What it is NOT:",
    formatBullets(character.whatItIsNot),
    "",
    ...(positioning?.dirtyIp?.length
      ? ["Positioning: dirty IP risk", formatBullets(positioning.dirtyIp), ""]
      : []),
    ...(positioning?.umbrellaProtection?.length
      ? ["Positioning: umbrella protection while you ship", formatBullets(positioning.umbrellaProtection), ""]
      : []),
    ...(positioning?.patentStrategy?.length
      ? ["Positioning: patent strategy vs distraction", formatBullets(positioning.patentStrategy), ""]
      : []),
    ...(positioning?.cautionaryExamples?.length
      ? ["Cautionary examples (keep phrasing safe):", formatBullets(positioning.cautionaryExamples), ""]
      : []),
    ...(links
      ? [
          "Canonical links (when users ask about patents/IP, cite these URLs explicitly):",
          formatBullets(
            [
              links.patentStrategy ? `Patent strategy: ${links.patentStrategy}` : "",
              links.businessProcessPatents ? `Business process patents: ${links.businessProcessPatents}` : "",
              links.blockchainPatentLandscape ? `Blockchain patent landscape: ${links.blockchainPatentLandscape}` : "",
              links.dirtyIp ? `Dirty IP: ${links.dirtyIp}` : "",
              links.deriskingPlaybook ? `Derisking playbook: ${links.deriskingPlaybook}` : "",
              links.ipFaq ? `IP FAQ: ${links.ipFaq}` : "",
            ].filter(Boolean),
          ),
          "",
        ]
      : []),
    "FAQ (prefer these answers; you can adapt wording but keep claims consistent):",
    character.faq.map(item => `Q: ${item.q}\nA: ${item.a}`).join("\n\n"),
    "",
    "Disclaimers (include when discussing legal coverage, risk, enforceability, or if the user asks for legal advice):",
    formatBullets(character.disclaimers),
    "",
    "Style rules:",
    `Tone:\n${formatBullets(character.style.tone)}`,
    `Do:\n${formatBullets(character.style.do)}`,
    `Don't:\n${formatBullets(character.style.dont)}`,
    "",
    "Call-to-action suggestions (use sparingly, not every message):",
    formatBullets(character.cta),
    "",
    "Conversation rules:",
    "- Be concise and technical. Use bullets when listing steps or constraints.",
    "- Ask 1 clarifying question when it materially changes the answer (e.g. team size, target chain, whether they already have wallets).",
    "- Never claim blanket IP protection or guaranteed outcomes.",
    "- If asked for legal advice: refuse and suggest consulting counsel; offer to explain how the product is intended to work.",
    "- If the user asks about patent strategy or business process patents, cite the canonical link(s) above so they have a reference they can share with teammates/investors.",
  ].join("\n");
}


