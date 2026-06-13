"use client";

import { useState } from "react";
import { X, CreditCard } from "lucide-react";

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payment: any) => void;
}

export default function RecordPaymentDialog({
  isOpen,
  onClose,
  onSubmit,
}: RecordPaymentDialogProps) {
  const [formData, setFormData] = useState({
    client: "",
    invoiceNo: "",
    amount: "",
    mode: "UPI",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client.trim() || !formData.amount) {
      alert("Client name and amount are required");
      return;
    }

    if (onSubmit) {
      const newPayment = {
        id: `PAY${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
        invoiceRef: formData.invoiceNo || "—",
        client: formData.client,
        amount: `₹${parseFloat(formData.amount).toLocaleString("en-IN")}`,
        mode: formData.mode,
        date: new Date(formData.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        reference: formData.reference || "—",
        notes: formData.notes || "—",
      };
      onSubmit(newPayment);
    }

    setFormData({
      client: "",
      invoiceNo: "",
      amount: "",
      mode: "UPI",
      date: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Client Name & Invoice No */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Invoice No.
              </label>
              <input
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleChange}
                placeholder="INV-XXXX"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Row 2: Amount & Payment Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Payment Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
                <option>NEFT</option>
                <option>Cheque</option>
              </select>
            </div>
          </div>

          {/* Row 3: Date & Reference No */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Reference No.
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="UPI ref / cheque no."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Row 4: Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Partial payment, advance, etc."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            ✓ Save Payment
          </button>
        </form>
      </div>
    </div>
  );
}
