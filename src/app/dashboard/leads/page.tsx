"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Plus, ChevronDown, Trash2 } from "lucide-react";
import AddLeadDialog from "@/components/leads/AddLeadDialog";
import { getLeads, createLead, deleteLead } from "@/lib/api";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  service: string;
  vehicle: string;
  assignedTo: string;
  budget: string;
  date: string;
  status: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load leads from backend
  useEffect(() => {
    async function fetchLeads() {
      try {
        setIsLoading(true);
        const data = await getLeads();
        setLeads(data);
      } catch (err: any) {
        setError("Failed to load leads: " + err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeads();
  }, []);

  // Add new lead
  const handleAddLead = async (newLead: any) => {
    try {
      const created = await createLead(newLead);
      setLeads([...leads, created]);
      setIsDialogOpen(false);
    } catch (err: any) {
      alert("Failed to create lead: " + err.message);
      console.error(err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (err: any) {
      alert("Failed to delete lead: " + err.message);
      console.error(err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = filter === "All" || lead.status === filter;
    const sourceMatch =
      sourceFilter === "All Sources" || lead.source === sourceFilter;
    return statusMatch && sourceMatch;
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const followUp = leads.filter((l) => l.status === "Follow Up").length;
  const closed = leads.filter((l) => l.status === "Closed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Follow Up":
        return "bg-yellow-100 text-yellow-700";
      case "Closed":
        return "bg-green-100 text-green-700";
      case "Lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "JustDial":
        return "bg-blue-100 text-blue-700";
      case "Instagram":
        return "bg-purple-100 text-purple-700";
      case "Referral":
        return "bg-green-100 text-green-700";
      case "Facebook":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8">
      {/* Loading & Error States */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-blue-700">
          Loading leads...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Total Leads
          </p>
          <p className="text-4xl font-bold text-gray-900">{totalLeads}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            New
          </p>
          <p className="text-4xl font-bold text-gray-900">{newLeads}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Follow Up
          </p>
          <p className="text-4xl font-bold text-gray-900">{followUp}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Closed
          </p>
          <p className="text-4xl font-bold text-gray-900">{closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["All", "New", "Follow Up", "Closed", "Lost"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option>All Sources</option>
            <option>JustDial</option>
            <option>Instagram</option>
            <option>Referral</option>
            <option>Facebook</option>
            <option>Walk-in</option>
          </select>

          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-400">{lead.id}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold text-gray-900">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lead.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getSourceColor(lead.source)}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lead.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lead.vehicle}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <AddLeadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddLead}
      />
    </div>
  );
}
