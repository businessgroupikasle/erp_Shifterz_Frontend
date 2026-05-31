"use client";

import { FileCheck2, X } from "lucide-react";

interface OutPassForm {
  id: string; vehicle: string; model: string; customer: string;
  phone: string; service: string; technicianName: string;
  securityName: string; outTime: string; remarks: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: OutPassForm;
  setForm: (f: OutPassForm) => void;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const cls = "px-3 py-2 rounded-lg text-sm border w-full";
const lbl = (t: string, req = false) => (
  <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
    {t}{req && " *"}
  </label>
);

export default function NewOutPassDialog({ open, onClose, onSubmit, form, setForm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
      <div className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <FileCheck2 size={18} style={{ color: "var(--accent)" }} /> New Out Pass
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">{lbl("Vehicle Number", true)}
              <input type="text" placeholder="TN 04 XX 0000" value={form.vehicle} required
                onChange={e => setForm({ ...form, vehicle: e.target.value.toUpperCase() })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Car Model")}
              <input type="text" placeholder="Toyota Fortuner" value={form.model}
                onChange={e => setForm({ ...form, model: e.target.value })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Customer Name", true)}
              <input type="text" placeholder="Full Name" value={form.customer} required
                onChange={e => setForm({ ...form, customer: e.target.value })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Phone Number")}
              <input type="text" placeholder="98765 43210" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">{lbl("Service Done")}
              <input type="text" placeholder="PPF Full Body" value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Technician")}
              <input type="text" placeholder="Arjun" value={form.technicianName}
                onChange={e => setForm({ ...form, technicianName: e.target.value })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Security Officer")}
              <input type="text" placeholder="Security Name" value={form.securityName}
                onChange={e => setForm({ ...form, securityName: e.target.value })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">{lbl("Gate Out Time")}
              <input type="datetime-local" value={form.outTime}
                onChange={e => setForm({ ...form, outTime: e.target.value })} className={cls} style={S} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">{lbl("Remarks / Accessories Checked")}
              <textarea placeholder="All clear, toolkit checked, washed..." value={form.remarks} rows={3}
                onChange={e => setForm({ ...form, remarks: e.target.value })} className={`${cls} resize-none`} style={S} />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                Issue Pass
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
