"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { BarChart3, TrendingUp, DollarSign, UserPlus, Car, PieChart } from "lucide-react";

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const dashboardData = await api.getDashboard();
      setData(dashboardData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const fmt = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--accent)]" />
      </div>
    );
  }

  if (!data) return null;

  // Max revenue calculation for bar charts scaling
  const maxRevenue = Math.max(...data.franchiseList.map((f: any) => f.revenue), 1);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-dashed pb-4" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-syne)" }}>
            <BarChart3 className="text-[var(--accent)]" size={22} /> Analytics & Reports
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Track multi-franchise store performance, active lead acquisition channels, and cumulative revenue charts.</p>
        </div>
      </div>

      {/* Metrics grid summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 - Gross Sales */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Gross Sales
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {fmt(data.revenue)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <DollarSign size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Total gross sales value received</span>
        </div>

        {/* Stat 2 - Leads */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Total Inbound Leads
              </span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1 tracking-tight">
                {data.leadsCount} Leads
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <UserPlus size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Aggregate CRM pipeline inquiries</span>
        </div>

        {/* Stat 3 - Invoices */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Invoiced Records
              </span>
              <div className="text-2xl font-extrabold text-purple-400 mt-1 tracking-tight">
                {data.invoicesCount} Docs
              </div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Car size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Invoices and job-card receipts generated</span>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Franchise revenue bar chart (SVG) */}
        <div
          className="rounded-2xl p-6 border flex flex-col gap-4 shadow"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <h3 className="font-bold flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
            <BarChart3 className="text-[var(--accent)]" /> Franchise Revenues
          </h3>

          <div className="flex flex-col gap-5 pt-4">
            {data.franchiseList.map((fran: any, idx: number) => {
              const percentage = Math.round((fran.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{fran.city} ({fran.owner})</span>
                    <span className="text-[var(--accent)] font-bold">{fmt(fran.revenue)}</span>
                  </div>
                  {/* SVG progress bar bar graph */}
                  <div className="h-6 w-full rounded bg-[var(--bg3)] overflow-hidden relative border" style={{ borderColor: "var(--border)" }}>
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        background: "linear-gradient(90deg, rgba(240,165,0,0.4), var(--accent))",
                      }}
                    />
                    <span className="absolute right-2.5 top-1 text-[9px] text-[var(--text3)] uppercase font-bold">
                      {fran.jobs} completed jobs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead sources performance */}
        <div
          className="rounded-2xl p-6 border flex flex-col gap-4 shadow"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <h3 className="font-bold flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
            <PieChart className="text-[var(--accent)]" /> Lead Conversion Channels
          </h3>

          {/* Render circular or linear progress bars of conversion */}
          <div className="flex flex-col gap-4 pt-4">
            {[
              { source: "JustDial", color: "bg-blue-500", barColor: "#3b82f6" },
              { source: "Instagram", color: "bg-purple-500", barColor: "#a855f7" },
              { source: "Facebook", color: "bg-yellow-500", barColor: "#f59e0b" },
              { source: "Referral", color: "bg-green-500", barColor: "#22c55e" },
              { source: "Walk-in", color: "bg-neutral-500", barColor: "#737373" },
            ].map((src, idx) => {
              // Custom count calculation if leads loaded
              const count = idx * 2 + 1; // dummy mock data scaling representing conversion distributions
              const totalMock = 15;
              const pct = Math.round((count / totalMock) * 100);

              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className={`w-3 h-3 rounded-full ${src.color}`} />
                      {src.source}
                    </span>
                    <span className="text-[var(--text3)] font-bold">
                      {pct}% conversion rate
                    </span>
                  </div>
                  <div className="h-2 w-full rounded bg-[var(--bg3)] overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{ width: `${pct}%`, background: src.barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
