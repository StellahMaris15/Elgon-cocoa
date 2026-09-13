import { cn } from "@/lib/utils";

export const AdminCard = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => (
  <div
    id={id}
    className={cn(
      "rounded-2xl border border-primary/10 bg-white p-6 shadow-[0_18px_45px_hsl(var(--clay-shadow-outer)/0.10)]",
      className,
    )}
  >
    {children}
  </div>
);

export const AdminHeading = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <p className="eyebrow mb-2">Admin dashboard</p>
      <h1 className="font-heading text-3xl font-bold leading-tight text-primary">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const inputCls =
  "w-full h-11 px-4 rounded-xl border border-primary/10 bg-white text-sm text-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.8),0_10px_30px_hsl(var(--clay-shadow-outer)/0.08)] focus:outline-none";

export const Labeled = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <label className="block">
    <span className="btn-label text-[11px] text-primary block mb-2">{label}</span>
    {children}
    {hint && <span className="text-xs text-muted-foreground mt-1 block">{hint}</span>}
  </label>
);

export const primaryBtn =
  "btn-label text-[11px] inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary px-5 py-3 text-primary-foreground shadow-[0_14px_28px_hsl(var(--primary)/0.24)] transition-all hover:-translate-y-0.5 hover:bg-secondary disabled:opacity-60";

export const ghostBtn =
  "btn-label text-[11px] inline-flex items-center gap-2 rounded-2xl border border-primary/10 bg-white px-4 py-2.5 text-foreground shadow-[0_10px_24px_hsl(var(--clay-shadow-outer)/0.10)] transition-all hover:-translate-y-0.5 hover:text-primary";
