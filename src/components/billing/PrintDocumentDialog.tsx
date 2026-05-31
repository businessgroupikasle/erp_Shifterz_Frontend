"use client";

import { Printer, X } from "lucide-react";

interface Props {
  doc: any | null;
  onClose: () => void;
  settings: any;
  fmt: (n: number) => string;
  fmtDate: (s: string) => string;
}

export default function PrintDocumentDialog({ doc, onClose, settings, fmt, fmtDate }: Props) {
  if (!doc) return null;
  const total = doc.amount + doc.gst - doc.discount;
  return (
    <div className="fixed inset-0 bg-black/85 z-[999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between text-white no-print">
          <h3 className="font-bold text-sm">Invoice Print Preview</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-yellow-500 text-black font-extrabold cursor-pointer text-xs">
              <Printer size={14} /> Print Document
            </button>
            <button onClick={onClose} className="p-2 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="print-card rounded-2xl border p-8 flex flex-col gap-6 shadow-2xl modal-animate"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex justify-between items-start border-b pb-6" style={{ borderColor: "var(--border)" }}>
            <div>
              <h2 className="text-3xl font-extrabold text-[var(--accent)] tracking-widest" style={{ fontFamily: "var(--font-syne)" }}>
                {settings.companyName || "SHIFTERZ"}
              </h2>
              <p className="text-xs text-[var(--text2)] max-w-xs mt-2 italic">{settings.address}</p>
              <p className="text-xs text-[var(--text3)] mt-1">Phone: {settings.phone} | Email: {settings.email}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">{doc.type}</h3>
              <span className="font-mono text-sm block font-semibold text-yellow-500 mt-1">{doc.id}</span>
              <div className="text-xs text-[var(--text3)] mt-3">
                <div>Date: {fmtDate(doc.date)}</div>
                <div>Due Date: {fmtDate(doc.dueDate)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs border-b pb-6" style={{ borderColor: "var(--border)" }}>
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[var(--text3)] mb-2">Billed To</h4>
              <div className="font-bold text-sm text-white">{doc.client}</div>
              <div className="text-[var(--text2)] mt-1">{doc.phone}</div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[var(--text3)] mb-2">Vehicle Details</h4>
              <div className="font-bold text-sm text-white">{doc.vehicle || "—"}</div>
              <div className="text-[var(--text2)] mt-1">GSTIN: {settings.gstin}</div>
            </div>
          </div>

          <table className="w-full text-left text-xs border-b" style={{ borderColor: "var(--border)" }}>
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)", color: "var(--text3)" }}>
                {["Description","Base Rate",`GST (${settings.gstPct||18}%)`, "Discount","Amount"].map(h => (
                  <th key={h} className={`py-3 font-bold uppercase tracking-wider${h!=="Description"?" text-right":""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm font-semibold text-white">
                <td className="py-4">{doc.service}</td>
                <td className="py-4 text-right">{fmt(doc.amount)}</td>
                <td className="py-4 text-right">{fmt(doc.gst)}</td>
                <td className="py-4 text-right">{fmt(doc.discount)}</td>
                <td className="py-4 text-right text-[var(--accent)]">{fmt(total)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-start mt-4">
            <div className="max-w-xs text-xs text-[var(--text3)] italic">
              {doc.notes || "Thank you for choosing Shifterz. All goods and services are subject to terms and warranties stated in catalog."}
            </div>
            <div className="flex flex-col gap-2 text-right text-xs w-60">
              {[["Subtotal:", fmt(doc.amount)],["Tax (GST):", fmt(doc.gst)],["Discount:", `-${fmt(doc.discount)}`]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-[var(--text3)]"><span>{k}</span><span>{v}</span></div>
              ))}
              <div className="flex justify-between text-base font-extrabold text-white border-t pt-2 mt-1" style={{ borderColor: "var(--border2)" }}>
                <span>Total Amount:</span>
                <span className="text-[var(--accent)]">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
