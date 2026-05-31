"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import {
  TrendingUp,
  Car,
  UserPlus,
  AlertTriangle,
  ChevronRight,
  Building,
  CheckCircle,
  BarChart3,
  FileText,
  ArrowUpRight,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const [dashData, leadsData, invoicesData] = await Promise.all([
        api.getDashboard(),
        api.getLeads(),
        api.getInvoices(),
      ]);
      setData(dashData);
      setLeads(leadsData);
      setInvoices(invoicesData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard statistics.");
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleQuickCheckOut = async (carId: string) => {
    try {
      await api.checkOutCar(carId);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || "Failed to check out vehicle.");
    }
  };

  const fmt = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2" style={{ borderColor: "var(--accent)" }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>{error || "No data available."}</p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Revenue (Paid)",
      value: fmt(data.revenue),
      sub: "+23% vs last month",
      subColor: "var(--success)",
      icon: TrendingUp,
      iconBg: "var(--accent-glow)",
      iconColor: "var(--accent)",
      bar: "from-amber-400 to-amber-600",
    },
    {
      label: "Cars in Workshop",
      value: data.carsInCount,
      sub: "Active work-in-progress",
      subColor: "var(--text3)",
      icon: Car,
      iconBg: "rgba(34,197,94,0.1)",
      iconColor: "#22c55e",
      bar: "from-green-400 to-emerald-600",
    },
    {
      label: "Active Leads",
      value: data.activeLeadsCount,
      sub: `Total CRM leads: ${data.leadsCount}`,
      subColor: "#60a5fa",
      icon: UserPlus,
      iconBg: "rgba(59,130,246,0.1)",
      iconColor: "#60a5fa",
      bar: "from-blue-400 to-indigo-600",
    },
    {
      label: "Pending / Overdue",
      value: fmt(data.pendingOverdueAmount),
      sub: `${data.overdueCount} overdue invoices`,
      subColor: "var(--danger)",
      icon: AlertTriangle,
      iconBg: "rgba(239,68,68,0.1)",
      iconColor: "var(--danger)",
      bar: "from-red-400 to-rose-600",
    },
  ];

  const statusMap: Record<string, { badge: string; color: string }> = {
    New: { badge: "badge-info", color: "#60a5fa" },
    "Follow Up": { badge: "badge-warn", color: "var(--warn)" },
    Closed: { badge: "badge-success", color: "var(--success)" },
    Lost: { badge: "badge-danger", color: "var(--danger)" },
  };

  const invoiceStatuses = [
    { s: "Paid", badge: "badge-success", color: "#4ade80" },
    { s: "Pending", badge: "badge-warn", color: "#fbbf24" },
    { s: "Overdue", badge: "badge-danger", color: "var(--danger)" },
    { s: "Approved", badge: "badge-info", color: "#60a5fa" },
  ];

  const leadSources = [
    { src: "JustDial", clr: "#3b82f6" },
    { src: "Instagram", clr: "#a855f7" },
    { src: "Facebook", clr: "#f59e0b" },
    { src: "Referral", clr: "#22c55e" },
    { src: "Walk-in", clr: "#6b7280" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">

      {/* ── KPI cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, sub, subColor, icon: Icon, iconBg, iconColor, bar }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-default"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${bar} opacity-70`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "var(--text3)" }}>
                  {label}
                </p>
                <p className="text-[26px] font-black leading-none tracking-tight" style={{ color: "var(--text)" }}>
                  {value}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: iconBg }}
              >
                <Icon size={16} style={{ color: iconColor }} />
              </div>
            </div>
            <p className="text-[11px] font-semibold" style={{ color: subColor }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Low stock alert ───────────────────────── */}
      {data.lowStockCount > 0 && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm"
          style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)", color: "var(--danger)" }}
        >
          <AlertTriangle size={16} className="shrink-0" />
          <span>
            <strong className="font-bold" style={{ color: "var(--text)" }}>{data.lowStockCount} items</strong>
            {" "}below safety limits:{" "}
            <span className="font-mono text-xs" style={{ color: "var(--text2)" }}>{data.lowStockList.join(", ")}</span>
          </span>
        </div>
      )}

      {/* ── Main 2-col grid ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Cars in workshop */}
        <div className="rounded-2xl border flex flex-col overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-glow)" }}>
                <Car size={14} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Active Vehicles</p>
                <p className="text-[10px]" style={{ color: "var(--text3)" }}>{data.carsInList.length} in workshop</p>
              </div>
            </div>
            <Link href="/carin" className="flex items-center gap-1 text-[11px] font-semibold transition-colors" style={{ color: "var(--text3)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text3)")}>
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
            {data.carsInList.length === 0 ? (
              <p className="text-sm text-center py-10 italic" style={{ color: "var(--text3)" }}>No vehicles currently in workshop.</p>
            ) : (
              data.carsInList.map((car: any) => (
                <div key={car.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{car.vehicle}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text3)" }}>
                      {car.model} · {car.customer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase badge-success">In Shop</span>
                    <button
                      onClick={() => handleQuickCheckOut(car.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all"
                      style={{ background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.25)", color: "#4ade80" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "#22c55e";
                        (e.currentTarget as HTMLElement).style.color = "#000";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(34,197,94,0.08)";
                        (e.currentTarget as HTMLElement).style.color = "#4ade80";
                      }}
                    >
                      <LogOut size={11} /> Checkout
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="rounded-2xl border flex flex-col overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)" }}>
                <UserPlus size={14} style={{ color: "#60a5fa" }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Recent CRM Leads</p>
                <p className="text-[10px]" style={{ color: "var(--text3)" }}>Latest pipeline contacts</p>
              </div>
            </div>
            <Link href="/leads" className="flex items-center gap-1 text-[11px] font-semibold transition-colors" style={{ color: "var(--text3)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text3)")}>
              Pipeline <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
            {data.recentLeadsList.length === 0 ? (
              <p className="text-sm text-center py-10 italic" style={{ color: "var(--text3)" }}>No recent leads.</p>
            ) : (
              data.recentLeadsList.map((lead: any) => {
                const st = statusMap[lead.status] || { badge: "badge-info", color: "var(--text2)" };
                return (
                  <div key={lead.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{lead.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text3)" }}>
                        {lead.source} · <span style={{ color: "var(--accent)" }}>{lead.service}</span>
                      </p>
                    </div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase ${st.badge}`}>
                      {lead.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom 3-col grid ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Lead Sources */}
        <div className="rounded-2xl border flex flex-col overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg3)" }}>
              <BarChart3 size={14} style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Lead Sources</p>
          </div>
          <div className="flex flex-col gap-4 px-5 py-4">
            {leadSources.map(({ src, clr }) => {
              const cnt = leads.filter((l: any) => l.source === src).length;
              const pct = leads.length ? Math.round((cnt / leads.length) * 100) : 0;
              return (
                <div key={src} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-[12px]" style={{ color: "var(--text2)" }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: clr }} />
                      {src}
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: "var(--text)" }}>{cnt} <span style={{ color: "var(--text3)" }}>({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--bg4)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: clr }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Status */}
        <div className="rounded-2xl border flex flex-col overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg3)" }}>
              <FileText size={14} style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Invoice Status</p>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
            {invoiceStatuses.map(({ s, badge, color }) => {
              const filtered = invoices.filter((i: any) => i.status === s);
              const cnt = filtered.length;
              const val = filtered.reduce((sum: number, i: any) => sum + i.amount + i.gst - i.discount, 0);
              return (
                <div key={s} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${badge}`}>{s}</span>
                    <span className="text-[11px]" style={{ color: "var(--text3)" }}>{cnt} docs</span>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color }}>{fmt(val)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Franchise Revenue */}
        <div className="rounded-2xl border flex flex-col overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg3)" }}>
                <Building size={14} style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Franchise Revenue</p>
            </div>
            <Link href="/franchise" className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--text3)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text3)")}>
              All Branches <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="flex flex-col divide-y overflow-y-auto max-h-[240px] no-scrollbar" style={{ borderColor: "var(--border)" }}>
            {data.franchiseList.map((fran: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-[12px] font-bold" style={{ color: "var(--text)" }}>{fran.city}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text3)" }}>{fran.jobs} jobs · {fran.owner}</p>
                </div>
                <span className="text-[12px] font-extrabold" style={{ color: "var(--accent)" }}>{fmt(fran.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
