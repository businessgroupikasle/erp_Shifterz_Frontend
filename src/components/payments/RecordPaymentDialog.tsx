"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payment: any) => void;
  invoiceData?: {
    id: string;
    client: string;
    phone?: string;
    amount: number;
    date?: string;
  };
}

export default function RecordPaymentDialog({
  isOpen,
  onClose,
  onSubmit,
  invoiceData,
}: RecordPaymentDialogProps) {
  const [formData, setFormData] = useState({
    client: "",
    phone: "",
    invoiceNo: "",
    totalAmount: "",
    amount: "",
    mode: "UPI",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen && invoiceData) {
      setFormData({
        client: invoiceData.client || "",
        phone: invoiceData.phone || "",
        invoiceNo: invoiceData.id || "",
        totalAmount: invoiceData.amount?.toString() || "",
        amount: invoiceData.amount?.toString() || "",
        mode: "UPI",
        date: invoiceData.date || new Date().toISOString().split("T")[0],
        reference: "",
        notes: "",
      });
    }
  }, [isOpen, invoiceData]);

  const calculateOutstanding = () => {
    const total = Number(formData.totalAmount) || 0;
    const paid = Number(formData.amount) || 0;
    return Math.max(0, total - paid);
  };

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
        invoiceId: formData.invoiceNo,
        client: formData.client,
        amount: Number(formData.amount),
        mode: formData.mode,
        date: formData.date,
        ref: formData.reference,
        notes: formData.notes,
      };
      onSubmit(newPayment);
    }

    setFormData({
      client: "",
      phone: "",
      invoiceNo: "",
      totalAmount: "",
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

        {/* Invoice Info Header */}
        {invoiceData && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="text-xs text-blue-600 font-bold uppercase mb-2">Fetched Invoice Data</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Client</p>
                <p className="text-sm font-bold text-gray-900">{formData.client}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-bold text-gray-900">{formData.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Invoice ID</p>
                <p className="text-sm font-bold text-yellow-600">{formData.invoiceNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Due</p>
                <p className="text-sm font-bold text-green-600">₹{Number(formData.amount).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Client Name & Invoice No (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-default"
                readOnly
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-default"
                readOnly
              />
            </div>
          </div>

          {/* Row 2: Phone & Total Amount (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-default"
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Total Amount Due (₹)
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-default font-bold"
                readOnly
              />
            </div>
          </div>

          {/* Row 3: Paid Amount (Editable) & Outstanding (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Amount Paying Now (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50 text-gray-900 font-bold"
              />
              <p className="text-xs text-green-600 mt-1">Editable - Enter partial or full amount</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Outstanding Balance (₹)
              </label>
              <input
                type="text"
                value={`₹${calculateOutstanding().toLocaleString("en-IN")}`}
                className="w-full px-3 py-2.5 border border-red-300 rounded-lg bg-red-50 text-red-700 cursor-default font-bold"
                readOnly
              />
              <p className="text-xs text-red-600 mt-1">Auto-calculated</p>
            </div>
          </div>

          {/* Row 4: Payment Mode & Date (Editable) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-gray-900"
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
                <option>NEFT</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Row 5: Reference No. (Editable) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Reference No.
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="UPI ref / cheque no. / UTR"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Partial payment, advance, etc."
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white resize-none text-gray-900"
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
