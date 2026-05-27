import type { ReactNode } from "react";

export function PageHeader({ emoji, title, subtitle, action }: { emoji: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
