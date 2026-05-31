"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import {
  Car,
  Plus,
  Search,
  Eye,
  LogOut,
  Clock,
  Gauge,
} from "lucide-react";
import CarCheckInDialog from "@/components/carin/CarCheckInDialog";
import CarDetailDialog from "@/components/carin/CarDetailDialog";

export default function CarInOut() {
  const router = useRouter();
  const [carList, setCarList] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ agents: [] });
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals
  const [checkInModal, setCheckInModal] = useState(false);
  const [viewCar, setViewCar] = useState<any>(null);

  // Form state
  const [form, setForm] = useState({
    vehicle: "",
    model: "",
    customer: "",
    phone: "",
    service: "",
    technicianIn: "",
    odometer: "",
    inTime: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      const [carsData, svcsData, settingsData, techData] = await Promise.all([
        api.getCarIn(),
        api.getServices(),
        api.getSettings(),
        api.getTechnicians(),
      ]);
      setCarList(carsData);
      setServices(svcsData);
      setSettings(settingsData);
      setTechnicians(techData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle || !form.model || !form.customer) {
      alert("Vehicle Number, Model, and Customer Name are required!");
      return;
    }
    try {
      await api.checkInCar({
        ...form,
        inTime: form.inTime || new Date().toISOString(),
      });
      setCheckInModal(false);
      setForm({
        vehicle: "",
        model: "",
        customer: "",
        phone: "",
        service: services[0]?.name || "",
        technicianIn: technicians[0]?.name || "",
        odometer: "",
        inTime: "",
        notes: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to check in car.");
    }
  };

  const handleCheckOut = async (id: string) => {
    if (!confirm("Are you sure you want to check out this vehicle?")) return;
    try {
      await api.checkOutCar(id);
      loadData();
      router.push("/outpass");
    } catch (err: any) {
      alert(err.message || "Failed to check out car.");
    }
  };

  // Duration Helper
  const getDuration = (inTime: string, outTime: string) => {
    const diff = new Date(outTime).getTime() - new Date(inTime).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days}d ${hrs % 24}h`;
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const fmtDT = (s: string) =>
    s
      ? new Date(s).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  // Filtered List
  const filtered = carList.filter(car => {
    const matchSearch =
      car.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      car.customer.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || car.status === statusFilter;
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
            <Car className="text-[var(--accent)]" size={22} /> Car Check-In & Out
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Register incoming vehicles, assign technicians, log odometer readings, and checkout completed jobs.</p>
        </div>
        <button
          onClick={() => {
            setForm({
              ...form,
              service: services[0]?.name || "",
              technicianIn: technicians[0]?.name || "",
              inTime: new Date().toISOString().slice(0, 16),
            });
            setCheckInModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> Car Check-In
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Active in Workshop
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                {carList.filter(c => c.status === "In Workshop").length} vehicles
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <Car size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Currently undergoing work in shop</span>
        </div>

        {/* Stat 2 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Checked In Today
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {carList.filter(c => c.inTime && c.inTime.slice(0, 10) === new Date().toISOString().slice(0, 10)).length} vehicles
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <Clock size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Incoming arrivals logged today</span>
        </div>

        {/* Stat 3 */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Total Records
              </span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1 tracking-tight">
                {carList.length} registered
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Gauge size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">All check-in entries history</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        {/* Table Filters header */}
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Car Register</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">Directory of active and past workshop entries.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={14} />
              <input
                type="text"
                placeholder="Search plate, model, client..."
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
              <option value="In Workshop">In Workshop</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[700px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Vehicle No
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Model
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Customer
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Service
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Technician
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  In / Out Time
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
              {filtered.map(car => (
                <tr key={car.id} className="hover:bg-[var(--bg3)]/40 transition-colors">
                  <td className="p-4 font-bold">{car.vehicle}</td>
                  <td className="p-4 text-xs">{car.model}</td>
                  <td className="p-4 text-xs">
                    <div>{car.customer}</div>
                    <div className="text-[var(--text3)] text-[10px]">{car.phone}</div>
                  </td>
                  <td className="p-4 text-xs font-semibold">{car.service}</td>
                  <td className="p-4 text-xs">{car.technicianIn}</td>
                  <td className="p-4 text-xs">
                    <div>In: {fmtDT(car.inTime)}</div>
                    {car.outTime && <div className="text-[var(--text3)]">Out: {fmtDT(car.outTime)}</div>}
                    <div className="text-[var(--text3)] text-[10px]">Odo: {car.odometer} km</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase ${
                        car.status === "In Workshop" ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewCar(car)}
                        className="p-1.5 rounded hover:bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--text)] transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {car.status === "In Workshop" && (
                        <button
                          onClick={() => handleCheckOut(car.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500 hover:text-black text-green-400 text-xs font-bold transition-all duration-200 cursor-pointer"
                        >
                          <LogOut size={12} /> Out
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CarCheckInDialog
        open={checkInModal}
        onClose={() => setCheckInModal(false)}
        onSubmit={handleCheckIn}
        form={form}
        setForm={setForm}
        services={services}
        technicians={technicians.map((t: { name: string }) => t.name)}
      />

      <CarDetailDialog
        car={viewCar}
        onClose={() => setViewCar(null)}
        fmtDT={fmtDT}
        getDuration={getDuration}
      />
    </div>
  );
}
