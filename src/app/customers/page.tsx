"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Users, Search, Award } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const data = await api.getCustomers();
      setCustomers(data);
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
  const fmtDate = (s: string) =>
    s
      ? new Date(s).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      (c.vehicle && c.vehicle.toLowerCase().includes(search.toLowerCase())) ||
      (c.model && c.model.toLowerCase().includes(search.toLowerCase()))
  );

  const vipCount = customers.filter(c => c.totalSpend >= 50000).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpend, 0);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-dashed pb-4" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-syne)" }}>
            <Users className="text-[var(--accent)]" size={22} /> Customer Registry
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Manage customer database information, service histories, and high-value VIP detailing profiles.</p>
        </div>
      </div>

      {/* 3-Column Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 - Total customers */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Registered Clients
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {customers.length} Profiles
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <Users size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Total unique detailing customer database</span>
        </div>

        {/* Stat 2 - VIP Count */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                VIP Clients
              </span>
              <div className="text-2xl font-extrabold text-purple-400 mt-1 tracking-tight">
                {vipCount} Members
              </div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Award size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Clients with spends above ₹50,000</span>
        </div>

        {/* Stat 3 - Total Spend */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Cumulative Spend
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                {fmt(totalRevenue)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <Users size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Total gross sales value received</span>
        </div>
      </div>

      {/* Search Header */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Users className="text-[var(--accent)]" size={16} /> Customer Registry
            </h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">Directory of all client profiles and histories.</p>
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
            <input
              type="text"
              placeholder="Search name, phone, vehicle..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg text-xs w-full border"
              style={{
                background: "var(--bg3)",
                borderColor: "var(--border2)",
                color: "var(--text)",
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[700px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Customer ID
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Customer Name
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Contact
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Linked Vehicle
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Visits
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Total Spend
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Last Visited
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(cus => {
                const isVIP = cus.totalSpend >= 50000;
                return (
                  <tr key={cus.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                    <td className="p-4 font-mono text-xs text-[var(--text3)]">{cus.id}</td>
                    <td className="p-4 font-bold flex items-center gap-1.5">
                      {cus.name}
                      {isVIP && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                          title="VIP Customer"
                        >
                          <Award size={10} /> VIP
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-semibold">
                      <div>{cus.phone}</div>
                      <div className="text-[var(--text3)] text-[10px] font-normal">{cus.email}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-bold uppercase">{cus.vehicle}</div>
                      <div className="text-[var(--text3)] text-[10px]">{cus.model}</div>
                    </td>
                    <td className="p-4 text-xs font-bold">{cus.visits}</td>
                    <td className="p-4 text-xs font-extrabold text-green-500">{fmt(cus.totalSpend)}</td>
                    <td className="p-4 text-xs">{fmtDate(cus.lastVisit)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
