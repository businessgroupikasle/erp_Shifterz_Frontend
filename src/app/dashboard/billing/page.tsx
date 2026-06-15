"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Plus, Eye, Check, Trash2 } from "lucide-react";
import NewDocumentDialog from "@/components/billing/NewDocumentDialog";
import DocumentPreviewDialog from "@/components/billing/DocumentPreviewDialog";
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from "@/lib/api";

interface BillingDocument {
  id: string;
  type: string;
  client: string;
  phone: string;
  vehicle: string;
  service: string;
  amount: number;
  gst: number;
  discount: number;
  total: number;
  date: string;
  dueDate: string;
  status: string;
  notes: string;
  gstNumber?: string;
  items?: any;
  bankDetails?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  authorizedSignatory?: string;
}

export default function BillingPage() {
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<BillingDocument | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await getInvoices();
      setDocuments(data);
      setError("");
    } catch (err: any) {
      setError("Failed to load invoices: " + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredDocs = documents.filter(
    (doc) => filter === "All" || doc.type === filter
  );

  const totalInvoiced = documents.reduce((sum, doc) => sum + (doc.amount + doc.gst - doc.discount), 0);
  const collected = documents
    .filter((doc) => doc.status === "Paid")
    .reduce((sum, doc) => sum + (doc.amount + doc.gst - doc.discount), 0);
  const pending = documents
    .filter((doc) => doc.status === "Pending")
    .reduce((sum, doc) => sum + (doc.amount + doc.gst - doc.discount), 0);
  const overdue = documents
    .filter((doc) => doc.status === "Overdue")
    .reduce((sum, doc) => sum + (doc.amount + doc.gst - doc.discount), 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Invoice":
        return "bg-purple-100 text-purple-700";
      case "Quotation":
        return "bg-blue-100 text-blue-700";
      case "Proforma":
        return "bg-indigo-100 text-indigo-700";
      case "Estimate":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await deleteInvoice(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const doc = documents.find((d) => d.id === id);
      if (doc && doc.status !== "Paid") {
        await updateInvoice(id, { ...doc, status: "Paid" });
        setDocuments(
          documents.map((d) =>
            d.id === id ? { ...d, status: "Paid" } : d
          )
        );
      }
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    }
  };

  const handleAddInvoice = async (newDoc: any) => {
    try {
      const created = await createInvoice(newDoc);
      setDocuments([...documents, created]);
      setIsDialogOpen(false);
    } catch (err: any) {
      alert("Failed to create invoice: " + err.message);
    }
  };

  if (isLoading) return <div className="p-8">Loading invoices...</div>;

  return (
    <div className="p-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Invoiced</p>
          <p className="text-3xl font-bold text-gray-900">₹{totalInvoiced.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Collected</p>
          <p className="text-3xl font-bold text-green-600">₹{collected.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">₹{pending.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Overdue</p>
          <p className="text-3xl font-bold text-red-600">₹{overdue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["All", "Invoice", "Quotation", "Estimate", "Proforma"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === tab
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Document
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doc No.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-yellow-600">{doc.id}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${getTypeColor(doc.type)}`}>
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold text-gray-900">{doc.client}</div>
                    <div className="text-xs text-gray-500">{doc.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doc.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doc.service}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₹{((doc.amount || 0) + (doc.gst || 0) - (doc.discount || 0)).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doc.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDocument(doc);
                          setIsPreviewOpen(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleMarkAsPaid(doc.id)}
                        className={`p-1 rounded transition-colors ${
                          doc.status === "Paid"
                            ? "bg-green-100"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        <Check className={`w-4 h-4 ${doc.status === "Paid" ? "text-green-600" : "text-gray-600"}`} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
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
      <NewDocumentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddInvoice}
      />
      <DocumentPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={selectedDocument ? {
          docNo: selectedDocument.id,
          type: selectedDocument.type,
          client: selectedDocument.client,
          phone: selectedDocument.phone,
          vehicle: selectedDocument.vehicle,
          service: selectedDocument.service,
          base: (selectedDocument.amount || 0).toString(),
          gst: (selectedDocument.gst || 0).toString(),
          total: ((selectedDocument.amount || 0) + (selectedDocument.gst || 0) - (selectedDocument.discount || 0)).toString(),
          date: selectedDocument.date,
          due: selectedDocument.dueDate,
          gstNumber: selectedDocument.gstNumber,
          items: selectedDocument.items,
          bankDetails: selectedDocument.bankDetails,
          paymentTerms: selectedDocument.paymentTerms,
          deliveryTerms: selectedDocument.deliveryTerms,
          authorizedSignatory: selectedDocument.authorizedSignatory
        } : undefined}
      />
    </div>
  );
}
