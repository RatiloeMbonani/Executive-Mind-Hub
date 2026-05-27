import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Mail, FileText, Search, MessageSquare, TrendingUp, Zap, Clock, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · ExecutiveMind" },
      { name: "description", content: "Your AI productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Hours Saved / Week", value: "12.4", icon: Clock, delta: "+23%" },
  { label: "Tasks Automated", value: "248", icon: Zap, delta: "+18%" },
  { label: "Productivity Score", value: "94", icon: TrendingUp, delta: "+7 pts" },
  { label: "AI Interactions", value: "1.2k", icon: Sparkles, delta: "+41%" },
];

const tools = [
  { to: "/email", emoji: "✉️", icon: Mail, title: "Email Generator", desc: "Draft polished emails in seconds with tone & audience control." },
  { to: "/notes", emoji: "📝", icon: FileText, title: "Notes Summarizer", desc: "Turn long transcripts into crisp summaries with action items." },
  { to: "/research", emoji: "🔍", icon: Search, title: "Research Assistant", desc: "TL;DR bullets or full executive briefs on any topic." },
  { to: "/chat", emoji: "💬", icon: MessageSquare, title: "AI Chatbot", desc: "Your always-on workplace assistant." },
] as const;

function Dashboard() {
  return (
    <>
      <div
        className="rounded-2xl p-8 md:p-10 mb-10 text-white relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1 rounded-full mb-4">
            <Sparkles className="h-3 w-3" /> WELCOME BACK
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Run your workday at executive speed.</h2>
          <p className="text-white/85 max-w-2xl">
            ExecutiveMind automates the repetitive 80% — drafting, summarizing, researching, and conversing — so you focus on decisions that move the needle.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-5 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold text-cyan-foreground bg-cyan/30 px-2 py-0.5 rounded-full">{s.delta}</span>
            </div>
            <div className="font-display text-2xl md:text-3xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <h3 className="font-display text-xl font-bold mb-4">Quick start</h3>
      <section className="grid md:grid-cols-2 gap-4">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group bg-card rounded-xl p-6 border border-border hover:border-primary transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl bg-accent">
                {t.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-lg group-hover:text-primary transition-colors">{t.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
