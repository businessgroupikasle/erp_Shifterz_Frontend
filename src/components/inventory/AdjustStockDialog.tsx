"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AdjustStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: {
    name: string;
    stock: number;
  };
  onSubmit?: (adjustment: any) => void;
}

export default function AdjustStockDialog({
  isOpen,
  onClose,
  item,
  onSubmit,
}: AdjustStockDialogProps) {
  const [formData, setFormData] = useState({
    type: "Add Stock (Purchase)",
    quantity: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quantity) {
      alert("Quantity is required");
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    setFormData({
      type: "Add Stock (Purchase)",
      quantity: "",
      reason: "",
    });
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Adjust Stock</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Item Info */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6 text-sm">
          <p className="text-gray-700">
            <span className="font-semibold">{item.name}</span>
            <span className="text-gray-500"> — Current stock: </span>
            <span className="font-bold text-yellow-600">{item.stock} {item.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Adjustment Type */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Adjustment Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
            >
              <option>Add Stock (Purchase)</option>
              <option>Remove Stock (Usage)</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Reason
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Purchase / Damaged / Used in job"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-900"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            ✓ Apply
          </button>
        </form>
      </div>
    </div>
  );
}
