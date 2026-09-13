import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Inbox,
  ArrowRight,
  Plus,
  Settings,
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
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AdminCard } from "./ui";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--muted-foreground))",
];

const weekLabel = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

const AdminOverview = () => {
  const { user } = useAuth();
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
    },
    {
      label: "Farmer profiles",
      value: farmers.length,
      sub: `${farmers.filter((f) => f.published).length} live on site`,
      to: "/admin/farmers",
    },
    {
      label: "Total inquiries",
      value: inquiries.length,
      sub: "all time",
      to: "/admin/inquiries",
    },
    {
      label: "Needs reply",
      value: newInquiries,
      sub: "marked as new",
      to: "/admin/inquiries",
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

  const recentActivity = inquiries.slice(0, 4).map((inquiry) => ({
    id: inquiry.id,
    title: `Inquiry marked ${String(inquiry.status ?? "new")}`,
    detail: new Date(inquiry.created_at as string).toLocaleString(),
    icon: Inbox,
  }));

  const topItems = [
    ...products.slice(0, 3).map((item) => ({
      id: `product-${item.id}`,
      name: "Product entry",
      category: String(item.category ?? "Product"),
      status: item.published ? "Published" : "Draft",
      to: "/admin/products",
    })),
    ...farmers.slice(0, 3).map((item) => ({
      id: `farmer-${item.id}`,
      name: "Farmer profile",
      category: String(item.district ?? "Farmer"),
      status: item.published ? "Published" : "Draft",
      to: "/admin/farmers",
    })),
  ].slice(0, 5);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">
            Welcome back, Admin!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here is what is happening across Elgon Cooperative today.
          </p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-white px-4 py-3 text-right shadow-[0_12px_30px_hsl(var(--clay-shadow-outer)/0.10)]">
          <p className="text-[11px] text-muted-foreground">Signed in as</p>
          <p className="text-sm font-semibold text-primary">{user?.email ?? "Admin"}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, index) => (
          <Link key={s.label} to={s.to} className="block">
            <AdminCard
              className={
                index === 0
                  ? "h-full min-h-24 border-primary/30 bg-[#f8faf6] p-4 shadow-[8px_8px_20px_hsl(var(--clay-shadow-outer)/0.16),-8px_-8px_20px_hsl(0_0%_100%/0.95)]"
                  : "h-full min-h-24 bg-[#f8faf6] p-4 shadow-[8px_8px_20px_hsl(var(--clay-shadow-outer)/0.13),-8px_-8px_20px_hsl(0_0%_100%/0.95)] transition-all hover:-translate-y-0.5 hover:border-primary/30"
              }
            >
              <p className="text-sm font-medium text-foreground">{s.label}</p>
              <p className="mt-1 font-heading text-3xl font-bold leading-none text-primary">
                {isLoading ? "..." : s.value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-semibold text-primary">Inquiry volume</h2>
              <p className="mt-1 text-xs text-muted-foreground">Buyer inquiries received per week</p>
            </div>
            <span className="rounded-xl border border-primary/10 bg-[#f8faf6] px-3 py-2 text-xs font-semibold text-primary">Last 8 weeks</span>
          </div>
          <div className="h-72">
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
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="inquiries" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#inq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-primary">Recent activity</h2>
            <Link to="/admin/inquiries" className="text-xs font-semibold text-primary hover:text-accent">View all</Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-[#f8faf6] p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
                    <activity.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{activity.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="mb-1 font-heading text-xl font-semibold text-primary">Inquiry status</h2>
          <p className="mb-4 text-xs text-muted-foreground">Where each request stands</p>
          <div className="h-56">
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inquiries yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <h2 className="mb-1 font-heading text-xl font-semibold text-primary">Catalog by crop</h2>
          <p className="mb-4 text-xs text-muted-foreground">Products per category</p>
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
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="products" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-3">
          <h2 className="mb-1 font-heading text-xl font-semibold text-primary">Farmers by district</h2>
          <p className="mb-4 text-xs text-muted-foreground">Published and draft profiles</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={districtData} margin={{ left: -24, right: 8, top: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="farmers"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "hsl(var(--accent))", stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "hsl(var(--primary))", stroke: "hsl(var(--accent))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-primary">Top items</h2>
            <Link to="/admin/products" className="text-xs font-semibold text-primary hover:text-accent">View all</Link>
          </div>
          {topItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content items yet.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-primary/10">
              <table className="w-full text-sm">
                <thead className="bg-[#f8faf6] text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {topItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-semibold text-foreground">{item.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-tertiary px-3 py-1 text-xs font-semibold text-primary">{item.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={item.to} className="inline-flex text-primary hover:text-accent">
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-semibold text-primary">
            <BadgeCheck className="h-4 w-4 text-accent" aria-hidden /> Quick actions
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
                className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-[#f8faf6] px-3 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <a.icon className="h-4 w-4" aria-hidden />
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </>
  );
};

export default AdminOverview;
