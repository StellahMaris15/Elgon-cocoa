import { SiteImage } from "@/components/SiteImage";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bell,
  Handshake,
  Inbox,
  LogOut,
  PanelsTopLeft,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Search,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Seo } from "@/components/Seo";
import { logoImage } from "@/data/cropImages";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/admin", end: true, label: "Overview", icon: PanelsTopLeft },
  { to: "/admin/products", label: "Products", icon: PackageCheck },
  { to: "/admin/farmers", label: "Farmers", icon: UsersRound },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings/partners", label: "Partners", icon: Handshake },
  { to: "/admin/settings/leadership", label: "Leadership", icon: ShieldCheck },
];

const SEARCH_ITEMS = [
  ...NAV.map((item) => ({ label: item.label, description: "Open admin section", to: item.to })),
  { label: "Inquiry Settings", description: "Notification recipients and buyer auto replies", to: "/admin/settings/inquiries" },
  { label: "New product", description: "Add or edit cooperative products", to: "/admin/products" },
  { label: "Farmer profiles", description: "Manage published farmer profiles", to: "/admin/farmers" },
  { label: "Partner logos", description: "Manage website partner logos", to: "/admin/settings/partners" },
  { label: "Leadership profiles", description: "Manage leaders shown on the About page", to: "/admin/settings/leadership" },
];

export const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: noticeData } = useQuery({
    queryKey: ["admin", "system-notifications"],
    queryFn: async () => {
      const [newInquiries, draftProducts, draftFarmers] = await Promise.all([
        supabase
          .from("inquiries")
          .select("id, name, email, product_slugs, created_at, source")
          .eq("status", "new")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("published", false),
        supabase.from("farmers").select("id", { count: "exact", head: true }).eq("published", false),
      ]);
      if (newInquiries.error) throw newInquiries.error;
      if (draftProducts.error) throw draftProducts.error;
      if (draftFarmers.error) throw draftFarmers.error;
      return {
        inquiries: newInquiries.data ?? [],
        draftProducts: draftProducts.count ?? 0,
        draftFarmers: draftFarmers.count ?? 0,
      };
    },
    staleTime: 30_000,
  });

  const dismissInquiryNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inquiries").update({ status: "in_progress" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Inquiry notification removed");
      qc.invalidateQueries({ queryKey: ["admin", "system-notifications"] });
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filteredSearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS.slice(0, 6);
    return SEARCH_ITEMS.filter((item) =>
      `${item.label} ${item.description}`.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [search]);

  const inquiryNotifications = noticeData?.inquiries ?? [];
  const systemNotifications = [
    {
      label: `${noticeData?.draftProducts ?? 0} product drafts`,
      description: "Publish products when they are ready.",
      to: "/admin/products",
      active: (noticeData?.draftProducts ?? 0) > 0,
    },
    {
      label: `${noticeData?.draftFarmers ?? 0} farmer profile drafts`,
      description: "Complete and publish farmer profiles.",
      to: "/admin/farmers",
      active: (noticeData?.draftFarmers ?? 0) > 0,
    },
  ];
  const activeSystemNotifications = systemNotifications.filter((item) => item.active);
  const notificationCount = inquiryNotifications.length + activeSystemNotifications.length;

  const goTo = (to: string) => {
    navigate(to);
    setSearchOpen(false);
    setNotificationsOpen(false);
  };

  const sidebar = (
    <div className="flex h-full flex-col overflow-hidden rounded-none border-r border-primary/10 bg-[#f5f8f1] text-foreground shadow-[12px_0_35px_hsl(var(--clay-shadow-outer)/0.10)] lg:m-4 lg:mr-0 lg:rounded-3xl lg:border">
      <div className="flex h-20 items-center gap-3 px-5">
        <SiteImage src={logoImage} loading="eager" alt="Elgon Cooperative logo" width={40} height={40} className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/10 bg-white object-cover p-0.5 shadow-sm" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-heading text-base font-bold leading-tight text-primary">Dashboard</p>
            <p className="text-[11px] text-muted-foreground">Elgon Cooperative</p>
          </div>
        )}
      </div>

      <nav aria-label="Admin sections" className="flex-1 space-y-2 overflow-y-auto p-4">
        {NAV.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_14px_30px_hsl(var(--primary)/0.22)]"
                  : "text-foreground/75 hover:bg-white hover:text-primary hover:shadow-[0_10px_24px_hsl(var(--clay-shadow-outer)/0.10)]",
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 border-t border-primary/10 p-4">
        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-white hover:text-primary hover:shadow-[0_10px_24px_hsl(var(--clay-shadow-outer)/0.10)]",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-shell flex min-h-screen w-full bg-[#f8faf6]">
      <Seo title="Admin dashboard | Elgon Cooperative" description="Manage products, farmers and inquiries." path="/admin" noindex />

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen flex-col transition-[width] duration-200 lg:flex",
          collapsed ? "w-[86px]" : "w-64",
        )}
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="h-full w-64 shadow-xl">{sidebar}</div>
          <button
            aria-label="Close menu"
            className="flex-1 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-primary/10 bg-white/90 px-4 shadow-[0_14px_35px_hsl(var(--clay-shadow-outer)/0.10)] backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-2xl border border-primary/10 bg-white p-2 text-foreground shadow-sm lg:hidden"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <Menu className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <button
              className="hidden rounded-2xl border border-primary/10 bg-white p-2 text-foreground shadow-sm hover:text-primary lg:inline-flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <label className="relative hidden h-11 min-w-[280px] items-center gap-3 rounded-2xl border border-primary/10 bg-[#f8faf6] px-4 shadow-inner md:flex">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <input
                type="search"
                placeholder="Search dashboard..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredSearch[0]) {
                    e.preventDefault();
                    goTo(filteredSearch[0].to);
                    setSearch("");
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                className="h-full w-full border-0 bg-transparent p-0 text-sm shadow-none outline-none placeholder:text-muted-foreground"
              />
              {searchOpen && (
                <div className="absolute left-0 top-14 z-50 w-[360px] overflow-hidden rounded-2xl border border-primary/10 bg-white p-2 shadow-[0_18px_45px_hsl(var(--clay-shadow-outer)/0.18)]">
                  {filteredSearch.length > 0 ? (
                    filteredSearch.map((item) => (
                      <button
                        key={`${item.to}-${item.label}`}
                        type="button"
                        className="block w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#f8faf6]"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          goTo(item.to);
                          setSearch("");
                        }}
                      >
                        <span className="block text-sm font-semibold text-primary">{item.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-sm text-muted-foreground">No matching admin page found.</p>
                  )}
                </div>
              )}
            </label>
          </div>
          <div className="relative">
            <button
              className="relative grid h-10 w-10 place-items-center rounded-2xl border border-primary/10 bg-white text-primary shadow-sm transition-colors hover:bg-[#f8faf6]"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((open) => !open)}
            >
              <Bell className="h-4 w-4" aria-hidden />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary">
                  {notificationCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-primary/10 bg-white p-2 shadow-[0_18px_45px_hsl(var(--clay-shadow-outer)/0.18)]">
                <div className="px-3 py-2">
                  <p className="btn-label text-[11px] text-primary">System notifications</p>
                  <p className="mt-1 text-xs text-muted-foreground">Live admin items that need attention.</p>
                </div>
                {notificationCount > 0 ? (
                  <>
                  {inquiryNotifications.map((item) => (
                    <div key={item.id} className="flex items-start gap-2 rounded-xl px-3 py-3 transition-colors hover:bg-[#f8faf6]">
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => goTo("/admin/inquiries")}
                      >
                        <span className="block text-sm font-semibold text-primary">New inquiry from {item.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {item.email} / {new Date(item.created_at as string).toLocaleString()}
                        </span>
                        {Array.isArray(item.product_slugs) && item.product_slugs.length > 0 && (
                          <span className="mt-1 block truncate text-xs text-foreground/70">
                            Products: {item.product_slugs.join(", ")}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-primary/10 bg-white text-muted-foreground shadow-sm transition-colors hover:text-destructive"
                        aria-label={`Remove notification for ${item.name}`}
                        disabled={dismissInquiryNotification.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissInquiryNotification.mutate(item.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  ))}
                  {activeSystemNotifications.map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      className="block w-full rounded-xl px-3 py-3 text-left transition-colors hover:bg-[#f8faf6]"
                      onClick={() => goTo(item.to)}
                    >
                      <span className="block text-sm font-semibold text-primary">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                    </button>
                  ))}
                  </>
                ) : (
                  <p className="px-3 py-4 text-sm text-muted-foreground">Everything is up to date.</p>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
