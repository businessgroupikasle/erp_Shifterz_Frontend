"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Circle, Edit } from "lucide-react";
import CarCheckInDialog from "@/components/carin/CarCheckInDialog";
import PassCarDialog from "@/components/carin/PassCarDialog";
import CarDetailsDialog from "@/components/carin/CarDetailsDialog";

interface CarEntry {
  id: string;
  entryId: string;
  vehicleNo: string;
  model: string;
  customer: string;
  phone: string;
  service: string;
  technician: string;
  inTime: string;
  outTime: string | null;
  duration: string | null;
  status: string;
}

import { getCarInRecords, updateCarIn, createCarIn, editCarIn } from "@/lib/api";
import { useEffect } from "react";
import { calculateDuration, formatTime } from "@/lib/timeUtils";

export default function CarInOutPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPassDialogOpen, setIsPassDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarEntry | null>(null);
  const [cars, setCars] = useState<CarEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCars = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCarInRecords();
      setCars(data || []);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleCheckInSubmit = async (carData: any) => {
    try {
      if (selectedCar && isDialogOpen) {
        // Edit Mode
        await editCarIn(selectedCar.id, carData);
        await fetchCars();
      } else {
        // Create Mode
        const newCar = await createCarIn(carData);
        setCars([...cars, newCar]);
      }
      setIsDialogOpen(false);
      setSelectedCar(null);
    } catch (err) {
      console.error("Failed to save car:", err);
      alert("Failed to save car. Please try again.");
    }
  };

  const handleEditCar = (car: CarEntry) => {
    setSelectedCar(car);
    setIsDialogOpen(true);
  };

  const handlePassCar = (car: CarEntry) => {
    setSelectedCar(car);
    setIsPassDialogOpen(true);
  };

  const handleViewCar = (car: CarEntry) => {
    setSelectedCar(car);
    setIsDetailsDialogOpen(true);
  };

  const handlePassSubmit = async (passData: any) => {
    if (!selectedCar) return;
    try {
      // Optimistic update
      setCars(
        cars.map((car) =>
          car.id === selectedCar.id
            ? {
                ...car,
                status: "Out" as const,
                outTime: passData.outTime,
              }
            : car
        )
      );
      setIsPassDialogOpen(false);

      await updateCarIn(selectedCar.id, {
        status: "Out",
        outTime: passData.outTime,
      });

      router.push("/dashboard/outpass");
      setTimeout(() => {
        router.push("/dashboard/outpass");
      }, 500);
    } catch (err) {
      console.error("Failed to update car:", err);
      alert("Failed to pass car out. Please try again.");
      fetchCars(); // Revert optimistic update
    }
  };

  const inWorkshop = cars.filter((c) => c.status === "Ongoing" || c.status === "In Workshop").length;
  const totalToday = cars.length;
  const delivered = cars.filter((c) => c.status === "Out" || c.status === "Delivered").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
      case "In Workshop":
        return "bg-green-100 text-green-700";
      case "Out":
      case "Delivered":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Ongoing" || status === "In Workshop") return <Circle className="w-3 h-3 fill-current" />;
    if (status === "Out" || status === "Delivered") return <Circle className="w-3 h-3 fill-current" />;
    return <Circle className="w-3 h-3 fill-current" />;
  };

  return (
    <div className="p-8">
      {/* Stats Bar */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold">● In Workshop: {inWorkshop}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold">Total Today: {totalToday}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-600 font-semibold">Delivered: {delivered}</span>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => { setSelectedCar(null); setIsDialogOpen(true); }}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Car Check-In
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        {["All", "In Workshop", "Delivered"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-3 font-medium transition-colors ${
              filter === tab
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Entry ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vehicle No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  In Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Out Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cars.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {entry.entryId || entry.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {entry.vehicleNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.model}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold text-gray-900">{entry.customer}</div>
                    <div className="text-xs text-gray-500">{entry.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.technician}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{formatTime(entry.inTime)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {entry.outTime ? formatTime(entry.outTime) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    {entry.outTime ? calculateDuration(entry.inTime, entry.outTime) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        entry.status
                      )}`}
                    >
                      {getStatusIcon(entry.status)} {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {entry.status === "Ongoing" || entry.status === "In Workshop" ? (
                        <button
                          onClick={() => handlePassCar(entry)}
                          className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded font-semibold text-xs transition-colors flex items-center gap-1"
                          title="Mark car as Out and create pass"
                        >
                          → Out
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleEditCar(entry)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors text-blue-600"
                        title="Edit details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewCar(entry)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      <CarCheckInDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setSelectedCar(null); }}
        onSubmit={handleCheckInSubmit}
        initialData={selectedCar}
      />
      <PassCarDialog
        isOpen={isPassDialogOpen}
        onClose={() => setIsPassDialogOpen(false)}
        carData={
          selectedCar
            ? {
                vehicleNo: selectedCar.vehicleNo,
                model: selectedCar.model,
                customer: selectedCar.customer,
                phone: selectedCar.phone,
                service: selectedCar.service,
                technician: selectedCar.technician,
              }
            : undefined
        }
        onSubmit={handlePassSubmit}
      />
      <CarDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        carData={selectedCar ? { ...selectedCar } : undefined}
      />
    </div>
  );
}
