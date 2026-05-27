import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/PageHeader";
import { generateEmail } from "@/lib/ai.functions";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator · ExecutiveMind" }] }),
  component: EmailPage,
});

const tones = ["Formal", "Informal", "Persuasive", "Friendly", "Apologetic"] as const;
const audiences = ["Client", "Manager", "Team", "Vendor", "Investor"] as const;

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [tone, setTone] = useState<(typeof tones)[number]>("Formal");
  const [audience, setAudience] = useState<(typeof audiences)[number]>("Client");
  const [subjectHint, setSubjectHint] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  async function onGenerate() {
    if (message.trim().length < 3) return toast.error("Add a bit more context.");
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { tone, audience, message, subjectHint: subjectHint || undefined } });
      setResult(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <PageHeader emoji="✉️" title="Email Generator" subtitle="Draft professional emails tailored to your tone and audience." />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tone">
              <Select value={tone} onChange={(v) => setTone(v as any)} options={tones as any} />
            </Field>
            <Field label="Audience">
              <Select value={audience} onChange={(v) => setAudience(v as any)} options={audiences as any} />
            </Field>
          </div>
          <Field label="Subject hint (optional)">
            <input
              value={subjectHint}
              onChange={(e) => setSubjectHint(e.target.value)}
              placeholder="e.g. Project Atlas — status update"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
          <Field label="Core message">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              placeholder="Briefly describe what the email should say…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </Field>
          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold py-3 hover:opacity-90 transition disabled:opacity-60"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Generating…" : "Generate Email"}
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 min-h-[400px] flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold">Result</h3>
            {result && (
              <button onClick={copy} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          {result ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed flex-1">{result}</pre>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground text-center px-6">
              Your generated email will appear here.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
