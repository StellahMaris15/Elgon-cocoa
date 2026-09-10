import { SiteImage } from "@/components/SiteImage";
import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  Package,
  Users,
  Inbox,
  Settings,
  LogOut,
  LayoutDashboard,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Seo } from "@/components/Seo";
import { logoImage } from "@/data/cropImages";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/farmers", label: "Farmers", icon: Users },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings", label: "Inquiry settings", icon: Settings },
];

export const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-card text-foreground lg:m-4 lg:mr-0 lg:rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="h-16 flex items-center gap-3 px-4 border-b border-border/60">
        <SiteImage src={logoImage} loading="eager" alt="Elgon Cooperative logo" width={36} height={36} className="w-9 h-9 object-contain shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="btn-label text-[11px] leading-tight">Elgon Cooperative</p>
            <p className="text-[11px] text-muted-foreground">Admin console</p>
          </div>
        )}
      </div>

      <nav aria-label="Admin sections" className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-tertiary text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-primary",
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border/60 space-y-1">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-primary transition-colors",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "View website" : undefined}
        >
          <Globe className="w-4 h-4 shrink-0" aria-hidden />
          {!collapsed && <span>View website</span>}
        </Link>
        <button
          onClick={signOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-primary transition-colors",
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
    <div className="admin-shell min-h-screen bg-background flex w-full">
      <Seo title="Admin dashboard | Elgon Cooperative" description="Manage products, farmers and inquiries." path="/admin" />

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col sticky top-0 h-screen transition-[width] duration-200",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full shadow-xl">{sidebar}</div>
          <button
            aria-label="Close menu"
            className="flex-1 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-background/95 backdrop-blur-md flex items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-30 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md border border-border bg-card text-foreground"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <Menu className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <button
              className="hidden lg:inline-flex p-2 rounded-md border border-border bg-card text-foreground hover:text-primary"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <p className="btn-label text-[11px] text-primary hidden sm:block">Content management</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[220px]">{user?.email}</span>
            <span className="w-9 h-9 rounded-full border border-border bg-card text-primary grid place-items-center text-xs font-semibold">
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </span>
          </div>
        </header>

        <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
