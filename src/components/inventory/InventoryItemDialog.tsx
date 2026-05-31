"use client";

import { Boxes, X } from "lucide-react";

interface ItmForm { name: string; unit: string; category: string; stock: number; reorder: number; cost: number; supplier: string; location: string; }
interface Props {
  open: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
  form: ItmForm; setForm: (f: ItmForm) => void; isEdit: boolean;
}

const S = { background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text)" };
const cls = "px-3 py-2 rounded-lg text-sm border w-full";
const lbl = (t: string) => <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>{t}</label>;

export default function InventoryItemDialog({ open, onClose, onSubmit, form, setForm, isEdit }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Boxes size={18} style={{ color: "var(--accent)" }} /> {isEdit ? "Edit Inventory Item" : "Add Stock Item"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: "var(--text3)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">{lbl("Item Name *")}
              <input type="text" placeholder="XPEL PPF Film 50ft" value={form.name} required style={S}
                onChange={e => setForm({ ...form, name: e.target.value })} className={cls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">{lbl("Measuring Unit")}
                <select value={form.unit} style={S} onChange={e => setForm({ ...form, unit: e.target.value })} className={cls}>
                  {["Meter","Piece","Kit","Litre","Bottle"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Category")}
                <select value={form.category} style={S} onChange={e => setForm({ ...form, category: e.target.value })} className={cls}>
                  <option value="PPF">PPF Films</option>
                  <option value="Coating">Coatings</option>
                  <option value="Consumable">Consumables</option>
                  <option value="Chemical">Chemicals</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">{lbl("Available Stock *")}
                <input type="number" placeholder="25" value={form.stock || ""} required style={S}
                  onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className={cls} />
              </div>
              <div className="flex flex-col gap-1.5">{lbl("Reorder Threshold *")}
                <input type="number" placeholder="5" value={form.reorder || ""} required style={S}
                  onChange={e => setForm({ ...form, reorder: Number(e.target.value) })} className={cls} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Cost Price (Per Unit)")}
              <input type="number" placeholder="850" value={form.cost || ""} style={S}
                onChange={e => setForm({ ...form, cost: Number(e.target.value) })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Supplier Name")}
              <input type="text" placeholder="XPEL India Pvt Ltd" value={form.supplier} style={S}
                onChange={e => setForm({ ...form, supplier: e.target.value })} className={cls} />
            </div>
            <div className="flex flex-col gap-1.5">{lbl("Storage Rack / Location")}
              <input type="text" placeholder="Rack A1" value={form.location} style={S}
                onChange={e => setForm({ ...form, location: e.target.value })} className={cls} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer"
                style={{ background: "var(--bg3)", borderColor: "var(--border2)", color: "var(--text2)" }}>Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer">
                {isEdit ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
