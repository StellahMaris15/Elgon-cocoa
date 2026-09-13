import { SiteImage } from "@/components/SiteImage";
import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  BadgeCheck,
  Bell,
  Inbox,
  LogOut,
  PanelsTopLeft,
  Globe2,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Search,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Seo } from "@/components/Seo";
import { logoImage } from "@/data/cropImages";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", end: true, label: "Overview", icon: PanelsTopLeft },
  { to: "/admin/products", label: "Products", icon: PackageCheck },
  { to: "/admin/farmers", label: "Farmers", icon: UsersRound },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings", label: "Settings", icon: BadgeCheck },
];

export const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col overflow-hidden rounded-none border-r border-primary/10 bg-[#f5f8f1] text-foreground shadow-[12px_0_35px_hsl(var(--clay-shadow-outer)/0.10)] lg:m-4 lg:mr-0 lg:rounded-3xl lg:border">
      <div className="flex h-20 items-center gap-3 px-5">
        <SiteImage src={logoImage} loading="eager" alt="Elgon Cooperative logo" width={40} height={40} className="h-10 w-10 shrink-0 rounded-2xl border border-primary/10 bg-white object-contain p-1 shadow-sm" />
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
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:shadow-[var(--clay-shadow-sm)] transition-all",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "View website" : undefined}
        >
          <Globe2 className="w-4 h-4 shrink-0" aria-hidden />
          {!collapsed && <span>View website</span>}
        </Link>
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
      <Seo title="Admin dashboard | Elgon Cooperative" description="Manage products, farmers and inquiries." path="/admin" />

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
            <label className="hidden h-11 min-w-[280px] items-center gap-3 rounded-2xl border border-primary/10 bg-[#f8faf6] px-4 shadow-inner md:flex">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <input
                type="search"
                placeholder="Search dashboard..."
                className="h-full w-full border-0 bg-transparent p-0 text-sm shadow-none outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-2xl border border-primary/10 bg-white text-primary shadow-sm" aria-label="Notifications">
              <Bell className="h-4 w-4" aria-hidden />
            </button>
            <span className="hidden max-w-[220px] truncate text-xs text-muted-foreground sm:block">{user?.email}</span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-[0_10px_24px_hsl(var(--primary)/0.22)]">
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </span>
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
