"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Building, Plus, Search, Award, ShieldAlert, BadgeCheck } from "lucide-react";
import FranchiseDialog from "@/components/franchise/FranchiseDialog";

export default function Franchise() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [franModal, setFranModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    city: "",
    owner: "",
    phone: "",
    since: "",
    revenue: 0,
    jobs: 0,
    royaltyPct: 5,
    status: "Active",
  });

  const loadData = async () => {
    try {
      const data = await api.getFranchise();
      setBranches(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveFran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.owner) {
      alert("Store Name, City, and Owner Name are required!");
      return;
    }
    try {
      await api.createFranchise(form);
      setFranModal(false);
      setForm({
        name: "",
        city: "",
        owner: "",
        phone: "",
        since: "",
        revenue: 0,
        jobs: 0,
        royaltyPct: 5,
        status: "Active",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create franchise branch.");
    }
  };

  const fmt = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");
  const fmtDate = (s: string) =>
    s
      ? new Date(s).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const totalMonthlyRev = branches.reduce((sum, b) => sum + b.revenue, 0);
  const totalRoyaltyPayout = branches.reduce((sum, b) => sum + (b.revenue * b.royaltyPct) / 100, 0);

  const filtered = branches.filter(
    b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.owner.toLowerCase().includes(search.toLowerCase())
  );

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
            <Building className="text-[var(--accent)]" size={22} /> Franchise Network
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Manage regional partners, track monthly volume, and view royalty yields.</p>
        </div>
        <button
          onClick={() => {
            setForm({
              name: "",
              city: "",
              owner: "",
              phone: "",
              since: new Date().toISOString().slice(0, 10),
              revenue: 0,
              jobs: 0,
              royaltyPct: 5,
              status: "Active",
            });
            setFranModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> Add Franchise Branch
        </button>
      </div>

      {/* Overview Totals Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 - Revenue */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Total Monthly Rev
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {fmt(totalMonthlyRev)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <Building size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Cumulative monthly branch volume</span>
        </div>

        {/* Stat 2 - Royalty */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Royalty Yield (Est)
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                {fmt(totalRoyaltyPayout)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <Award size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Est. net revenue cut (5% avg)</span>
        </div>

        {/* Stat 3 - Active Hubs */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Active Hubs
              </span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1 tracking-tight">
                {branches.filter(b => b.status === "Active").length} / {branches.length}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BadgeCheck size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Registered active locations</span>
        </div>
      </div>

      {/* Franchise register card */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Franchise Directory</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">Directory of all active store fronts.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
            <input
              type="text"
              placeholder="Search branch name, owner, city..."
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
          <table className="w-full border-collapse text-left text-sm min-w-[800px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Store ID
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Branch Name
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Owner Info
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Monthly Revenue
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Royalty ({branches[0]?.royaltyPct || 5}%)
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Since Date
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(fran => {
                const statusClass =
                  fran.status === "Active"
                    ? "badge-success"
                    : fran.status === "Trial"
                    ? "badge-warn"
                    : "badge-danger";
                return (
                  <tr key={fran.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs text-[var(--accent)] font-semibold">{fran.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-sm text-white">{fran.name}</div>
                      <div className="text-[var(--text3)] text-[10px] font-semibold uppercase tracking-wider mt-0.5">{fran.city}</div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-white">
                      <div>{fran.owner}</div>
                      <div className="text-[var(--text3)] text-[10px] font-mono font-medium mt-0.5">{fran.phone}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-extrabold text-white">{fmt(fran.revenue)}</div>
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[var(--text2)] mt-1">
                        {fran.jobs} completed jobs
                      </span>
                    </td>
                    <td className="p-4 text-xs font-extrabold text-emerald-400">
                      {fmt((fran.revenue * fran.royaltyPct) / 100)}
                    </td>
                    <td className="p-4 text-xs text-[var(--text2)] font-medium">{fmtDate(fran.since)}</td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase ${statusClass}`}>
                        {fran.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <FranchiseDialog
        open={franModal}
        onClose={() => setFranModal(false)}
        onSubmit={handleSaveFran}
        form={form}
        setForm={setForm}
      />
    </div>
  );
}
