"use client";

import { ClipboardList, X } from "lucide-react";

interface JobForm {
  vehicle: string; customer: string; service: string; technician: string;
  status: string; priority: string; startDate: string; estCompletion: string;
  actualCompletion: string; notes: string;
}
interface Props {
  open: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  form: JobForm; setForm: (f: JobForm) => void;
  services: { id: string; name: string }[]; technicians: string[]; isEdit: boolean;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const cls = "px-3 py-2 rounded-lg text-sm border w-full";
const lbl = (t: string) => <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>{t}</label>;

export default function JobCardDialog({ open, onClose, onSubmit, form, setForm, services, technicians, isEdit }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <ClipboardList size={18} style={{ color: "var(--accent)" }} /> {isEdit ? "Update Job Details" : "Create Job Card"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">{lbl("Vehicle Number *")}
              <input type="text" placeholder="TN 04 AB 1234" value={form.vehicle} required
                disabled={isEdit} style={S}
                onChange={e => setForm({ ...form, vehicle: e.target.value.toUpperCase() })}
                className={`${cls} disabled:opacity-50 disabled:cursor-not-allowed`} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Customer Name")}
              <input type="text" placeholder="Client Name" value={form.customer} disabled={isEdit} style={S}
                onChange={e => setForm({ ...form, customer: e.target.value })}
                className={`${cls} disabled:opacity-50 disabled:cursor-not-allowed`} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Service Selection *")}
              {isEdit ? (
                <input type="text" value={form.service} readOnly style={S} className={`${cls} opacity-60 cursor-not-allowed`} />
              ) : (
                <select value={form.service} style={S} onChange={e => setForm({ ...form, service: e.target.value })} className={cls}>
                  {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Assigned Technician")}
              <select value={form.technician} style={S} onChange={e => setForm({ ...form, technician: e.target.value })} className={cls}>
                {technicians.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Priority")}
              <select value={form.priority} style={S} onChange={e => setForm({ ...form, priority: e.target.value })} className={cls}>
                {["Low","Normal","High"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Job Status")}
              <select value={form.status} style={S} onChange={e => setForm({ ...form, status: e.target.value })} className={cls}>
                {["Pending","In Progress","Completed"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Start Date")}
              <input type="date" value={form.startDate} style={S}
                onChange={e => setForm({ ...form, startDate: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Estimated Completion")}
              <input type="date" value={form.estCompletion} style={S}
                onChange={e => setForm({ ...form, estCompletion: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">{lbl("Actual Completion Date (If Completed)")}
              <input type="date" value={form.actualCompletion} style={S}
                onChange={e => setForm({ ...form, actualCompletion: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">{lbl("Workshop Progress Notes")}
              <textarea placeholder="Stage 1: Paint correction completed..." value={form.notes} rows={3}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className={`${cls} resize-none`} style={S} />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                Save Job Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
