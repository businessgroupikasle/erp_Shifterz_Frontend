"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Settings, Save, Trash2, Users } from "lucide-react";

interface SettingsData {
  id: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  gstPct: number;
  currency: string;
  agents: string[];
}

interface TechnicianData {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  status: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    id: "default",
    companyName: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    gstPct: 18,
    currency: "₹",
    agents: [],
  });
  const [technicians, setTechnicians] = useState<TechnicianData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lists additions states
  const [newTech, setNewTech] = useState("");
  const [newAgent, setNewAgent] = useState("");

  const loadData = async () => {
    try {
      const [settingsData, techData] = await Promise.all([
        api.getSettings(),
        api.getTechnicians(),
      ]);
      setSettings(settingsData);
      setTechnicians(techData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 0);
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      setSaving(false);
      alert("Settings saved successfully!");
    } catch (err) {
      setSaving(false);
      const errorMsg = err instanceof Error ? err.message : "Failed to save settings.";
      alert(errorMsg);
    }
  };

  const handleAddTech = async () => {
    const name = newTech.trim();
    if (!name) return;
    if (technicians.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      alert("Technician already exists!");
      return;
    }
    try {
      const newRecord = await api.createTechnician({ name });
      setTechnicians([...technicians, newRecord]);
      setNewTech("");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add technician.";
      alert(errorMsg);
    }
  };

  const handleRemoveTech = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove technician ${name}?`)) return;
    try {
      await api.deleteTechnician(id);
      setTechnicians(technicians.filter((t) => t.id !== id));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to remove technician.";
      alert(errorMsg);
    }
  };

  const handleAddAgent = async () => {
    const name = newAgent.trim();
    if (!name) return;
    if (settings.agents.includes(name)) {
      alert("Agent already exists!");
      return;
    }
    const updated = {
      ...settings,
      agents: [...settings.agents, name],
    };
    try {
      await api.updateSettings(updated);
      setSettings(updated);
      setNewAgent("");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add agent.";
      alert(errorMsg);
    }
  };

  const handleRemoveAgent = async (a: string) => {
    if (!confirm(`Are you sure you want to remove agent ${a}?`)) return;
    const updated = {
      ...settings,
      agents: settings.agents.filter((x: string) => x !== a),
    };
    try {
      await api.updateSettings(updated);
      setSettings(updated);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to remove agent.";
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-dashed pb-4" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-syne)" }}>
            <Settings className="text-[var(--accent)]" size={22} /> Workshop Settings
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Configure business tax percentages, regional company identifiers, and workshop staff rosters.</p>
        </div>
      </div>

      {/* Settings Form Container */}
      <div className="max-w-4xl w-full mx-auto">
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Settings */}
          <div
            className="rounded-2xl p-6 border md:col-span-2 flex flex-col gap-4 shadow-xl"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <h3 className="font-extrabold text-sm flex items-center gap-2 border-b pb-3 text-white" style={{ borderColor: "var(--border)" }}>
              <Settings className="text-[var(--accent)]" size={16} /> Workshop Configuration
            </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                Office Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                Office Address
              </label>
              <textarea
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="px-3 py-2 rounded-lg text-sm border min-h-[60px]"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                GSTIN Tax Number
              </label>
              <input
                type="text"
                value={settings.gstin}
                onChange={e => setSettings({ ...settings, gstin: e.target.value.toUpperCase() })}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                  Default Tax (GST %)
                </label>
                <input
                  type="number"
                  value={settings.gstPct}
                  onChange={e => setSettings({ ...settings, gstPct: Number(e.target.value) })}
                  className="px-3 py-2 rounded-lg text-sm border"
                  style={{
                    background: "var(--bg3)",
                    borderColor: "var(--border2)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={e => setSettings({ ...settings, currency: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm border"
                  style={{
                    background: "var(--bg3)",
                    borderColor: "var(--border2)",
                    color: "var(--text)",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} /> {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>

        {/* Staff & Roster settings */}
        <div className="flex flex-col gap-6">
          {/* Technicians Roster */}
          <div
            className="rounded-2xl p-5 border flex flex-col gap-3 shadow"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <h4 className="font-bold text-xs flex items-center gap-1.5 border-b pb-2" style={{ borderColor: "var(--border)" }}>
              <Users size={14} className="text-[var(--accent)]" /> Technicians
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Technician"
                value={newTech}
                onChange={e => setNewTech(e.target.value)}
                className="px-2.5 py-1.5 rounded text-xs border w-full"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3 py-1 rounded bg-[var(--bg3)] hover:bg-[var(--bg4)] border text-xs font-bold transition-all cursor-pointer"
                style={{ borderColor: "var(--border2)" }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto mt-1 pr-1">
               {technicians.map((t) => (
                 <div key={t.id} className="flex justify-between items-center text-xs py-1 border-b" style={{ borderColor: "var(--border)" }}>
                   <span>{t.name}</span>
                   <button
                     type="button"
                     onClick={() => handleRemoveTech(t.id, t.name)}
                     className="text-red-500 hover:text-red-400 p-0.5 cursor-pointer"
                   >
                     <Trash2 size={12} />
                   </button>
                 </div>
               ))}
            </div>
          </div>

          {/* Agents Roster */}
          <div
            className="rounded-2xl p-5 border flex flex-col gap-3 shadow"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <h4 className="font-bold text-xs flex items-center gap-1.5 border-b pb-2" style={{ borderColor: "var(--border)" }}>
              <Users size={14} className="text-[var(--accent)]" /> CRM / Sales Agents
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Agent"
                value={newAgent}
                onChange={e => setNewAgent(e.target.value)}
                className="px-2.5 py-1.5 rounded text-xs border w-full"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
              <button
                type="button"
                onClick={handleAddAgent}
                className="px-3 py-1 rounded bg-[var(--bg3)] hover:bg-[var(--bg4)] border text-xs font-bold transition-all cursor-pointer"
                style={{ borderColor: "var(--border2)" }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto mt-1 pr-1">
              {settings.agents.map((a: string) => (
                <div key={a} className="flex justify-between items-center text-xs py-1 border-b" style={{ borderColor: "var(--border)" }}>
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgent(a)}
                    className="text-red-500 hover:text-red-400 p-0.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
}
