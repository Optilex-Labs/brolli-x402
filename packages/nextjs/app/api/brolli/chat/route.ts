import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  classifyTopicByKeywords,
  getBrolliSalesSystemPrompt,
  getTopicById,
} from "@brolli/eliza-agents";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface PatentSnippetsFile {
  patentId: string;
  snippets: Array<{
    snippetId: string;
    pageOrSection: string;
    text: string;
  }>;
}

function readPatentSnippets(): PatentSnippetsFile {
  const snippetsPath = path.join(process.cwd(), "..", "..", "patent", "US12095919B2.snippets.json");
  const raw = fs.readFileSync(snippetsPath, "utf8");
  return JSON.parse(raw) as PatentSnippetsFile;
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map(t => t.trim())
    .filter(t => t.length >= 4)
    .slice(0, 64);
}

function scoreSnippet(queryTokens: string[], snippetText: string) {
  const hay = snippetText.toLowerCase();
  let score = 0;
  for (const t of queryTokens) {
    if (hay.includes(t)) score += Math.min(6, Math.max(1, Math.floor(t.length / 3)));
  }
  return score;
}

function selectRelevantSnippets(userMessage: string, maxSnippets: number) {
  const library = readPatentSnippets();
  const tokens = tokenize(userMessage);

  const scored = library.snippets
    .map(s => ({
      snippetId: s.snippetId,
      pageOrSection: s.pageOrSection,
      text: s.text,
      score: scoreSnippet(tokens, s.text),
    }))
    .sort((a, b) => b.score - a.score);

  const picked = scored.filter(s => s.score > 0).slice(0, maxSnippets);
  if (picked.length > 0) return picked;

  // Fallback: include abstract + claim excerpt if nothing matches
  const fallbackIds = new Set(["abs-001", "abs-002", "abs-003", "claim1-001"]);
  return scored.filter(s => fallbackIds.has(s.snippetId)).slice(0, maxSnippets);
}

async function callOpenAI(params: {
  system: string;
  messages: ChatMessage[];
  userMessage: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const merged: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: params.system },
    ...params.messages.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: params.userMessage },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: merged,
      temperature: 0.3,
      max_tokens: 320,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI error (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as any;
  return (data?.choices?.[0]?.message?.content as string | undefined) || "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      messages?: ChatMessage[];
      userMessage?: string;
    };

    const userMessage = body.userMessage?.trim();
    if (!userMessage) return NextResponse.json({ error: "Missing userMessage" }, { status: 400 });

    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

    const baseSystem = getBrolliSalesSystemPrompt();

    const topicId = classifyTopicByKeywords(userMessage);
    const topic = getTopicById(topicId);
    const snippets = selectRelevantSnippets(userMessage, 5);

    const system = [
      baseSystem,
      "",
      "Disclosure (keep it short): AI assistant. Not legal advice.",
      "",
      "Response rules:",
      "- Keep answers short and practical (aim 3-8 sentences).",
      "- No URLs or external links.",
      "- If the question matches an approved FAQ topic, prefer that answer.",
      "- If you reference the patent, cite snippetIds like [abs-001].",
      "",
      `Approved FAQ topic: ${topic?.id || "unknown"} — ${topic?.title || "Unknown"}`,
      topic?.answer ? `Approved answer:\n${topic.answer}` : "",
      "",
      "Canonical patent snippets (cite by snippetId):",
      ...snippets.map(s => `[${s.snippetId}] (${s.pageOrSection}) ${s.text}`),
    ]
      .filter(Boolean)
      .join("\n");

    const response = await callOpenAI({ system, messages, userMessage });
    const finalResponse = response?.trim() || "I’m not sure—can you clarify what you’re trying to decide?";

    return NextResponse.json({ response: finalResponse });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


