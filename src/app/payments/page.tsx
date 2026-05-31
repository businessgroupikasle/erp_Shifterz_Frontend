"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { CreditCard, Plus, Search, Printer } from "lucide-react";
import RecordPaymentDialog from "@/components/payments/RecordPaymentDialog";
import PrintReceiptDialog from "@/components/payments/PrintReceiptDialog";

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ companyName: "Shifterz" });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [payModal, setPayModal] = useState(false);
  const [printReceipt, setPrintReceipt] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    invoiceId: "",
    amount: 0,
    mode: "UPI",
    ref: "",
    date: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      const [paysData, invsData, settingsData] = await Promise.all([
        api.getPayments(),
        api.getInvoices(),
        api.getSettings(),
      ]);
      setPayments(paysData);
      setInvoices(invsData);
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

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.invoiceId || form.amount <= 0) {
      alert("Invoice selection and Payment Amount are required!");
      return;
    }
    try {
      await api.createPayment(form);
      setPayModal(false);
      setForm({
        invoiceId: "",
        amount: 0,
        mode: "UPI",
        ref: "",
        date: "",
        notes: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to record payment.");
    }
  };

  const getPendingInvoices = () => {
    return invoices.filter(i => i.status === "Pending" || i.status === "Overdue" || i.status === "Approved");
  };

  const handleInvoiceChange = (invId: string) => {
    const selectedInv = invoices.find(i => i.id === invId);
    const balance = selectedInv ? selectedInv.amount + selectedInv.gst - selectedInv.discount : 0;
    setForm(prev => ({
      ...prev,
      invoiceId: invId,
      amount: balance,
    }));
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

  const filtered = payments.filter(
    p =>
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
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
            <CreditCard className="text-[var(--accent)]" size={22} /> Payments & Receipts
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Track daily cash flows, record customer payments, and view UPI/card transaction lists.</p>
        </div>
        <button
          onClick={() => {
            const pending = getPendingInvoices();
            setForm({
              invoiceId: pending[0]?.id || "",
              amount: pending[0] ? pending[0].amount + pending[0].gst - pending[0].discount : 0,
              mode: "UPI",
              ref: "",
              date: new Date().toISOString().slice(0, 10),
              notes: "",
            });
            setPayModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> Record Payment
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        <div
          className="relative overflow-hidden rounded-2xl p-4 border shadow-sm"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
            Total Revenue Collected
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {fmt(payments.reduce((sum, p) => sum + p.amount, 0))}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl p-4 border shadow-sm"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
            Transactions Logged
          </span>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">
            {payments.length} successful receipts
          </div>
        </div>
      </div>

      {/* Table register */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Receipt History</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">History of successful payment logs.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
            <input
              type="text"
              placeholder="Search Client, Ref ID, Invoice..."
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
                  Payment ID
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Invoice ID
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Client Info
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Amount
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Payment Mode
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Date
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Reference No.
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(pay => (
                <tr key={pay.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-white">{pay.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs text-[var(--accent)] font-extrabold">{pay.invoiceId}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-extrabold text-sm text-white">{pay.client}</div>
                  </td>
                  <td className="p-4 text-xs font-extrabold text-emerald-400">{fmt(pay.amount)}</td>
                  <td className="p-4">
                    <span className="text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase bg-white/5 border border-white/10 text-[var(--text2)]">
                      {pay.mode}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[var(--text2)] font-medium">{fmtDate(pay.date)}</td>
                  <td className="p-4">
                    <span className="font-mono text-xs text-white/70">{pay.ref || "—"}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setPrintReceipt(pay)}
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

      <RecordPaymentDialog
        open={payModal}
        onClose={() => setPayModal(false)}
        onSubmit={handleSavePayment}
        form={form}
        setForm={setForm}
        pendingInvoices={getPendingInvoices()}
        onInvoiceChange={handleInvoiceChange}
        fmt={fmt}
      />
      <PrintReceiptDialog
        receipt={printReceipt}
        onClose={() => setPrintReceipt(null)}
        settings={settings}
        fmt={fmt}
        fmtDate={fmtDate}
      />
    </div>
  );
}
