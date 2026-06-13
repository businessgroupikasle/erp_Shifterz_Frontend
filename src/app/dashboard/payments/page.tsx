"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import PaymentReceiptDialog from "@/components/payments/PaymentReceiptDialog";
import RecordPaymentDialog from "@/components/payments/RecordPaymentDialog";
import { getPayments, createPayment, deletePayment } from "@/lib/api";

interface Payment {
  id: string;
  invoiceId: string;
  client: string;
  amount: number;
  mode: string;
  date: string;
  ref: string;
  notes: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await getPayments();
      setPayments(data);
      setError("");
    } catch (err: any) {
      setError("Failed to load payments: " + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePaymentModes = () => {
    const modes: Record<string, number> = {
      UPI: 0,
      Cash: 0,
      Card: 0,
      NEFT: 0,
      Cheque: 0,
    };

    payments.forEach((p) => {
      const amount = p.amount || 0;
      if (modes[p.mode] !== undefined) {
        modes[p.mode] += amount;
      }
    });
    return modes;
  };

  const paymentModes = calculatePaymentModes();
  const totalCollected = Object.values(paymentModes).reduce((a, b) => a + b, 0);

  const formatAmount = (num: number) => {
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const handleAddPayment = async (newPayment: any) => {
    try {
      const created = await createPayment(newPayment);
      setPayments([...payments, created]);
      setIsRecordPaymentOpen(false);
    } catch (err: any) {
      alert("Failed to create payment: " + err.message);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Delete this payment?")) return;
    try {
      await deletePayment(id);
      setPayments(payments.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (isLoading) return <div className="p-8">Loading payments...</div>;

  return (
    <div className="p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Total Collected</p>
          <p className="text-3xl font-black text-[#22c55e]">{formatAmount(totalCollected)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">UPI / Online</p>
          <p className="text-3xl font-black text-gray-900">{formatAmount(paymentModes.UPI)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Cash</p>
          <p className="text-3xl font-black text-gray-900">{formatAmount(paymentModes.Cash)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Card / NEFT</p>
          <p className="text-3xl font-black text-gray-900">{formatAmount(paymentModes.Card + paymentModes.NEFT + paymentModes.Cheque)}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsRecordPaymentOpen(true)}
          className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-3" />
          Record Payment
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pay ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice / Ref</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mode</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-medium text-xs">{p.id}</td>
                  <td className="px-6 py-4 text-[#eab308] font-semibold text-xs">{p.invoiceId || "-"}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">{p.client}</td>
                  <td className="px-6 py-4 font-bold text-[#22c55e]">{formatAmount(p.amount)}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                      {p.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs font-medium">{p.date}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{p.ref || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(p);
                          setIsReceiptOpen(true);
                        }}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-md border border-gray-200 transition-colors shadow-sm"
                        title="View Receipt"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePayment(p.id)}
                        className="p-1.5 hover:bg-red-50 text-red-400 rounded-md border border-red-100 transition-colors shadow-sm bg-red-50/50"
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

      {/* Dialogs */}
      <RecordPaymentDialog
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onSubmit={handleAddPayment}
      />

      <PaymentReceiptDialog
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        payment={selectedPayment ? {
          id: selectedPayment.id,
          invoiceRef: selectedPayment.invoiceId,
          client: selectedPayment.client,
          amount: selectedPayment.amount.toString(),
          mode: selectedPayment.mode,
          date: selectedPayment.date,
          reference: selectedPayment.ref
        } : undefined}
      />
    </div>
  );
}
