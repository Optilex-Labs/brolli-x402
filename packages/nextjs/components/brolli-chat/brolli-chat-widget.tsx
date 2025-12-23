"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ChatBubble({ role, content }: Message) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
          isUser ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export function BrolliChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "AI assistant. Not legal advice.\n\nWhat are you building—solo or team?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  async function send() {
    const text = input.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setInput("");

    const nextMessages = [...messages, { role: "user", content: text } as const];
    setMessages(nextMessages);

    try {
      const res = await fetch("/api/brolli/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          userMessage: text,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Chat error (${res.status})`);
      }

      const body = (await res.json()) as { response?: string };
      setMessages(prev => [...prev, { role: "assistant", content: body.response || "Sorry—try again." }]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: e instanceof Error ? e.message : "Sorry—try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        className="btn btn-primary btn-circle fixed bottom-5 right-5 shadow-xl z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        onClick={() => setIsOpen(v => !v)}
      >
        {isOpen ? "×" : "?"}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[min(360px,calc(100vw-40px))] z-50">
          <div className="card bg-base-100 shadow-2xl border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="font-semibold">Brolli Chat</div>
                <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsOpen(false)}>
                  Close
                </button>
              </div>

              <div className="text-xs text-base-content/60 mb-3">AI assistant. Not legal advice.</div>

              <div className="h-72 overflow-y-auto space-y-3 bg-base-200 rounded-xl p-3">
                {messages.map((m, idx) => (
                  <ChatBubble key={idx} role={m.role} content={m.content} />
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-base-100 rounded-2xl px-3 py-2 text-sm">
                      <span className="loading loading-dots loading-sm" />
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  className="input input-bordered w-full"
                  value={input}
                  placeholder="Ask a question…"
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") send();
                  }}
                  disabled={isSending}
                />
                <button type="button" className="btn btn-primary" onClick={send} disabled={!canSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


