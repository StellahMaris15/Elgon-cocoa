import { cn } from "@/lib/utils";

export const AdminCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("neo-surface p-6", className)}>{children}</div>
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
  "w-full h-11 px-4 rounded-xl border border-white/70 bg-background text-sm text-foreground focus:outline-none";

export const Labeled = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <label className="block">
    <span className="btn-label text-[11px] text-primary block mb-2">{label}</span>
    {children}
    {hint && <span className="text-xs text-muted-foreground mt-1 block">{hint}</span>}
  </label>
);

export const primaryBtn =
  "neo-button btn-label text-[11px] inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground hover:bg-secondary disabled:opacity-60";

export const ghostBtn =
  "neo-button btn-label text-[11px] inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground hover:text-primary";
