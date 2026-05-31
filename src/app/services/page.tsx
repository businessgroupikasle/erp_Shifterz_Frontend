"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Wrench, Plus, Search, Edit2, Trash2, Clock, Award } from "lucide-react";
import ServiceDialog from "@/components/services/ServiceDialog";

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modals
  const [svcModal, setSvcModal] = useState(false);
  const [editSvc, setEditSvc] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    category: "PPF",
    price: 0,
    duration: "",
    warranty: "",
    desc: "",
  });

  const loadData = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSvc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price <= 0) {
      alert("Service Name and Price are required!");
      return;
    }
    try {
      if (editSvc) {
        await api.updateService(editSvc.id, form);
      } else {
        await api.createService(form);
      }
      setSvcModal(false);
      setEditSvc(null);
      setForm({
        name: "",
        category: "PPF",
        price: 0,
        duration: "",
        warranty: "",
        desc: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save service.");
    }
  };

  const handleEditTrigger = (svc: any) => {
    setEditSvc(svc);
    setForm({
      name: svc.name,
      category: svc.category,
      price: svc.price,
      duration: svc.duration,
      warranty: svc.warranty,
      desc: svc.desc,
    });
    setSvcModal(true);
  };

  const handleDeleteSvc = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.deleteService(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete service.");
    }
  };

  const fmt = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

  const filtered = services.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

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
            <Wrench className="text-[var(--accent)]" size={22} /> Service Packages
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Manage paint protection films, detailing rates, and warranty parameters.</p>
        </div>
        <button
          onClick={() => {
            setEditSvc(null);
            setForm({
              name: "",
              category: "PPF",
              price: 0,
              duration: "1 day",
              warranty: "10 years",
              desc: "",
            });
            setSvcModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> New Service Package
        </button>
      </div>

      {/* Services Table Card */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Service Catalog</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">List of active workshop offerings and pricing.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
              <input
                type="text"
                placeholder="Search service name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-xs w-full sm:w-60 border"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>
            {/* Category select */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs border"
              style={{
                background: "var(--bg3)",
                borderColor: "var(--border2)",
                color: "var(--text)",
              }}
            >
              <option value="">All Categories</option>
              <option value="PPF">PPF</option>
              <option value="Coating">Coating</option>
              <option value="Detailing">Detailing</option>
              <option value="Add-on">Add-on</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[800px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Service ID
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Service Name
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Category
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Standard Price
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Time & Warranty
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Description
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(svc => {
                const categoryClass =
                  svc.category === "PPF"
                    ? "badge-info"
                    : svc.category === "Coating"
                    ? "badge-success"
                    : svc.category === "Detailing"
                    ? "badge-warn"
                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20";
                return (
                  <tr key={svc.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs text-[var(--text3)]">{svc.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-sm text-white">{svc.name}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase ${categoryClass}`}>
                        {svc.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-extrabold text-[var(--accent)]">{fmt(svc.price)}</td>
                    <td className="p-4 text-xs text-[var(--text2)]">
                      <div className="flex items-center gap-1 font-medium text-white">
                        <Clock size={12} className="text-[var(--text3)]" /> {svc.duration}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-[var(--accent)]">
                        <Award size={12} className="text-[var(--text3)]" /> {svc.warranty}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[var(--text2)] max-w-xs truncate">{svc.desc || "—"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTrigger(svc)}
                          className="p-1.5 rounded hover:bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--text)] transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteSvc(svc.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceDialog
        open={svcModal}
        onClose={() => setSvcModal(false)}
        onSubmit={handleSaveSvc}
        form={form}
        setForm={setForm}
        isEdit={!!editSvc}
      />
    </div>
  );
}
