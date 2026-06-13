"use client";
/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */

import { X, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface FranchiseData {
  id?: string;
  name: string;
  city: string;
  owner: string;
  phone: string;
  startDate: string;
  royalty: string;
  status: string;
}

interface AddFranchiseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  franchiseData?: FranchiseData | null;
  onSave?: (data: FranchiseData) => void;
}

export default function AddFranchiseDialog({ isOpen, onClose, franchiseData, onSave }: AddFranchiseDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FranchiseData>({
    name: "",
    city: "",
    owner: "",
    phone: "",
    startDate: new Date().toISOString().split("T")[0],
    royalty: "5",
    status: "Active",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (franchiseData) {
      setFormData(franchiseData);
    } else {
      setFormData({
        name: "",
        city: "",
        owner: "",
        phone: "",
        startDate: new Date().toISOString().split("T")[0],
        royalty: "5",
        status: "Active",
      });
    }
  }, [franchiseData, isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    onClose();
  };

  const isEditing = !!franchiseData?.id;

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
            <span className="text-[#f59e0b] text-2xl">🏢</span> {isEditing ? "Edit Franchise" : "Add Franchise"}
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
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Franchise Name *</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="Shifterz Chennai"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">City *</label>
              <input 
                required
                type="text" 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="Chennai"
              />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Owner Name</label>
              <input 
                type="text" 
                value={formData.owner}
                onChange={e => setFormData({...formData, owner: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="Full name"
              />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Start Date</label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Royalty %</label>
              <input 
                type="number" 
                value={formData.royalty}
                onChange={e => setFormData({...formData, royalty: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="5"
              />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Inactive">Inactive</option>
              </select>
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
