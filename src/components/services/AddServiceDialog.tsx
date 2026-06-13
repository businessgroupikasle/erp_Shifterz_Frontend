"use client";
/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */

import { X, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceData {
  id?: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  warranty: string;
  description?: string;
}

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData?: ServiceData | null;
  onSave?: (data: ServiceData) => void;
}

export default function AddServiceDialog({ isOpen, onClose, serviceData, onSave }: AddServiceDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<ServiceData>({
    name: "",
    category: "PPF",
    price: "",
    duration: "",
    warranty: "",
    description: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (serviceData) {
      setFormData(serviceData);
    } else {
      setFormData({
        name: "",
        category: "PPF",
        price: "",
        duration: "",
        warranty: "",
        description: "",
      });
    }
  }, [serviceData, isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    onClose();
  };

  const isEditing = !!serviceData?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-[#f59e0b] text-2xl">🏢</span> {isEditing ? "Edit Service" : "Add Service"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Service Name *</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="PPF Full Body"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              >
                <option value="PPF">PPF</option>
                <option value="Coating">Coating</option>
                <option value="Detailing">Detailing</option>
                <option value="Add-on">Add-on</option>
              </select>
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Price (₹) *</label>
              <input 
                required
                type="text" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="45000"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Duration</label>
              <input 
                type="text" 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="2 days / 4 hours"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Warranty</label>
              <input 
                type="text" 
                value={formData.warranty}
                onChange={e => setFormData({...formData, warranty: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="10 years / —"
              />
            </div>
            
            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors min-h-[80px]"
                placeholder="Short description"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Check className="w-5 h-5 stroke-3" /> Save
          </button>
        </form>
      </div>
    </div>
  );
}
