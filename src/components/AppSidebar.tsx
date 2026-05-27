import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Mail, FileText, Search, MessageSquare, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: BarChart3, emoji: "📊" },
  { to: "/email", label: "Email Generator", icon: Mail, emoji: "✉️" },
  { to: "/notes", label: "Notes Summarizer", icon: FileText, emoji: "📝" },
  { to: "/research", label: "Research Assistant", icon: Search, emoji: "🔍" },
  { to: "/chat", label: "Chatbot", icon: MessageSquare, emoji: "💬" },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside
      className="hidden md:flex w-64 shrink-0 flex-col text-sidebar-foreground"
      style={{ background: "var(--gradient-sidebar)" }}
    >
      <div className="px-6 py-6 flex items-center gap-2 border-b border-white/10">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-display text-lg font-bold leading-none">ExecutiveMind</div>
          <div className="text-[11px] text-white/60 mt-1">AI Productivity Hub</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-white text-foreground shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              <span>{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 m-3 rounded-xl bg-white/5 border border-white/10">
        <div className="text-xs text-white/60">Powered by</div>
        <div className="text-sm font-semibold text-white">Lovable AI · Gemini</div>
      </div>
    </aside>
  );
}
