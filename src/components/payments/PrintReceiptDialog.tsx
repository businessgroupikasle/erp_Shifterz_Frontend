"use client";

import { Printer, X } from "lucide-react";

interface Props {
  receipt: any | null;
  onClose: () => void;
  settings: any;
  fmt: (n: number) => string;
  fmtDate: (s: string) => string;
}

export default function PrintReceiptDialog({ receipt, onClose, settings, fmt, fmtDate }: Props) {
  if (!receipt) return null;
  const rows = [
    ["Client Name:", receipt.client],
    ["Invoice Reference:", receipt.invoiceId],
    ["Amount Received:", fmt(receipt.amount)],
    ["Payment Mode:", receipt.mode],
    ["Receipt Date:", fmtDate(receipt.date)],
    ["Reference No:", receipt.ref || "—"],
  ];
  return (
    <div className="fixed inset-0 bg-black/85 z-[999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex items-center justify-between text-white no-print">
          <h3 className="font-bold text-sm">Receipt Print Preview</h3>
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
              {settings.companyName || "SHIFTERZ"}
            </h2>
            <span className="text-[9px] uppercase tracking-wider text-[var(--text3)]">
              {settings.address || "Race Course Rd, Coimbatore"}
            </span>
            <h3 className="text-sm font-bold mt-3 text-white uppercase tracking-widest">Payment Receipt</h3>
            <span className="font-mono text-xs opacity-60">Receipt No: {receipt.id}</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--text3)" }}>{k}</span>
                <strong style={{ color: "var(--text)" }}>{v}</strong>
              </div>
            ))}
          </div>

          {receipt.notes && (
            <div className="p-3 border rounded-xl text-xs" style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
              <div className="text-[9px] uppercase font-bold text-[var(--text3)]">Notes</div>
              <p className="mt-0.5 italic opacity-85">{receipt.notes}</p>
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] text-[var(--text3)] pt-2 mt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <span>Thank you for your business!</span>
            <span>Shifterz Pro Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
