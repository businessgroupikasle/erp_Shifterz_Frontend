"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import {
  UserPlus,
  Plus,
  Search,
  Edit2,
  Phone,
  Mail,
  Filter,
  DollarSign,
  FileText,
} from "lucide-react";
import LeadDialog from "@/components/leads/LeadDialog";

export default function Leads() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ agents: [] });
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  // Modals
  const [leadModal, setLeadModal] = useState(false);
  const [editLead, setEditLead] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "JustDial",
    service: "",
    vehicle: "",
    assignedTo: "",
    status: "New",
    notes: "",
    budget: "",
    date: "",
  });

  const loadData = async () => {
    try {
      const [leadsData, svcsData, settingsData] = await Promise.all([
        api.getLeads(),
        api.getServices(),
        api.getSettings(),
      ]);
      setLeads(leadsData);
      setServices(svcsData);
      setSettings(settingsData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.service) {
      alert("Lead Name and Service are required!");
      return;
    }
    try {
      if (editLead) {
        await api.updateLead(editLead.id, form);
      } else {
        await api.createLead(form);
      }
      setLeadModal(false);
      setEditLead(null);
      setForm({
        name: "",
        phone: "",
        email: "",
        source: "JustDial",
        service: services[0]?.name || "",
        vehicle: "",
        assignedTo: settings.agents[0] || "",
        status: "New",
        notes: "",
        budget: "",
        date: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save lead.");
    }
  };

  const handleEditTrigger = (lead: any) => {
    setEditLead(lead);
    setForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      service: lead.service,
      vehicle: lead.vehicle,
      assignedTo: lead.assignedTo,
      status: lead.status,
      notes: lead.notes,
      budget: lead.budget,
      date: lead.date,
    });
    setLeadModal(true);
  };

  const handleConvertToInvoice = (lead: any) => {
    sessionStorage.setItem(
      "prefill_invoice",
      JSON.stringify({
        client: lead.name,
        phone: lead.phone,
        vehicle: lead.vehicle || "",
        service: lead.service || "",
        amount: Number(lead.budget) || 0,
      })
    );
    router.push("/billing");
  };

  const getBadgeClass = (s: string) => {
    switch (s) {
      case "New":
        return "bg-blue-500/10 text-blue-400";
      case "Follow Up":
        return "bg-yellow-500/10 text-yellow-400";
      case "Closed":
        return "bg-green-500/10 text-green-400";
      case "Lost":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-neutral-500/10 text-neutral-400";
    }
  };

  const fmt = (n: any) => "₹" + Number(n || 0).toLocaleString("en-IN");

  const filtered = leads.filter(l => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.toLowerCase().includes(search.toLowerCase()) ||
      (l.vehicle && l.vehicle.toLowerCase().includes(search.toLowerCase()));
    const matchStage = !stageFilter || l.status === stageFilter;
    return matchSearch && matchStage;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--accent)]" />
      </div>
    );
  }  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-dashed pb-4" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-syne)" }}>
            <UserPlus className="text-[var(--accent)]" size={22} /> Leads Pipeline
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Manage CRM pipeline, follow up with potential detaling clients, and track sales performance.</p>
        </div>
        <button
          onClick={() => {
            setEditLead(null);
            setForm({
              name: "",
              phone: "",
              email: "",
              source: "Walk-in",
              service: services[0]?.name || "",
              vehicle: "",
              assignedTo: settings.agents[0] || "",
              status: "New",
              notes: "",
              budget: "",
              date: new Date().toISOString().slice(0, 10),
            });
            setLeadModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> New Lead
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                New Leads
              </span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1 tracking-tight">
                {leads.filter(l => l.status === "New").length} leads
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <UserPlus size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Fresh inquiries incoming</span>
        </div>

        {/* Stat 2 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Active Follow Ups
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {leads.filter(l => l.status === "Follow Up").length} contacts
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <Phone size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Negotiations ongoing</span>
        </div>

        {/* Stat 3 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Closed Deals
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                {leads.filter(l => l.status === "Closed").length} completed
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <DollarSign size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Closed jobs won</span>
        </div>
      </div>

      {/* CRM Leads Table Card */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Pipeline Contacts</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">Directory of active sales conversations.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
              <input
                type="text"
                placeholder="Search name, phone, plate..."
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
            {/* Status Select */}
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs border"
              style={{
                background: "var(--bg3)",
                borderColor: "var(--border2)",
                color: "var(--text)",
              }}
            >
              <option value="">All Stages</option>
              <option value="New">New</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[800px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Lead Name
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Contact
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Source / Date
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Service / Budget
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Vehicle
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Assignee
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Stage
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(lead => {
                const statusClass =
                  lead.status === "New"
                    ? "badge-info"
                    : lead.status === "Follow Up"
                    ? "badge-warn"
                    : lead.status === "Closed"
                    ? "badge-success"
                    : "badge-danger";
                return (
                  <tr key={lead.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                    <td className="p-4 font-extrabold text-sm text-white">{lead.name}</td>
                    <td className="p-4 text-xs font-semibold text-white">
                      <div className="flex items-center gap-1">
                        <Phone size={10} className="text-[var(--text3)]" /> {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1 mt-0.5 text-[var(--text3)] font-medium">
                          <Mail size={10} /> {lead.email}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs text-white font-semibold">
                      <div className="text-[var(--accent)]">{lead.source}</div>
                      <div className="text-[var(--text3)] text-[10px] font-medium mt-0.5">{lead.date}</div>
                    </td>
                    <td className="p-4 text-xs text-white">
                      <div className="font-extrabold">{lead.service}</div>
                      <div className="text-emerald-400 font-extrabold mt-0.5">{fmt(lead.budget)}</div>
                    </td>
                    <td className="p-4 text-xs font-mono font-bold uppercase text-white">{lead.vehicle || "—"}</td>
                    <td className="p-4 text-xs text-[var(--text2)] font-medium">{lead.assignedTo || "—"}</td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase ${statusClass}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTrigger(lead)}
                          className="p-1.5 rounded hover:bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--text)] transition-colors cursor-pointer"
                          title="Edit Lead"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleConvertToInvoice(lead)}
                          className="p-1.5 rounded hover:bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                          title="Convert to Invoice"
                        >
                          <FileText size={14} />
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

      <LeadDialog
        open={leadModal}
        onClose={() => setLeadModal(false)}
        onSubmit={handleSaveLead}
        form={form}
        setForm={setForm}
        services={services}
        agents={settings.agents}
        isEdit={!!editLead}
      />
    </div>
  );
}
