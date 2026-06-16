"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

interface ConvertDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (convertedData: any) => void;
  document?: any;
}

const CONVERSION_FLOW: Record<string, string | null> = {
  "Estimate": "Quotation",
  "Quotation": "Invoice",
  "Invoice": null,
};

export default function ConvertDocumentDialog({
  isOpen,
  onClose,
  onSubmit,
  document,
}: ConvertDocumentDialogProps) {
  const [formData, setFormData] = useState({
    amount: "",
    gst: "",
    discount: "",
  });

  const targetType = document ? CONVERSION_FLOW[document.type] : null;
  const canConvert = !!targetType;

  useEffect(() => {
    if (document && isOpen) {
      setFormData({
        amount: document.amount || "",
        gst: document.gst || "",
        discount: document.discount || "",
      });
    }
  }, [isOpen, document]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "discount") {
      const discountPercent = Math.min(100, Math.max(0, Number(value) || 0));
      setFormData((prev) => ({ ...prev, [name]: discountPercent.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    const amount = Number(formData.amount);
    const gst = Number(formData.gst) || 0;
    const discountPercent = Number(formData.discount) || 0;
    const discountAmount = (amount * discountPercent) / 100;
    const total = amount + gst - discountAmount;

    if (total <= 0) {
      toast.error("Total amount cannot be zero or negative. Reduce discount percentage.");
      return;
    }

    if (onSubmit && document) {
      onSubmit({
        ...document,
        type: targetType,
        amount: amount,
        gst: gst,
        discount: discountAmount,
        convertedFrom: document.id,
        previousType: document.type,
        conversionDate: new Date().toISOString().split("T")[0],
      });
    }
    onClose();
  };

  if (!isOpen || !document || !canConvert) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-400 p-2 rounded-lg">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Convert Document</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Conversion Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="px-3 py-1 bg-blue-100 rounded-lg text-sm font-bold text-blue-700">
              {document.type}
            </div>
            <ArrowRight className="w-5 h-5 text-blue-500" />
            <div className="px-3 py-1 bg-green-100 rounded-lg text-sm font-bold text-green-700">
              {targetType}
            </div>
          </div>
          <p className="text-xs text-blue-600 text-center mt-3">
            {document.type} #{document.id} will be converted to {targetType}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              step="0.01"
              min="0"
            />
          </div>

          {/* GST */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              GST Amount (₹)
            </label>
            <input
              type="number"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              step="0.01"
              min="0"
            />
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Discount (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                step="0.01"
                min="0"
                max="100"
              />
              <span className="text-sm font-bold text-gray-600">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ₹{(
                (Number(formData.amount || 0) * Number(formData.discount || 0)) / 100
              ).toFixed(2)} off
            </p>
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-lg p-3 mt-4 border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Total Amount:</p>
            <p className="text-2xl font-bold text-green-700">
              ₹{(
                Number(formData.amount || 0) +
                Number(formData.gst || 0) -
                ((Number(formData.amount || 0) * Number(formData.discount || 0)) / 100)
              ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <ArrowRight className="w-5 h-5" />
            Convert to {targetType}
          </button>
        </form>
      </div>
    </div>
  );
}
