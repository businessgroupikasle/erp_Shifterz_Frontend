"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { ClipboardList, Plus, Search, Edit2, Clock, CheckCircle } from "lucide-react";
import JobCardDialog from "@/components/jobs/JobCardDialog";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ technicians: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals
  const [jobModal, setJobModal] = useState(false);
  const [editJob, setEditJob] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    vehicle: "",
    customer: "",
    service: "",
    technician: "",
    status: "Pending",
    priority: "Normal",
    startDate: "",
    estCompletion: "",
    actualCompletion: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      const [jobsData, svcsData, settingsData] = await Promise.all([
        api.getJobs(),
        api.getServices(),
        api.getSettings(),
      ]);
      setJobs(jobsData);
      setServices(svcsData);
      setSettings(settingsData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle || !form.service) {
      alert("Vehicle and Service are required!");
      return;
    }
    try {
      if (editJob) {
        await api.updateJob(editJob.id, form);
      } else {
        await api.createJob(form);
      }
      setJobModal(false);
      setEditJob(null);
      setForm({
        vehicle: "",
        customer: "",
        service: services[0]?.name || "",
        technician: settings.technicians[0] || "",
        status: "Pending",
        priority: "Normal",
        startDate: "",
        estCompletion: "",
        actualCompletion: "",
        notes: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save job card.");
    }
  };

  const handleEditTrigger = (job: any) => {
    setEditJob(job);
    setForm({
      vehicle: job.vehicle,
      customer: job.customer,
      service: job.service,
      technician: job.technician,
      status: job.status,
      priority: job.priority,
      startDate: job.startDate,
      estCompletion: job.estCompletion,
      actualCompletion: job.actualCompletion || "",
      notes: job.notes,
    });
    setJobModal(true);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "High":
        return "badge-danger animate-pulse";
      case "Normal":
        return "badge-info";
      case "Low":
        return "bg-neutral-500/5 text-neutral-400 border border-neutral-500/10";
      default:
        return "bg-neutral-500/5 text-neutral-400";
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Completed":
        return "badge-success";
      case "In Progress":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "Pending":
        return "badge-warn";
      default:
        return "bg-neutral-500/5 text-neutral-400";
    }
  };

  const fmtDate = (s: string) =>
    s
      ? new Date(s).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const filtered = jobs.filter(j => {
    const matchSearch =
      j.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      j.customer.toLowerCase().includes(search.toLowerCase()) ||
      j.service.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
            <ClipboardList className="text-[var(--accent)]" size={22} /> Workshop Job Cards
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Assign technician task pipelines, update workshop stages, and track execution deadlines.</p>
        </div>
        <button
          onClick={() => {
            setEditJob(null);
            setForm({
              vehicle: "",
              customer: "",
              service: services[0]?.name || "",
              technician: settings.technicians[0] || "",
              status: "Pending",
              priority: "Normal",
              startDate: new Date().toISOString().slice(0, 10),
              estCompletion: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
              actualCompletion: "",
              notes: "",
            });
            setJobModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> New Job Card
        </button>
      </div>

      {/* 3-Column Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 - In Progress */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                In Progress Jobs
              </span>
              <div className="text-2xl font-extrabold text-purple-400 mt-1 tracking-tight">
                {jobs.filter(j => j.status === "In Progress").length} Active
              </div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Clock size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Currently on detailing bays</span>
        </div>

        {/* Stat 2 - Pending */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Pending Queue
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {jobs.filter(j => j.status === "Pending").length} Waiting
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <Clock size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Awaiting bay availability / check-in</span>
        </div>

        {/* Stat 3 - Completed */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Completed Jobs (Month)
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                {jobs.filter(j => j.status === "Completed").length} Finished
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Delivered work-cards catalog</span>
        </div>
      </div>

      {/* Jobs table card */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Workshop Assignments</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">Assigned jobs dashboard and technician timelines.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={16} />
              <input
                type="text"
                placeholder="Search plate, client, service..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-xs w-full sm:w-60 border"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs border"
              style={{
                background: "var(--bg3)",
                borderColor: "var(--border2)",
                color: "var(--text)",
              }}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[700px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Job ID
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Vehicle
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Client / Service
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Technician
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Target Dates
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Priority
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Status
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(job => (
                <tr key={job.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-[var(--text3)]">{job.id}</td>
                  <td className="p-4 font-bold">{job.vehicle}</td>
                  <td className="p-4 text-xs font-semibold">
                    <div>{job.customer || "Walk-in"}</div>
                    <div className="text-[var(--text2)] text-[11px] font-normal">{job.service}</div>
                  </td>
                  <td className="p-4 text-xs">{job.technician || "—"}</td>
                  <td className="p-4 text-xs">
                    <div>Start: {fmtDate(job.startDate)}</div>
                    <div className="text-[var(--text3)]">Est: {fmtDate(job.estCompletion)}</div>
                    {job.actualCompletion && (
                      <div className="text-green-500 font-bold flex items-center gap-0.5 mt-0.5">
                        <CheckCircle size={10} /> {fmtDate(job.actualCompletion)}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${getPriorityBadge(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleEditTrigger(job)}
                      className="p-1.5 rounded hover:bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--text)] transition-colors cursor-pointer"
                      title="Edit Job Card"
                    >
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <JobCardDialog
        open={jobModal}
        onClose={() => setJobModal(false)}
        onSubmit={handleSaveJob}
        form={form}
        setForm={setForm}
        services={services}
        technicians={settings.technicians}
        isEdit={!!editJob}
      />
    </div>
  );
}
