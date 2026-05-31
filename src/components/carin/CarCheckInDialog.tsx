"use client";

import { Car, X } from "lucide-react";

interface CheckInForm {
  vehicle: string;
  model: string;
  customer: string;
  phone: string;
  service: string;
  technicianIn: string;
  odometer: string;
  inTime: string;
  notes: string;
}

interface CarCheckInDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: CheckInForm;
  setForm: (form: CheckInForm) => void;
  services: { id: string; name: string }[];
  technicians: string[];
}

export default function CarCheckInDialog({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  services,
  technicians,
}: CarCheckInDialogProps) {
  if (!open) return null;

  const field = (label: string, required = false) => (
    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
      {label}{required && " *"}
    </label>
  );

  const inputCls = "px-3 py-2 rounded-lg text-sm border w-full";
  const inputStyle = {
    background: "var(--bg3)",
    borderColor: "var(--border2)",
    color: "var(--text)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden modal-animate"
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
            Car Check-In
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

        {/* Form */}
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex flex-col gap-1.5">
              {field("Vehicle Number", true)}
              <input
                type="text"
                placeholder="TN 04 XX 0000"
                value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value.toUpperCase() })}
                className={inputCls}
                style={inputStyle}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              {field("Car Model", true)}
              <input
                type="text"
                placeholder="Toyota Fortuner"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className={inputCls}
                style={inputStyle}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              {field("Customer Name", true)}
              <input
                type="text"
                placeholder="Full Name"
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                className={inputCls}
                style={inputStyle}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              {field("Phone Number")}
              <input
                type="text"
                placeholder="98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              {field("Service", true)}
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className={inputCls}
                style={inputStyle}
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.name}>{svc.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              {field("Technician")}
              <select
                value={form.technicianIn}
                onChange={(e) => setForm({ ...form, technicianIn: e.target.value })}
                className={inputCls}
                style={inputStyle}
              >
                {technicians.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              {field("Odometer (km)")}
              <input
                type="number"
                placeholder="45000"
                value={form.odometer}
                onChange={(e) => setForm({ ...form, odometer: e.target.value })}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              {field("In Time")}
              <input
                type="datetime-local"
                value={form.inTime}
                onChange={(e) => setForm({ ...form, inTime: e.target.value })}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              {field("Notes / Pre-existing Conditions")}
              <textarea
                placeholder="Scratches on bonnet, dents on rear bumper..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className={`${inputCls} resize-none`}
                style={inputStyle}
              />
            </div>

            {/* Footer actions */}
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border cursor-pointer transition-colors"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text2)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text2)")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-black font-extrabold text-sm cursor-pointer transition-all"
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Submit Check-In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
