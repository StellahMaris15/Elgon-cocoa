import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BellRing,
  Inbox,
  ArrowRight,
  Plus,
  Settings,
  PackageCheck,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeading } from "./ui";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--muted-foreground))",
];

const weekLabel = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

const AdminOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const [products, farmers, inquiries] = await Promise.all([
        supabase.from("products").select("id, category, published"),
        supabase.from("farmers").select("id, district, published"),
        supabase.from("inquiries").select("id, status, created_at").order("created_at", { ascending: false }),
      ]);
      if (products.error) throw products.error;
      if (farmers.error) throw farmers.error;
      if (inquiries.error) throw inquiries.error;
      return {
        products: products.data ?? [],
        farmers: farmers.data ?? [],
        inquiries: inquiries.data ?? [],
      };
    },
    staleTime: 30_000,
  });

  const products = data?.products ?? [];
  const farmers = data?.farmers ?? [];
  const inquiries = data?.inquiries ?? [];

  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const stats = [
    {
      label: "Products",
      value: products.length,
      sub: `${products.filter((p) => p.published).length} published`,
      to: "/admin/products",
      icon: PackageCheck,
    },
    {
      label: "Farmer profiles",
      value: farmers.length,
      sub: `${farmers.filter((f) => f.published).length} live on site`,
      to: "/admin/farmers",
      icon: UsersRound,
    },
    {
      label: "Total inquiries",
      value: inquiries.length,
      sub: "all time",
      to: "/admin/inquiries",
      icon: Inbox,
    },
    {
      label: "Needs reply",
      value: newInquiries,
      sub: "marked as new",
      to: "/admin/inquiries",
      icon: BellRing,
    },
  ];

  // Inquiries per week, last 8 weeks
  const now = new Date();
  const trend = Array.from({ length: 8 }).map((_, idx) => {
    const start = new Date(now);
    start.setDate(start.getDate() - (7 - idx) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return {
      week: weekLabel(start),
      inquiries: inquiries.filter((i) => {
        const t = new Date(i.created_at as string);
        return t >= start && t < end;
      }).length,
    };
  });

  const statusData = Object.entries(
    inquiries.reduce<Record<string, number>>((acc, i) => {
      const key = (i.status as string) || "new";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const categoryData = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      const key = (p.category as string) || "other";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, products: value }));

  const districtData = Object.entries(
    farmers.reduce<Record<string, number>>((acc, f) => {
      const key = (f.district as string) || "Unassigned";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, farmers: value }));

  return (
    <>
      <AdminHeading
        title="Overview"
        subtitle="Live snapshot of everything published on the cooperative website."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="block">
            <AdminCard className="h-full hover:border-primary transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-heading font-bold text-3xl text-primary mt-2">
                    {isLoading ? "..." : s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
                <span className="w-10 h-10 rounded-md bg-accent/15 text-accent grid place-items-center">
                  <s.icon className="w-5 h-5" aria-hidden />
                </span>
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 mt-4 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <h2 className="font-heading font-semibold text-lg text-primary mb-1">Inquiry volume</h2>
          <p className="text-xs text-muted-foreground mb-4">Buyer inquiries received per week (last 8 weeks)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="inq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="inquiries" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#inq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading font-semibold text-lg text-primary mb-1">Inquiry status</h2>
          <p className="text-xs text-muted-foreground mb-4">Where each request stands</p>
          <div className="h-64">
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inquiries yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading font-semibold text-lg text-primary mb-1">Catalog by crop</h2>
          <p className="text-xs text-muted-foreground mb-4">Products per category</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: -24, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="products" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <h2 className="font-heading font-semibold text-lg text-primary mb-1">Farmers by district</h2>
          <p className="text-xs text-muted-foreground mb-4">Published and draft profiles</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ left: -24, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="farmers" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-4 mt-4 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <h2 className="font-heading font-semibold text-lg text-primary mb-3">Latest inquiries</h2>
          {inquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing has come in yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {inquiries.slice(0, 5).map((i) => (
                <li key={i.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-foreground/80">
                    {new Date(i.created_at as string).toLocaleString()}
                  </span>
                  <span className="btn-label text-[10px] px-2.5 py-1 rounded-full bg-muted text-primary">
                    {String(i.status ?? "new")}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/inquiries" className="btn-label text-[11px] text-primary inline-flex items-center gap-2 hover:text-accent mt-4">
            Open inquiries <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </AdminCard>

        <AdminCard>
          <h2 className="font-heading font-semibold text-lg text-primary mb-3 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-accent" aria-hidden /> Quick actions
          </h2>
          <div className="space-y-2">
            {[
              { to: "/admin/products", label: "Add or edit a product", icon: Plus },
              { to: "/admin/farmers", label: "Publish a farmer profile", icon: UsersRound },
              { to: "/admin/settings", label: "Notification recipients", icon: Settings },
              { to: "/", label: "Preview the live website", icon: ArrowRight },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <a.icon className="w-4 h-4 text-accent" aria-hidden /> {a.label}
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </>
  );
};

export default AdminOverview;
