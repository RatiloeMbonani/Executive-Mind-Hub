import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  { to: "/", emoji: "📊", label: "Home" },
  { to: "/email", emoji: "✉️", label: "Email" },
  { to: "/notes", emoji: "📝", label: "Notes" },
  { to: "/research", emoji: "🔍", label: "Research" },
  { to: "/chat", emoji: "💬", label: "Chat" },
] as const;

export function MobileNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-sidebar text-sidebar-foreground border-t border-white/10 flex">
      {items.map((i) => {
        const active = pathname === i.to;
        return (
          <Link key={i.to} to={i.to} className={`flex-1 flex flex-col items-center py-2 text-[10px] ${active ? "text-cyan" : "text-white/70"}`}>
            <span className="text-lg">{i.emoji}</span>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
