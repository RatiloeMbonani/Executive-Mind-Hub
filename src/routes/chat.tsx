import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/PageHeader";
import { chatAssistant } from "@/lib/ai.functions";
import { Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "@/components/Markdown";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chatbot · ExecutiveMind" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const fn = useServerFn(chatAssistant);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm ExecutiveMind. Ask me to draft, summarize, plan, or research anything. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await fn({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: r.content }]);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <>
      <PageHeader emoji="💬" title="Workplace Chatbot" subtitle="Your always-on AI assistant for tasks, ideas, and quick answers." />
      <div className="bg-card border border-border rounded-2xl flex flex-col h-[70vh] overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-hero)" }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                {m.role === "assistant" ? <Markdown content={m.content} /> : m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--gradient-hero)" }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="border-t border-border p-3 flex gap-2 bg-background/50"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message ExecutiveMind…"
            className="flex-1 rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 hover:opacity-90 disabled:opacity-50 transition"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
