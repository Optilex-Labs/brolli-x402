import faqJson from "../characters/brolli-sales-faq.json";

export interface SalesFaqTopic {
  id: string;
  title: string;
  keywords: string[];
  answer: string;
}

export interface SalesFaqLibrary {
  version: number;
  defaults: {
    disclaimer: string;
    noLinksPolicy: string;
  };
  topics: SalesFaqTopic[];
}

export const brolliSalesFaq = faqJson as SalesFaqLibrary;

export function getAllowedTopicIds() {
  return brolliSalesFaq.topics.map(t => t.id);
}

export function getTopicById(topicId: string) {
  return brolliSalesFaq.topics.find(t => t.id === topicId) || brolliSalesFaq.topics.find(t => t.id === "unknown");
}

export function classifyTopicByKeywords(userText: string) {
  const text = userText.toLowerCase();
  let best: { id: string; score: number } = { id: "unknown", score: 0 };

  for (const topic of brolliSalesFaq.topics) {
    if (!topic.keywords?.length) continue;
    let score = 0;
    for (const kw of topic.keywords) {
      const needle = kw.toLowerCase().trim();
      if (!needle) continue;
      if (text.includes(needle)) score += Math.max(2, Math.min(needle.length / 6, 6));
    }
    if (score > best.score) best = { id: topic.id, score };
  }

  // Require a minimal signal; otherwise unknown.
  return best.score >= 2 ? best.id : "unknown";
}


