"use client";

import { useEffect, useState, ReactNode, ElementType } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import {
  LayoutDashboard,
  Car,
  FileCheck2,
  UserPlus,
  FileText,
  CreditCard,
  Wrench,
  Boxes,
  ClipboardList,
  Building,
  Users,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";


interface UserProfile {
  id: string;
  username: string;
  role: string;
}

interface SidebarAndTopbarProps {
  children: ReactNode;
}


const navItems = [
  { type: "group", label: "Main" },
  { type: "item", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { type: "group", label: "Workshop" },
  { type: "item", label: "Car In / Out", path: "/carin", icon: Car },
  { type: "item", label: "Out Pass", path: "/outpass", icon: FileCheck2 },
  { type: "group", label: "Sales & CRM" },
  { type: "item", label: "Leads", path: "/leads", icon: UserPlus },
  { type: "item", label: "Billing", path: "/billing", icon: FileText },
  { type: "item", label: "Payments", path: "/payments", icon: CreditCard },
  { type: "group", label: "Operations" },
  { type: "item", label: "Services", path: "/services", icon: Wrench },
  { type: "item", label: "Inventory", path: "/inventory", icon: Boxes },
  { type: "item", label: "Job Cards", path: "/jobs", icon: ClipboardList },
  { type: "group", label: "Growth" },
  { type: "item", label: "Franchise", path: "/franchise", icon: Building },
  { type: "item", label: "Customers", path: "/customers", icon: Users },
  { type: "group", label: "Analytics" },
  { type: "item", label: "Reports", path: "/reports", icon: BarChart3 },
  { type: "item", label: "Settings", path: "/settings", icon: Settings },
] as const;

export default function SidebarAndTopbar({ children }: SidebarAndTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Authentication states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/login") {
        setLoadingAuth(false);
        return;
      }

      const token = localStorage.getItem("sz_token");
      if (!token) {
        setLoadingAuth(false);
        router.push("/login");
        return;
      }

      try {
        const u = await api.getMe();
        setUser(u);
        setLoadingAuth(false);
      } catch (err) {
        console.error("Auth validation failed:", err);
        localStorage.removeItem("sz_token");
        setLoadingAuth(false);
        router.push("/login");
      }
    };
    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("sz_token");
    router.push("/login");
  };

  useEffect(() => {
    const saved = localStorage.getItem("sz_theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);


  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setOpen(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [pathname, isMobile]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("sz_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const getTitle = () => {
    const found = navItems.find(
      (n) => n.type === "item" && (n as { path: string }).path === pathname
    );
    return found ? (found as { label: string }).label : "Dashboard";
  };

  const collapsed = !isMobile && !open;

  const sidebarPx = isMobile ? (open ? 240 : 0) : collapsed ? 64 : 240;

  if (pathname === "/login") {
    return (
      <div className="min-h-screen w-full flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </div>
    );
  }

  if (loadingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2" style={{ borderColor: "var(--accent)" }} />
          <p className="text-xs uppercase tracking-widest text-[var(--text3)] font-bold">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (

    <div
      className="flex min-h-screen w-full"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* Mobile backdrop */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm no-print"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside
        className="no-print shrink-0 flex flex-col h-screen overflow-hidden transition-all duration-300"
        style={{
          width: sidebarPx,
          minWidth: sidebarPx,
          background: "var(--bg2)",
          borderRight: "1px solid var(--border)",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          zIndex: isMobile ? 50 : 30,
          boxShadow: isMobile && open
            ? "4px 0 32px rgba(0,0,0,0.35)"
            : "2px 0 12px rgba(0,0,0,0.18)",
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center shrink-0 h-14 px-4 gap-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
            style={{ background: "var(--accent)", color: "#05050a" }}
          >
            SZ
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-black uppercase leading-none tracking-wide truncate"
                  style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
                >
                  Shifterz
                </p>
                <p
                  className="text-[10px] font-semibold tracking-widest uppercase mt-0.5 truncate"
                  style={{ color: "var(--text3)" }}
                >
                  Pro Suite
                </p>
              </div>
              {isMobile && (
                <button
                  onClick={() => setOpen(false)}
                  className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center cursor-pointer"
                  style={{ color: "var(--text3)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <X size={14} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 flex flex-col">

          {navItems.map((item, i) => {
            if (item.type === "group") {
              return collapsed ? (
                <div
                  key={i}
                  style={{ width: 28, height: 1, background: "var(--border2)", margin: "8px auto" }}
                />
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-2 px-5 pt-7 pb-2"
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ background: "var(--text3)" }}
                  />
                  <p
                    className="text-[9px] font-bold uppercase"
                    style={{
                      color: "var(--text3)",
                      fontFamily: "var(--font-syne)",
                      letterSpacing: "0.22em",
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              );

            }

            const nav = item as { type: "item"; label: string; path: string; icon: ElementType };
            const Icon = nav.icon;
            const active = pathname === nav.path;

            return (
              <Link
                key={i}
                href={nav.path}
                onClick={() => isMobile && setOpen(false)}
                title={collapsed ? nav.label : undefined}
                className="flex items-center rounded-lg mb-0.5 cursor-pointer transition-all duration-150 select-none"
                style={{
                  height: 36,
                  padding: collapsed ? "0" : "0 10px",
                  gap: collapsed ? 0 : 10,
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: active ? "var(--accent-glow)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text2)",
                  fontWeight: active ? 600 : 500,
                  fontSize: 13,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg3)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text2)";
                  }
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={active ? 2.2 : 1.8}
                  className="shrink-0"
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{nav.label}</span>
                    {active && <ChevronRight size={12} className="shrink-0 opacity-50" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div
          className="shrink-0 px-3 py-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {collapsed ? (
            <div
              onClick={() => {
                if (confirm("Are you sure you want to sign out?")) {
                  handleLogout();
                }
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mx-auto cursor-pointer hover:opacity-80 transition-all shrink-0"
              style={{ background: "var(--accent-gradient)", color: "#05050a" }}
              title="Click to Sign Out"
            >
              {user ? user.username.slice(0, 2).toUpperCase() : "AD"}
            </div>
          ) : (
            <div className="flex items-center gap-2.5 w-full">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 animate-fade-in"
                style={{ background: "var(--accent-gradient)", color: "#05050a" }}
              >
                {user ? user.username.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold truncate" style={{ color: "var(--text)" }}>
                  {user ? user.username : "Admin"}
                </p>
                <p
                  className="text-[10px] uppercase tracking-wider font-semibold truncate"
                  style={{ color: "var(--text3)" }}
                >
                  {user ? user.role : "Administrator"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer text-[var(--text3)] hover:text-[var(--danger)] hover:bg-[rgba(239,68,68,0.1)] transition-all ml-auto shrink-0"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* ══ MAIN AREA ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header
          className="no-print z-30 shrink-0 flex items-center justify-between gap-3 h-14 px-4"
          style={{
            background: "var(--bg2)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setOpen(!open)}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
              style={{ color: "var(--text3)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg3)";
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--text3)";
              }}
              aria-label="Toggle sidebar"
            >
              <Menu size={17} />
            </button>
            <h1
              className="text-sm font-bold truncate"
              style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
            >
              {getTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Clock */}
            <div
              className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg text-[11px] font-mono"
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                color: "var(--text2)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                style={{ background: "var(--success)" }}
              />
              {time || "--:--:--"}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                color: "var(--text2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text2)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black cursor-pointer shrink-0"
              style={{ background: "var(--accent-gradient)", color: "#05050a" }}
              title="Admin"
            >
              AD
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            background: "var(--bg)",
            padding: "36px 40px 56px 40px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
