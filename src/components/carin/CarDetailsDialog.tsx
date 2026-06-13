"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface CarData {
  vehicleNo: string;
  model: string;
  customer: string;
  phone: string;
  service: string;
  technician: string;
  inTime: string;
  outTime: string | null;
  status: string;
  odometer?: string;
  notes?: string;
}

interface CarDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  carData?: CarData;
}

export default function CarDetailsDialog({ isOpen, onClose, carData }: CarDetailsDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || !carData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-xl font-bold text-gray-900">
            Car Details — {carData.vehicleNo}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehicle</span>
              <span className="font-semibold text-gray-900">{carData.vehicleNo}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Model</span>
              <span className="font-semibold text-gray-900">{carData.model}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</span>
              <span className="font-semibold text-gray-900">{carData.customer}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</span>
              <span className="font-semibold text-gray-900">{carData.phone}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</span>
              <span className="font-semibold text-gray-900">{carData.service}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</span>
              <span className="font-semibold text-gray-900">{carData.technician}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Odometer</span>
              <span className="font-semibold text-gray-900">{carData.odometer || "42500 km"}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In Time</span>
              <span className="font-semibold text-gray-900">{carData.inTime}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Out Time</span>
              <span className="font-semibold text-gray-900">{carData.outTime || "—"}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
              <span className="font-semibold text-gray-900">
                {carData.status === "Ongoing" ? "In Workshop" : carData.status}
              </span>
            </div>
            
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes</span>
              <span className="font-semibold text-gray-900">{carData.notes || "Handle with care - white pearl"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
