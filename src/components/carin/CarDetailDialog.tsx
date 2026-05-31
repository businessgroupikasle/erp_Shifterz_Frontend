"use client";

import { Car, X } from "lucide-react";

interface CarRecord {
  id: string;
  vehicle: string;
  model: string;
  customer: string;
  phone: string;
  service: string;
  technicianIn: string;
  odometer: string;
  inTime: string;
  outTime?: string;
  notes?: string;
  status: string;
}

interface CarDetailDialogProps {
  car: CarRecord | null;
  onClose: () => void;
  fmtDT: (s: string) => string;
  getDuration: (inTime: string, outTime: string) => string;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: "var(--text3)" }}
      >
        {label}
      </span>
      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
        {value}
      </span>
    </div>
  );
}

export default function CarDetailDialog({ car, onClose, fmtDT, getDuration }: CarDetailDialogProps) {
  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden modal-animate"
        style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h3
            className="font-bold text-base flex items-center gap-2"
            style={{ color: "var(--text)" }}
          >
            <Car size={18} style={{ color: "var(--accent)" }} />
            Vehicle Details
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            style={{ color: "var(--text3)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg3)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Status badge */}
        <div className="px-6 pt-4">
          <span
            className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase ${
              car.status === "In Workshop" ? "badge-success" : "badge-danger"
            }`}
          >
            {car.status}
          </span>
        </div>

        {/* Details grid */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          <Row label="Vehicle Plate" value={<strong>{car.vehicle}</strong>} />
          <Row label="Model" value={car.model} />
          <Row
            label="Customer"
            value={
              <>
                {car.customer}
                {car.phone && (
                  <span className="block text-[10px]" style={{ color: "var(--text3)" }}>
                    {car.phone}
                  </span>
                )}
              </>
            }
          />
          <Row label="Odometer" value={`${car.odometer} km`} />
          <Row
            label="Service"
            value={
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>{car.service}</span>
            }
          />
          <Row label="Technician" value={car.technicianIn} />
          <Row label="In Time" value={fmtDT(car.inTime)} />
          <Row
            label="Out Time"
            value={car.outTime ? fmtDT(car.outTime) : <span style={{ color: "var(--text3)" }}>Ongoing</span>}
          />

          {car.outTime && (
            <div className="col-span-2 flex flex-col gap-0.5">
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: "var(--text3)" }}
              >
                Duration
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--success)" }}>
                {getDuration(car.inTime, car.outTime)}
              </span>
            </div>
          )}

          <div
            className="col-span-2 pt-3 border-t flex flex-col gap-1"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--text3)" }}
            >
              Condition Notes
            </span>
            <p className="text-sm italic" style={{ color: "var(--text2)" }}>
              {car.notes || "No notes captured."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors border"
            style={{
              background: "var(--bg3)",
              borderColor: "var(--border2)",
              color: "var(--text2)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text2)")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
