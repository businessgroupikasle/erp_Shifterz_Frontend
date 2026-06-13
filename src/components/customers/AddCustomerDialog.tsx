"use client";
/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { X, Users } from "lucide-react";

interface AddCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (customer: any) => void;
}

export default function AddCustomerDialog({
  isOpen,
  onClose,
  onSubmit,
}: AddCustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    carModel: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Customer name is required");
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicle: "",
      carModel: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Users className="w-6 h-6 text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Add Customer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Row 2: Email & Vehicle No */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Vehicle No.
              </label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder="TN 04 XX 0000"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Row 3: Car Model */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Car Model
            </label>
            <input
              type="text"
              name="carModel"
              value={formData.carModel}
              onChange={handleChange}
              placeholder="Toyota Fortuner"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            ✓ Save
          </button>
        </form>
      </div>
    </div>
  );
}
