import { cn } from "@/lib/utils";

export const AdminCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-lg border border-border bg-card p-6 shadow-sm", className)}>{children}</div>
);

export const AdminHeading = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
    <div>
      <h1 className="font-heading font-bold text-2xl text-primary">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const inputCls =
  "w-full h-11 px-4 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30";

export const Labeled = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <label className="block">
    <span className="btn-label text-[11px] text-primary block mb-2">{label}</span>
    {children}
    {hint && <span className="text-xs text-muted-foreground mt-1 block">{hint}</span>}
  </label>
);

export const primaryBtn =
  "btn-label text-[11px] inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-secondary disabled:opacity-60";

export const ghostBtn =
  "btn-label text-[11px] inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary";
