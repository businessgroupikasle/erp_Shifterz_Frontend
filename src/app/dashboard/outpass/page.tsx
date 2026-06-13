"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Plus, Printer, Edit2 } from "lucide-react";
import NewOutPassDialog from "@/components/outpass/NewOutPassDialog";
import PrintPassDialog from "@/components/outpass/PrintPassDialog";
import { getOutPasses, createOutPass } from "@/lib/api";

interface OutPass {
  id: string;
  passId: string;
  vehicle: string;
  model: string;
  customer: string;
  phone: string;
  service: string;
  outTime: string;
  technician: string;
  security: string;
}

export default function OutPassPage() {
  const [outPasses, setOutPasses] = useState<OutPass[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<OutPass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOutPasses();
  }, []);

  const fetchOutPasses = async () => {
    try {
      setIsLoading(true);
      const data = await getOutPasses();
      setOutPasses(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load out passes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      await createOutPass(data);
      await fetchOutPasses();
    } catch (err) {
      console.error("Failed to save out pass:", err);
    }
  };

  const totalPasses = outPasses.length;

  const handlePrintClick = (pass: OutPass) => {
    setSelectedPass(pass);
    setIsPrintOpen(true);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading out passes...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="bg-yellow-100 text-yellow-700 font-semibold px-4 py-2 rounded-lg inline-block">
          🟨 Total Passes: {totalPasses}
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Out Pass
        </button>
      </div>

      {/* Table */}
      {outPasses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No out passes found</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Out Pass Register</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pass ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehicle
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
                    Out Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {outPasses.map((pass) => (
                <tr key={pass.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-yellow-600">
                    {pass.passId}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {pass.vehicle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pass.model}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold text-gray-900">{pass.customer}</div>
                    <div className="text-xs text-gray-500">{pass.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pass.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pass.outTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {pass.technician}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pass.security}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintClick(pass)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <NewOutPassDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <PrintPassDialog
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        pass={selectedPass || undefined}
      />
    </div>
  );
}
