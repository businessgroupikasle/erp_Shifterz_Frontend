"use client";

import { Building, X } from "lucide-react";

interface FranForm {
  name: string; city: string; owner: string; phone: string; since: string;
  revenue: number; jobs: number; royaltyPct: number; status: string;
}
interface Props {
  open: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  form: FranForm; setForm: (f: FranForm) => void;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const cls = "px-3 py-2 rounded-lg text-sm border w-full";
const lbl = (t: string) => <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>{t}</label>;

export default function FranchiseDialog({ open, onClose, onSubmit, form, setForm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Building size={18} style={{ color: "var(--accent)" }} /> Add Franchise Branch
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">{lbl("Store Name *")}
              <input type="text" placeholder="Shifterz Chennai" value={form.name} required style={S}
                onChange={e => setForm({ ...form, name: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("City Location *")}
              <input type="text" placeholder="Chennai" value={form.city} required style={S}
                onChange={e => setForm({ ...form, city: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Owner Full Name *")}
              <input type="text" placeholder="Balaji S" value={form.owner} required style={S}
                onChange={e => setForm({ ...form, owner: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Phone Number")}
              <input type="text" placeholder="98400 11111" value={form.phone} style={S}
                onChange={e => setForm({ ...form, phone: e.target.value })} className={cls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">{lbl("Monthly Revenue (INR)")}
                <input type="number" placeholder="250000" value={form.revenue || ""} style={S}
                  onChange={e => setForm({ ...form, revenue: Number(e.target.value) })} className={cls} />
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Jobs Completed")}
                <input type="number" placeholder="30" value={form.jobs || ""} style={S}
                  onChange={e => setForm({ ...form, jobs: Number(e.target.value) })} className={cls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">{lbl("Royalty %")}
                <input type="number" placeholder="5" value={form.royaltyPct} style={S}
                  onChange={e => setForm({ ...form, royaltyPct: Number(e.target.value) })} className={cls} />
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Branch Status")}
                <select value={form.status} style={S} onChange={e => setForm({ ...form, status: e.target.value })} className={cls}>
                  <option value="Active">Active</option>
                  <option value="Trial">Trial Period</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Since Date")}
              <input type="date" value={form.since} style={S}
                onChange={e => setForm({ ...form, since: e.target.value })} className={cls} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                Create Branch
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
