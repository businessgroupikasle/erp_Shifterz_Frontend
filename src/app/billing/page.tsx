"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import {
  FileText,
  Plus,
  Search,
  Printer,
  CreditCard,
  Percent,
  TrendingUp,
} from "lucide-react";
import CreateDocumentDialog from "@/components/billing/CreateDocumentDialog";
import PrintDocumentDialog from "@/components/billing/PrintDocumentDialog";

export default function Billing() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ gstPct: 18 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Modals
  const [docModal, setDocModal] = useState(false);
  const [printDoc, setPrintDoc] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    type: "Invoice",
    client: "",
    phone: "",
    vehicle: "",
    service: "",
    amount: 0,
    gst: 0,
    discount: 0,
    status: "Pending",
    date: "",
    dueDate: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      const [invData, svcsData, settingsData] = await Promise.all([
        api.getInvoices(),
        api.getServices(),
        api.getSettings(),
      ]);
      setInvoices(invData);
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

  useEffect(() => {
    if (services.length > 0) {
      const prefillStr = sessionStorage.getItem("prefill_invoice");
      if (prefillStr) {
        try {
          const prefill = JSON.parse(prefillStr);
          sessionStorage.removeItem("prefill_invoice");
          const price = prefill.amount || 0;
          const gstVal = Math.round((price * (settings.gstPct || 18)) / 100);

          setForm({
            type: "Invoice",
            client: prefill.client || "",
            phone: prefill.phone || "",
            vehicle: prefill.vehicle || "",
            service: prefill.service || services[0]?.name || "",
            amount: price,
            gst: gstVal,
            discount: 0,
            status: "Pending",
            date: new Date().toISOString().slice(0, 10),
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
            notes: "Prefilled from CRM Lead conversion",
          });
          setDocModal(true);
        } catch (err) {
          console.error("Error parsing prefill_invoice:", err);
        }
      }
    }
  }, [services, settings]);

  const handleBaseAmountChange = (amt: number) => {
    const gstVal = Math.round((amt * (settings.gstPct || 18)) / 100);
    setForm(prev => ({
      ...prev,
      amount: amt,
      gst: gstVal,
    }));
  };

  const handleServiceChange = (svcName: string) => {
    const selectedSvc = services.find(s => s.name === svcName);
    const price = selectedSvc ? selectedSvc.price : 0;
    const gstVal = Math.round((price * (settings.gstPct || 18)) / 100);
    setForm(prev => ({
      ...prev,
      service: svcName,
      amount: price,
      gst: gstVal,
    }));
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client || !form.service || form.amount <= 0) {
      alert("Client, Service, and Base Amount are required!");
      return;
    }
    try {
      await api.createInvoice(form);
      setDocModal(false);
      setForm({
        type: "Invoice",
        client: "",
        phone: "",
        vehicle: "",
        service: services[0]?.name || "",
        amount: 0,
        gst: 0,
        discount: 0,
        status: "Pending",
        date: "",
        dueDate: "",
        notes: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create document.");
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Paid":
        return "bg-green-500/10 text-green-400";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400";
      case "Approved":
        return "bg-blue-500/10 text-blue-400";
      case "Overdue":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-neutral-500/10 text-neutral-400";
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

  const filtered = invoices.filter(i => {
    const matchSearch =
      i.client.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      (i.vehicle && i.vehicle.toLowerCase().includes(search.toLowerCase()));
    const matchType = !typeFilter || i.type === typeFilter;
    return matchSearch && matchType;
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
            <FileText className="text-[var(--accent)]" size={22} /> Invoices & Estimates
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Generate client tax invoices, print custom quotations, and track accounts receivable.</p>
        </div>
        <button
          onClick={() => {
            setForm({
              type: "Invoice",
              client: "",
              phone: "",
              vehicle: "",
              service: services[0]?.name || "",
              amount: services[0]?.price || 0,
              gst: Math.round(((services[0]?.price || 0) * (settings.gstPct || 18)) / 100),
              discount: 0,
              status: "Pending",
              date: new Date().toISOString().slice(0, 10),
              dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
              notes: "",
            });
            setDocModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> Create Document
        </button>
      </div>

      {/* Overview stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div
          className="relative overflow-hidden rounded-2xl p-4 border shadow-sm"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
            Paid Invoices
          </span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {invoices.filter(i => i.status === "Paid").length} completed
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl p-4 border shadow-sm"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
            Pending / Outstanding
          </span>
          <div className="text-xl font-extrabold text-amber-500 mt-1">
            {invoices.filter(i => i.status === "Pending").length} waiting
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl p-4 border shadow-sm"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
            Overdue Accounts
          </span>
          <div className="text-xl font-extrabold text-red-500 mt-1">
            {invoices.filter(i => i.status === "Overdue").length} warnings
          </div>
        </div>
      </div>

      {/* Invoice Register Table */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl no-print"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Billing Register</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">Directory of all client transactions.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
              <input
                type="text"
                placeholder="Search Client, doc ID, plate..."
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
            {/* Doc Type filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs border"
              style={{
                background: "var(--bg3)",
                borderColor: "var(--border2)",
                color: "var(--text)",
              }}
            >
              <option value="">All Document Types</option>
              <option value="Invoice">Invoice</option>
              <option value="Quotation">Quotation</option>
              <option value="Proforma">Proforma</option>
              <option value="Estimate">Estimate</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[800px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Doc ID / Type
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Client Info
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Vehicle & Service
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Total (Tax Inc)
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Issue / Due Date
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Status
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(doc => {
                const total = doc.amount + doc.gst - doc.discount;
                const statusClass =
                  doc.status === "Paid"
                    ? "badge-success"
                    : doc.status === "Pending"
                    ? "badge-warn"
                    : doc.status === "Approved"
                    ? "badge-info"
                    : "badge-danger";
                return (
                  <tr key={doc.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold block text-[var(--accent)]">{doc.id}</span>
                      <span className="text-[8px] uppercase font-extrabold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--text2)] mt-1.5 inline-block">
                        {doc.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-sm text-white">{doc.client}</div>
                      <div className="text-[var(--text3)] text-[10px] font-medium mt-0.5">{doc.phone}</div>
                    </td>
                    <td className="p-4 text-xs text-white font-medium">
                      <div className="font-extrabold uppercase tracking-wide">{doc.vehicle || "—"}</div>
                      <div className="text-[var(--text2)] text-[11px] font-semibold mt-0.5">{doc.service}</div>
                    </td>
                    <td className="p-4 text-xs text-white">
                      <div className="font-extrabold text-emerald-400">{fmt(total)}</div>
                      <div className="text-[var(--text3)] text-[10px] font-normal mt-0.5">
                        Base: {fmt(doc.amount)} · GST: {fmt(doc.gst)}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[var(--text2)]">
                      <div>Issue: <span className="text-white font-medium">{fmtDate(doc.date)}</span></div>
                      <div className="mt-0.5 text-[var(--text3)]">Due: {fmtDate(doc.dueDate)}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase ${statusClass}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setPrintDoc(doc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg3)] hover:bg-[var(--bg4)] border border-[var(--border2)] text-xs font-semibold transition-all cursor-pointer text-white"
                      >
                        <Printer size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CreateDocumentDialog
        open={docModal}
        onClose={() => setDocModal(false)}
        onSubmit={handleSaveDoc}
        form={form}
        setForm={setForm}
        services={services}
        gstPct={settings.gstPct || 18}
        onServiceChange={handleServiceChange}
        onBaseAmountChange={handleBaseAmountChange}
        fmt={fmt}
      />
      <PrintDocumentDialog
        doc={printDoc}
        onClose={() => setPrintDoc(null)}
        settings={settings}
        fmt={fmt}
        fmtDate={fmtDate}
      />
    </div>
  );
}
