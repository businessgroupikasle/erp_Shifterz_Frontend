"use client";

import { useState } from "react";
import { X, Car } from "lucide-react";

interface CarCheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarCheckInDialog({
  isOpen,
  onClose,
}: CarCheckInDialogProps) {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    carModel: "",
    customerName: "",
    phone: "",
    service: "PPF Full Body",
    technician: "Arjun",
    odometer: "",
    inTime: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    console.log("Car Check-In:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Car Check-In</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Vehicle Number & Car Model */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="TN 04 XX 0000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Car Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                placeholder="Toyota Fortuner"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Row 2: Customer Name & Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3: Service & Technician */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
              >
                <option>PPF Full Body</option>
                <option>PPF Bonnet</option>
                <option>C3 Coating</option>
                <option>Graphene Coating</option>
                <option>Interior Detailing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Technician
              </label>
              <select
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
              >
                <option>Arjun</option>
                <option>Sathish</option>
                <option>Kumar</option>
                <option>Rajesh</option>
              </select>
            </div>
          </div>

          {/* Row 4: Odometer & In Time */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Odometer (KM)
              </label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleChange}
                placeholder="42500"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                In Time
              </label>
              <input
                type="datetime-local"
                name="inTime"
                value={formData.inTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes / Condition
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Pre-existing scratches, dents, special instructions..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            ✓ Check-In Car
          </button>
        </form>
      </div>
    </div>
  );
}
