"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { FileCheck2, Plus, Search, Printer, Shield, Car, Clock } from "lucide-react";
import NewOutPassDialog from "@/components/outpass/NewOutPassDialog";
import PrintPassDialog from "@/components/outpass/PrintPassDialog";

export default function OutPass() {
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [passModal, setPassModal] = useState(false);
  const [printPass, setPrintPass] = useState<any>(null);

  // Form state
  const [form, setForm] = useState({
    id: "",
    vehicle: "",
    model: "",
    customer: "",
    phone: "",
    service: "",
    technicianName: "",
    securityName: "",
    outTime: "",
    remarks: "",
  });

  const loadData = async () => {
    try {
      const data = await api.getOutPass();
      setPasses(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle || !form.customer) {
      alert("Vehicle and Customer Name are required!");
      return;
    }
    try {
      await api.createOutPass({
        ...form,
        outTime: form.outTime || new Date().toISOString(),
      });
      setPassModal(false);
      setForm({
        id: "",
        vehicle: "",
        model: "",
        customer: "",
        phone: "",
        service: "",
        technicianName: "",
        securityName: "",
        outTime: "",
        remarks: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to issue pass.");
    }
  };

  const handlePrintTrigger = (pass: any) => {
    setPrintPass(pass);
  };

  const fmtDT = (s: string) =>
    s
      ? new Date(s).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const filtered = passes.filter(
    p =>
      p.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
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
            <FileCheck2 className="text-[var(--accent)]" size={22} /> Gate Out Pass
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Generate and manage security gate passes for vehicles cleared to exit.</p>
        </div>
        <button
          onClick={() => {
            setForm({
              id: "",
              vehicle: "",
              model: "",
              customer: "",
              phone: "",
              service: "",
              technicianName: "",
              securityName: "Murugan",
              outTime: new Date().toISOString().slice(0, 16),
              remarks: "",
            });
            setPassModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> New Out Pass
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Total Passes Issued
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {passes.length} passes
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <FileCheck2 size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Gate clearance history logs</span>
        </div>

        {/* Stat 2 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Cleared Today
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                {passes.filter(p => p.outTime && p.outTime.slice(0, 10) === new Date().toISOString().slice(0, 10)).length} vehicles
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <Car size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Vehicles exited gate today</span>
        </div>

        {/* Stat 3 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Active Security
              </span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1 tracking-tight">
                {Array.from(new Set(passes.map(p => p.securityName).filter(Boolean))).length || 1} Officers
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Gate checkpoints active</span>
        </div>
      </div>

      {/* Pass Register Card */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl no-print"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Out Pass Register</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">List of issued checkout passes.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
            <input
              type="text"
              placeholder="Search Pass ID, plate, name..."
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
                  Pass ID
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Vehicle
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Model
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Customer
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Service
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Technician
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Out Date / Time
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Security
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(pass => (
                <tr key={pass.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-xs text-[var(--accent)] font-extrabold">{pass.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-sm text-white">{pass.vehicle}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-[var(--text2)] font-semibold">{pass.model}</span>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-extrabold text-sm text-white">{pass.customer}</div>
                    <div className="text-[var(--text3)] text-[10px] font-medium mt-0.5">{pass.phone}</div>
                  </td>
                  <td className="p-4 text-xs text-[var(--text2)] font-semibold">{pass.service || "—"}</td>
                  <td className="p-4 text-xs text-[var(--text2)] font-medium">{pass.technicianName || "—"}</td>
                  <td className="p-4 text-xs text-[var(--text2)] font-medium">{fmtDT(pass.outTime)}</td>
                  <td className="p-4 text-xs text-[var(--text2)] font-medium">{pass.securityName}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handlePrintTrigger(pass)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg3)] hover:bg-[var(--bg4)] border border-[var(--border2)] text-xs font-semibold transition-all cursor-pointer text-white"
                    >
                      <Printer size={12} /> Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewOutPassDialog
        open={passModal}
        onClose={() => setPassModal(false)}
        onSubmit={handleSavePass}
        form={form}
        setForm={setForm}
      />

      <PrintPassDialog
        pass={printPass}
        onClose={() => setPrintPass(null)}
        fmtDT={fmtDT}
      />

    </div>
  );
}
