import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function looksLikeLink(text) {
  return /(https?:\/\/|www\.)/i.test(text) || /\b[a-z0-9-]+\.(com|io|org|net|ai|xyz|dev|app)\b/i.test(text);
}

function classifyByKeywords(library, userText) {
  const text = userText.toLowerCase();
  let best = { id: "unknown", score: 0 };
  for (const topic of library.topics) {
    if (!Array.isArray(topic.keywords) || topic.keywords.length === 0) continue;
    let score = 0;
    for (const kw of topic.keywords) {
      const needle = String(kw || "").toLowerCase().trim();
      if (!needle) continue;
      if (text.includes(needle)) score += Math.max(2, Math.min(needle.length / 6, 6));
    }
    if (score > best.score) best = { id: topic.id, score };
  }
  return best.score >= 2 ? best.id : "unknown";
}

const faqPath = path.join(process.cwd(), "characters", "brolli-sales-faq.json");
const library = readJson(faqPath);

// 1) No URLs in any prewritten answer
for (const topic of library.topics) {
  if (looksLikeLink(topic.answer)) {
    console.error(`❌ Topic "${topic.id}" contains a link-like string. Remove all URLs/domains.`);
    process.exit(1);
  }
}

// 2) Routing fixtures (keyword-based) — sanity check
const fixtures = [
  { q: "What is an example of dirty IP enforcement in real life?", want: "real_world_example" },
  { q: "Should I file for patent protection right away?", want: "patent_strategy" },
  { q: "Can you patent a business process?", want: "business_process_patents" },
  { q: "What do I get when I buy?", want: "what_is_brolli" },
  { q: "Can I buy for my team?", want: "team_purchase" },
];

for (const f of fixtures) {
  const got = classifyByKeywords(library, f.q);
  if (got !== f.want) {
    console.error(`❌ Routing fixture failed.\nQ: ${f.q}\nExpected: ${f.want}\nGot: ${got}`);
    process.exit(1);
  }
}

console.log("✅ Sales agent validation passed (no links, routing fixtures ok).");


