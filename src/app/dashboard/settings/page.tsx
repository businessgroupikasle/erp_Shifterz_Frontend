"use client";

import { useState, useEffect } from "react";
import { Building2, Database, Download, Headset, Lock, Plus, Trash2, Users } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/api";

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    gstPercent: "18"
  });

  const [technicians, setTechnicians] = useState<string[]>([]);
  const [salesAgents, setSalesAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        const data = await getSettings();
        if (data) {
          setCompanyInfo(prev => data.companyInfo || prev);
          setTechnicians(data.technicians || []);
          setSalesAgents(data.salesAgents || []);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setCompanyInfo(prev => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
    } else {
      setCompanyInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings({ companyInfo, technicians, salesAgents });
      alert("Settings saved successfully!");
    } catch (err: any) {
      alert("Failed to save settings: " + err.message);
    }
  };

  const handleAddTechnician = () => {
    const name = window.prompt("Enter new technician name:");
    if (name && name.trim() !== "") {
      setTechnicians(prev => [...prev, name.trim()]);
    }
  };

  const handleRemoveTechnician = (index: number) => {
    if (window.confirm("Are you sure you want to remove this technician?")) {
      setTechnicians(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddSalesAgent = () => {
    const name = window.prompt("Enter new sales agent name:");
    if (name && name.trim() !== "") {
      setSalesAgents(prev => [...prev, name.trim()]);
    }
  };

  const handleRemoveSalesAgent = (index: number) => {
    if (window.confirm("Are you sure you want to remove this sales agent?")) {
      setSalesAgents(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleExportData = () => {
    alert("Data exported successfully!");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      alert("All data has been reset.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      {/* Left Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-yellow-500" /> Company Information
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
              <input type="text" name="name" value={companyInfo.name} onChange={handleCompanyInfoChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-colors" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
              <textarea name="address" value={companyInfo.address} onChange={handleCompanyInfoChange} rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-colors resize-y" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
              <input type="text" name="phone" value={companyInfo.phone} onChange={handleCompanyInfoChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-colors" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
              <input type="email" name="email" value={companyInfo.email} onChange={handleCompanyInfoChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-colors" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">GSTIN</label>
              <input type="text" name="gstin" value={companyInfo.gstin} onChange={handleCompanyInfoChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-colors" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">GST %</label>
              <input type="number" name="gstPercent" value={companyInfo.gstPercent} onChange={handleCompanyInfoChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-colors" />
            </div>
            
            <div className="pt-2">
              <button onClick={handleSaveSettings} className="bg-[#facc15] hover:bg-[#eab308] text-gray-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-sm">
                <Lock className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Technicians */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-500" /> Technicians
            </h2>
            <button onClick={handleAddTechnician} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-0">
            {technicians.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">No technicians added.</div>
            ) : (
              technicians.map((name, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-800">{name}</span>
                  <button onClick={() => handleRemoveTechnician(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-100 transition-colors bg-red-50/50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sales Agents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Headset className="w-5 h-5 text-yellow-500" /> Sales Agents
            </h2>
            <button onClick={handleAddSalesAgent} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-0">
            {salesAgents.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">No sales agents added.</div>
            ) : (
              salesAgents.map((name, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-800">{name}</span>
                  <button onClick={() => handleRemoveSalesAgent(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-100 transition-colors bg-red-50/50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-yellow-500" /> Data Management
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={handleExportData} className="px-4 py-2 border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export All Data
            </button>
            <button onClick={handleResetData} className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
