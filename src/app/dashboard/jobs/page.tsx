"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";
import NewJobCardDialog from "@/components/jobs/NewJobCardDialog";
import { getJobs, createJob, updateJob, deleteJob } from "@/lib/api";

export default function JobCardsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const data = await getJobs();
      setJobs(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (data.id) {
        await updateJob(data.id, data);
      } else {
        await createJob(data);
      }
      await fetchJobs();
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };
  
  const stats = {
    pending: jobs.filter(j => j.status === "Pending").length,
    inProgress: jobs.filter(j => j.status === "In Progress").length,
    completed: jobs.filter(j => j.status === "Completed").length,
    cancelled: jobs.filter(j => j.status === "Cancelled").length,
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading jobs...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Job Cards</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</span>
          <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Progress</span>
          <span className="text-2xl font-bold text-gray-900">{stats.inProgress}</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</span>
          <span className="text-2xl font-bold text-green-500">{stats.completed}</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cancelled</span>
          <span className="text-2xl font-bold text-red-500">{stats.cancelled}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> New Job Card
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No jobs found</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Job ID</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Start</th>
                <th className="px-6 py-4">Est. Completion</th>
                <th className="px-6 py-4">Actual</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map(j => (
                <tr key={j.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs text-yellow-500">{j.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{j.vehicle}</td>
                  <td className="px-6 py-4 text-gray-600">{j.customer}</td>
                  <td className="px-6 py-4 text-gray-600">{j.service}</td>
                  <td className="px-6 py-4 text-gray-600">{j.technician}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${j.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {j.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{j.start}</td>
                  <td className="px-6 py-4 text-gray-600">{j.estCompletion}</td>
                  <td className="px-6 py-4 text-gray-600">{j.actual}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${j.status === 'Completed' ? 'bg-green-50 text-green-600' : j.status === 'Pending' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs max-w-[150px] truncate">{j.notes}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(j.id)} className="p-1.5 hover:bg-red-50 rounded-md text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewJobCardDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
