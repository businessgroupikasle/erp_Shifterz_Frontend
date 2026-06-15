"use client";
/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";

interface NewDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (doc: any) => void;
}

export default function NewDocumentDialog({
  isOpen,
  onClose,
  onSubmit,
}: NewDocumentDialogProps) {
  const [formData, setFormData] = useState({
    type: "Invoice",
    status: "Pending",
    client: "",
    phone: "",
    vehicle: "",
    service: "PPF Full Body",
    amount: "",
    gst: "",
    discount: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    gstNumber: "",
  });

  useEffect(() => {
    if (formData.amount) {
      const baseAmount = parseFloat(formData.amount) || 0;
      const gstAmount = (baseAmount * 18) / 100;
      setFormData((prev) => ({
        ...prev,
        gst: gstAmount.toFixed(0),
      }));
    }
  }, [formData.amount]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
    } else if (name === "vehicle") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const baseAmount = parseFloat(formData.amount) || 0;
      const gstAmount = parseFloat(formData.gst) || 0;
      const discountAmount = parseFloat(formData.discount) || 0;
      const total = baseAmount + gstAmount - discountAmount;

      const docTypePrefix = {
        Invoice: "INV",
        Quotation: "QT",
        Estimate: "EST",
        Proforma: "PRF",
      }[formData.type] || "DOC";

      const docNo = `${docTypePrefix}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

      const newDoc = {
        type: formData.type,
        client: formData.client,
        phone: formData.phone,
        vehicle: formData.vehicle,
        service: formData.service,
        amount: baseAmount,
        gst: gstAmount,
        discount: discountAmount,
        date: formData.invoiceDate,
        dueDate: formData.dueDate || formData.invoiceDate,
        status: formData.status,
        notes: formData.notes,
        gstNumber: formData.gstNumber || null,
      };
      onSubmit(newDoc);
    }
    setFormData({
      type: "Invoice",
      status: "Pending",
      client: "",
      phone: "",
      vehicle: "",
      service: "PPF Full Body",
      amount: "",
      gst: "",
      discount: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      notes: "",
      gstNumber: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">New Document</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Type & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
                required
              >
                <option>Invoice</option>
                <option>Quotation</option>
                <option>Estimate</option>
                <option>Proforma</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Overdue</option>
                <option>Approved</option>
              </select>
            </div>
          </div>

          {/* Row 2: Client & Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
              />
            </div>
          </div>

          {/* Row 3: Vehicle & Service */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Vehicle No.
              </label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder="TN 04 XX 0000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Service
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
              >
                <option>PPF Full Body</option>
                <option>PPF Bonnet + Roof</option>
                <option>PPF Partial (Hood)</option>
                <option>C3 Pro Coating</option>
                <option>Ceramic Coating</option>
                <option>Graphene Coating</option>
                <option>Interior Detailing</option>
                <option>Paint Correction (1-step)</option>
                <option>Full Paint Correction</option>
                <option>Window Tinting</option>
              </select>
            </div>
          </div>

          {/* Row 4: Amount & GST */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                GST (18%)
              </label>
              <input
                type="text"
                value={formData.gst}
                placeholder="auto"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          {/* Row 5: Discount & Invoice Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Discount (₹)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
              />
            </div>
          </div>

          {/* Row 6: Due Date & GST Number */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                GST Number (Optional)
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Ex: 33AAAAA0000A1Z5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900 uppercase"
              />
            </div>
          </div>

          {/* Row 7: Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Notes / Terms
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Payment terms, warranty info..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 resize-none text-gray-900"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            ✓ Generate Document
          </button>
        </form>
      </div>
    </div>
  );
}
