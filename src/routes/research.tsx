import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/PageHeader";
import { researchAssistant } from "@/lib/ai.functions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "@/components/Markdown";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant · ExecutiveMind" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchAssistant);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"tldr" | "executive">("tldr");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function go() {
    if (input.trim().length < 3) return toast.error("Enter a topic, URL, or text to research.");
    setLoading(true); setResult("");
    try {
      const r = await fn({ data: { input, mode } });
      setResult(r.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <>
      <PageHeader emoji="🔍" title="Research Assistant" subtitle="Get TL;DR bullets or a full executive brief on any topic, article, or URL." />
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Topic, URL, or content</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="e.g. https://example.com/article  —or—  Impact of generative AI on knowledge work"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </label>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="inline-flex p-1 rounded-lg bg-muted">
            {[
              { id: "tldr", label: "TL;DR Bullet Points" },
              { id: "executive", label: "Executive Brief" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition ${mode === m.id ? "bg-card shadow text-primary" : "text-muted-foreground"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            onClick={go}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold px-6 py-2.5 hover:opacity-90 transition disabled:opacity-60"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Researching…" : "Research"}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 min-h-[300px]" style={{ boxShadow: "var(--shadow-card)" }}>
        {result ? <Markdown content={result} /> : (
          <div className="h-full min-h-[200px] flex items-center justify-center text-sm text-muted-foreground">Insights will appear here.</div>
        )}
      </div>
    </>
  );
}
