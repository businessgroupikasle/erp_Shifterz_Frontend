"use client";
/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */

import { X, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface JobData {
  vehicle: string;
  customer: string;
  service: string;
  technician: string;
  priority: string;
  status: string;
  startDate: string;
  estCompletion: string;
  actualCompletion: string;
  notes: string;
}

interface NewJobCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: JobData) => void;
}

export default function NewJobCardDialog({ isOpen, onClose, onSave }: NewJobCardDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<JobData>({
    vehicle: "",
    customer: "",
    service: "PPF Full Body",
    technician: "Arjun",
    priority: "Normal",
    status: "Pending",
    startDate: new Date().toISOString().split("T")[0],
    estCompletion: "",
    actualCompletion: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        vehicle: "",
        customer: "",
        service: "PPF Full Body",
        technician: "Arjun",
        priority: "Normal",
        status: "Pending",
        startDate: new Date().toISOString().split("T")[0],
        estCompletion: "",
        actualCompletion: "",
        notes: "",
      });
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    onClose();
  };

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
            <span className="text-[#f59e0b] text-2xl">📋</span> New Job Card
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
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Vehicle No. *</label>
              <input 
                required
                type="text" 
                value={formData.vehicle}
                onChange={e => setFormData({...formData, vehicle: e.target.value.toUpperCase()})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors uppercase"
                placeholder="TN 04 XX 0000"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Customer Name</label>
              <input 
                type="text" 
                value={formData.customer}
                onChange={e => setFormData({...formData, customer: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
                placeholder="Full name"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Service</label>
              <select 
                value={formData.service}
                onChange={e => setFormData({...formData, service: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              >
                <option value="PPF Full Body">PPF Full Body</option>
                <option value="C3 Coating">C3 Coating</option>
                <option value="Interior Detailing">Interior Detailing</option>
              </select>
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Technician</label>
              <select 
                value={formData.technician}
                onChange={e => setFormData({...formData, technician: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              >
                <option value="Arjun">Arjun</option>
                <option value="Sathish">Sathish</option>
                <option value="Mani">Mani</option>
              </select>
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
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
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Est. Completion</label>
              <input 
                type="date" 
                value={formData.estCompletion}
                onChange={e => setFormData({...formData, estCompletion: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors"
              />
            </div>
            
            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-colors min-h-[80px]"
                placeholder="Work stages, observations..."
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Check className="w-5 h-5 stroke-3" /> Create Job Card
          </button>
        </form>
      </div>
    </div>
  );
}
