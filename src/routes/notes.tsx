import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/PageHeader";
import { summarizeNotes } from "@/lib/ai.functions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "@/components/Markdown";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Notes Summarizer · ExecutiveMind" }] }),
  component: NotesPage,
});

function NotesPage() {
  const fn = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [includeDeadlines, setIncludeDeadlines] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function go() {
    if (notes.trim().length < 10) return toast.error("Paste your meeting notes first.");
    setLoading(true);
    setResult("");
    try {
      const r = await fn({ data: { notes, includeDeadlines } });
      setResult(r.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader emoji="📝" title="Notes Summarizer" subtitle="Paste a transcript or raw meeting notes — get a structured summary with key points, decisions, and action items." />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Transcript / Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={16}
              placeholder="Paste meeting notes, transcript, or raw text…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => setIncludeDeadlines((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition ${includeDeadlines ? "bg-cyan" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${includeDeadlines ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm font-medium">Include Deadlines & Responsibilities</span>
          </label>
          <button
            onClick={go}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold py-3 hover:opacity-90 transition disabled:opacity-60"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Summarizing…" : "Summarize Notes"}
          </button>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 min-h-[400px]" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-display font-bold mb-3">Summary</h3>
          {result ? <Markdown content={result} /> : (
            <div className="h-full min-h-[300px] flex items-center justify-center text-sm text-muted-foreground">Your summary will appear here.</div>
          )}
        </div>
      </div>
    </>
  );
}
