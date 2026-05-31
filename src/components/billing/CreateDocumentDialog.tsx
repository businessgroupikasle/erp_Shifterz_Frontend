"use client";

import { FileText, X } from "lucide-react";

interface DocForm {
  type: string; client: string; phone: string; vehicle: string; service: string;
  amount: number; gst: number; discount: number; status: string;
  date: string; dueDate: string; notes: string;
}
interface Props {
  open: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  form: DocForm; setForm: (f: DocForm) => void;
  services: { id: string; name: string; price: number }[];
  gstPct: number;
  onServiceChange: (name: string) => void;
  onBaseAmountChange: (amt: number) => void;
  fmt: (n: number) => string;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const cls = "px-3 py-2 rounded-lg text-sm border w-full";
const lbl = (t: string) => <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>{t}</label>;

export default function CreateDocumentDialog({ open, onClose, onSubmit, form, setForm, services, gstPct, onServiceChange, onBaseAmountChange, fmt }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
      <div className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <FileText size={18} style={{ color: "var(--accent)" }} /> Create Document
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">{lbl("Document Type")}
              <select value={form.type} style={S} onChange={e => setForm({ ...form, type: e.target.value })} className={cls}>
                <option value="Invoice">Tax Invoice</option>
                <option value="Quotation">Quotation</option>
                <option value="Proforma">Proforma Invoice</option>
                <option value="Estimate">Estimate</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Client Name *")}
              <input type="text" placeholder="Full Name" value={form.client} required style={S}
                onChange={e => setForm({ ...form, client: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Client Phone")}
              <input type="text" placeholder="98765 43210" value={form.phone} style={S}
                onChange={e => setForm({ ...form, phone: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Vehicle Registration")}
              <input type="text" placeholder="TN 04 AB 1234" value={form.vehicle} style={S}
                onChange={e => setForm({ ...form, vehicle: e.target.value.toUpperCase() })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Service Selection *")}
              <select value={form.service} style={S} onChange={e => onServiceChange(e.target.value)} className={cls}>
                {services.map(s => <option key={s.id} value={s.name}>{s.name} ({fmt(s.price)})</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Base Amount *")}
              <input type="number" placeholder="Price" value={form.amount || ""} required style={S}
                onChange={e => onBaseAmountChange(Number(e.target.value))} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl(`GST (${gstPct}%)`)}
              <input type="number" readOnly value={form.gst} style={S} className={`${cls} opacity-60 cursor-not-allowed`} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Discount (INR)")}
              <input type="number" placeholder="Discount" value={form.discount || ""} style={S}
                onChange={e => setForm({ ...form, discount: Number(e.target.value) })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Issue Date")}
              <input type="date" value={form.date} style={S}
                onChange={e => setForm({ ...form, date: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Due Date")}
              <input type="date" value={form.dueDate} style={S}
                onChange={e => setForm({ ...form, dueDate: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Status")}
              <select value={form.status} style={S} onChange={e => setForm({ ...form, status: e.target.value })} className={cls}>
                {["Pending","Paid","Approved","Overdue"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">{lbl("Billing Notes")}
              <textarea placeholder="Terms and conditions, payment info..." value={form.notes} rows={3}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className={`${cls} resize-none`} style={S} />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                Create Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
