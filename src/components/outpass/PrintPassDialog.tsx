"use client";

import { Printer, X } from "lucide-react";

interface Props {
  pass: any | null;
  onClose: () => void;
  fmtDT: (s: string) => string;
}

export default function PrintPassDialog({ pass, onClose, fmtDT }: Props) {
  if (!pass) return null;
  return (
    <div className="fixed inset-0 bg-black/85 z-[999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex items-center justify-between text-white no-print">
          <h3 className="font-bold text-sm">Gate Pass Print Preview</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-yellow-500 text-black font-extrabold cursor-pointer text-xs">
              <Printer size={14} /> Print Now
            </button>
            <button onClick={onClose} className="p-2 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="print-card rounded-2xl border p-6 flex flex-col gap-6 shadow-2xl modal-animate"
          style={{ background: "var(--bg2)", borderColor: "var(--accent)" }}>
          <div className="text-center border-b pb-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-2xl font-extrabold text-[var(--accent)] tracking-widest" style={{ fontFamily: "var(--font-syne)" }}>
              SHIFTERZ
            </h2>
            <span className="text-[9px] uppercase tracking-wider text-[var(--text3)]">Race Course Rd, Coimbatore</span>
            <h3 className="text-sm font-bold mt-3 text-white uppercase tracking-widest">Vehicle Gate Pass</h3>
            <span className="font-mono text-xs opacity-60">Pass No: {pass.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {[
              ["Vehicle No", pass.vehicle],
              ["Car Model", pass.model || "—"],
              ["Customer", pass.customer],
              ["Phone", pass.phone || "—"],
            ].map(([label, value]) => (
              <div key={label} className="p-3 border rounded-xl" style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
                <div className="text-[9px] uppercase font-bold text-[var(--text3)]">{label}</div>
                <div className="font-bold text-sm mt-0.5">{value}</div>
              </div>
            ))}
            <div className="p-3 border rounded-xl col-span-2" style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
              <div className="text-[9px] uppercase font-bold text-[var(--text3)]">Service Done</div>
              <div className="font-semibold mt-0.5">{pass.service || "—"}</div>
            </div>
            <div className="p-3 border rounded-xl" style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
              <div className="text-[9px] uppercase font-bold text-[var(--text3)]">Date & Time</div>
              <div className="mt-0.5">{fmtDT(pass.outTime)}</div>
            </div>
            <div className="p-3 border rounded-xl" style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
              <div className="text-[9px] uppercase font-bold text-[var(--text3)]">Security Gate</div>
              <div className="mt-0.5">{pass.securityName || "—"}</div>
            </div>
          </div>

          {pass.remarks && (
            <div className="p-3 border rounded-xl text-xs" style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
              <div className="text-[9px] uppercase font-bold text-[var(--text3)]">Remarks</div>
              <p className="mt-0.5 italic opacity-85">{pass.remarks}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-center mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <div>
              <div className="h-10" />
              <span className="text-[10px] uppercase font-semibold text-[var(--text3)] border-t pt-1.5 block">Authorised Signature</span>
            </div>
            <div>
              <div className="h-10" />
              <span className="text-[10px] uppercase font-semibold text-[var(--text3)] border-t pt-1.5 block">Customer Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
