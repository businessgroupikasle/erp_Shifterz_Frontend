"use client";

import { CreditCard, X, Check } from "lucide-react";

interface PayForm { invoiceId: string; amount: number; mode: string; ref: string; date: string; notes: string; }
interface Props {
  open: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  form: PayForm; setForm: (f: PayForm) => void;
  pendingInvoices: any[]; onInvoiceChange: (id: string) => void;
  fmt: (n: number) => string;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const cls = "px-3 py-2 rounded-lg text-sm border w-full";
const lbl = (t: string) => <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>{t}</label>;

export default function RecordPaymentDialog({ open, onClose, onSubmit, form, setForm, pendingInvoices, onInvoiceChange, fmt }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <CreditCard size={18} style={{ color: "var(--accent)" }} /> Record Payment Receipt
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          {pendingInvoices.length === 0 ? (
            <div className="text-center py-6 flex flex-col items-center gap-2">
              <Check size={32} style={{ color: "var(--success)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>All invoices are fully paid!</span>
              <span className="text-xs" style={{ color: "var(--text3)" }}>No outstanding billing dues found.</span>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">{lbl("Select Pending Invoice *")}
                <select value={form.invoiceId} style={S} onChange={e => onInvoiceChange(e.target.value)} className={cls}>
                  {pendingInvoices.map(inv => {
                    const total = inv.amount + inv.gst - inv.discount;
                    return <option key={inv.id} value={inv.id}>{inv.id} — {inv.client} ({fmt(total)})</option>;
                  })}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Amount Received *")}
                <input type="number" value={form.amount || ""} required style={S}
                  onChange={e => setForm({ ...form, amount: Number(e.target.value) })} className={cls} />
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Payment Mode")}
                <select value={form.mode} style={S} onChange={e => setForm({ ...form, mode: e.target.value })} className={cls}>
                  <option value="UPI">UPI / GPay</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="BankTransfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Transaction / Bank Reference No")}
                <input type="text" placeholder="Ref: UPI-XXXXXX" value={form.ref} style={S}
                  onChange={e => setForm({ ...form, ref: e.target.value })} className={cls} />
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Receipt Date")}
                <input type="date" value={form.date} style={S}
                  onChange={e => setForm({ ...form, date: e.target.value })} className={cls} />
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Notes")}
                <textarea placeholder="Partial payment, cash received by front desk..." value={form.notes} rows={3}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className={`${cls} resize-none`} style={S} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                  style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                  Confirm Receipt
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
