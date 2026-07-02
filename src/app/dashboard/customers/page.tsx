"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import AddCustomerDialog from "@/components/customers/AddCustomerDialog";
import { getCustomers, createCustomer, deleteCustomer } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  model: string;
  visits: number;
  totalSpend: number;
  lastVisit: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true);
        const data = await getCustomers();
        setCustomers(data);
        setError("");
      } catch (err: any) {
        setError("Failed to load customers: " + err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (newCustomer: any) => {
    try {
      const created = await createCustomer(newCustomer);
      setCustomers([...customers, created]);
      setIsDialogOpen(false);
    } catch (err: any) {
      alert("Failed to create customer: " + err.message);
      console.error(err);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    if (!confirm("Delete this customer?")) return;
    deleteCustomer(id)
      .then(() => {
        setCustomers(customers.filter((customer) => customer.id !== id));
      })
      .catch((err: any) => {
        alert("Failed to delete customer: " + err.message);
      });
  };

  const handleViewBilling = (customerId: string, customerName: string) => {
    router.push(`/dashboard/billing?customer=${customerId}&name=${customerName}`);
  };

  if (isLoading) return <div className="p-8">Loading customers...</div>;

  return (
    <div className="p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-3" />
          Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">ID</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Phone</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Vehicle</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Car Model</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Visits</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Total Spend</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Last Visit</th>
                <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-3 text-xs font-mono text-gray-400 whitespace-nowrap">{customer.id}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {customer.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-semibold text-gray-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap text-xs">{customer.phone}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs whitespace-nowrap">{customer.email}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs font-medium whitespace-nowrap">{customer.vehicle}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs whitespace-nowrap">{customer.model}</td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">
                      {customer.visits}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-yellow-600 text-xs whitespace-nowrap">
                    ₹{customer.totalSpend.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-3 text-gray-600 text-xs whitespace-nowrap">{customer.lastVisit}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewBilling(customer.id, customer.name)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-md border border-gray-200 transition-colors shadow-sm"
                        title="View Billing"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-1.5 hover:bg-red-50 text-red-400 rounded-md border border-red-100 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <AddCustomerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddCustomer}
        existingCustomers={customers}
      />
    </div>
  );
}
