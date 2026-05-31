"use client";

import { Wrench, X } from "lucide-react";

interface SvcForm { name: string; category: string; price: number; duration: string; warranty: string; desc: string; }
interface Props {
  open: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  form: SvcForm; setForm: (f: SvcForm) => void; isEdit: boolean;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const cls = "px-3 py-2 rounded-lg text-sm border w-full";
const lbl = (t: string) => <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>{t}</label>;

export default function ServiceDialog({ open, onClose, onSubmit, form, setForm, isEdit }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Wrench size={18} style={{ color: "var(--accent)" }} /> {isEdit ? "Edit Service" : "Add Service"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">{lbl("Service Name *")}
              <input type="text" placeholder="Ceramic Pro 9H" value={form.name} required style={S}
                onChange={e => setForm({ ...form, name: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Category")}
              <select value={form.category} style={S} onChange={e => setForm({ ...form, category: e.target.value })} className={cls}>
                <option value="PPF">PPF Paint Protection</option>
                <option value="Coating">Ceramic & Graphene Coatings</option>
                <option value="Detailing">Detailing & Polish</option>
                <option value="Add-on">Add-ons (Tint, Glass, etc)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Price (INR) *")}
              <input type="number" placeholder="22000" value={form.price || ""} required style={S}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Time Duration")}
              <input type="text" placeholder="e.g. 1 day, 4 hours" value={form.duration} style={S}
                onChange={e => setForm({ ...form, duration: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Warranty Cover")}
              <input type="text" placeholder="e.g. 5 years, —" value={form.warranty} style={S}
                onChange={e => setForm({ ...form, warranty: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Service Description")}
              <textarea placeholder="Detailed parameters of work..." value={form.desc} rows={3}
                onChange={e => setForm({ ...form, desc: e.target.value })}
                className={`${cls} resize-none`} style={S} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                {isEdit ? "Save Package" : "Create Package"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
