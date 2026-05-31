"use client";

import { UserPlus, X } from "lucide-react";

interface LeadForm {
  name: string; phone: string; email: string; source: string;
  service: string; vehicle: string; assignedTo: string;
  status: string; notes: string; budget: string; date: string;
}
interface Props {
  open: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  form: LeadForm; setForm: (f: LeadForm) => void;
  services: { id: string; name: string }[]; agents: string[]; isEdit: boolean;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const lbl = (t: string) => <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>{t}</label>;

export default function LeadDialog({ open, onClose, onSubmit, form, setForm, services, agents, isEdit }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <UserPlus size={18} style={{ color: "var(--accent)" }} /> {isEdit ? "Edit Lead" : "New Lead Details"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">{lbl("Lead Name *")}
              <input type="text" placeholder="Ramesh Kumar" value={form.name} required style={S}
                onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg text-sm border w-full" />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Phone Number")}
              <input type="text" placeholder="98765 43210" value={form.phone} style={S}
                onChange={e => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 rounded-lg text-sm border w-full" />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Email")}
              <input type="email" placeholder="client@mail.com" value={form.email} style={S}
                onChange={e => setForm({ ...form, email: e.target.value })} className="px-3 py-2 rounded-lg text-sm border w-full" />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Lead Source")}
              <select value={form.source} style={S} onChange={e => setForm({ ...form, source: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border w-full">
                {["JustDial","Instagram","Facebook","Referral","Walk-in"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Service *")}
              <select value={form.service} style={S} onChange={e => setForm({ ...form, service: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border w-full">
                {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Budget (INR)")}
              <input type="number" placeholder="30000" value={form.budget} style={S}
                onChange={e => setForm({ ...form, budget: e.target.value })} className="px-3 py-2 rounded-lg text-sm border w-full" />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Vehicle Registration")}
              <input type="text" placeholder="TN 04 AB 1234" value={form.vehicle} style={S}
                onChange={e => setForm({ ...form, vehicle: e.target.value.toUpperCase() })} className="px-3 py-2 rounded-lg text-sm border w-full" />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Assigned Agent")}
              <select value={form.assignedTo} style={S} onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border w-full">
                {agents.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Pipeline Stage")}
              <select value={form.status} style={S} onChange={e => setForm({ ...form, status: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border w-full">
                {["New","Follow Up","Closed","Lost"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Created Date")}
              <input type="date" value={form.date} style={S}
                onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-lg text-sm border w-full" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">{lbl("Interaction Log / Sales Notes")}
              <textarea placeholder="Wants full body PPF + alloy wheel coating package..." value={form.notes} rows={3}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border w-full resize-none" style={S} />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                {isEdit ? "Save Changes" : "Create Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
