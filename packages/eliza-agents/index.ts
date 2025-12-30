import salesAgentCharacterJson from "./characters/brolli-sales-agent.json";
import { buildSalesSystemPrompt } from "./src/prompt";
import type { SalesAgentCharacter } from "./src/types";
export * from "./src/faq";
export * from "./src/actions/checkPatentCoverage";

export const brolliSalesAgentCharacter = salesAgentCharacterJson as SalesAgentCharacter;

export function getBrolliSalesSystemPrompt() {
  return buildSalesSystemPrompt(brolliSalesAgentCharacter);
}

export type { SalesAgentCharacter };


