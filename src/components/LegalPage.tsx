import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container-px mx-auto max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Legal</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-ink">{title}</h1>
        {updated && <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>}
        <div className="prose prose-slate mt-10 max-w-none text-ink/85 leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-ink [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1.5">
          {children}
        </div>
      </div>
    </section>
  );
}
