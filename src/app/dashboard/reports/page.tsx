"use client";

import { useState, useEffect } from "react";
import { Download, Wallet, Users, ClipboardList, Wrench } from "lucide-react";
import { getReports } from "@/lib/api";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setIsLoading(true);
        const res = await getReports();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading reports...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  // Fallback to empty values if backend hasn't populated them
  const reports = data || {};
  const billingData = reports.billingData || [];
  const serviceRevenue = reports.serviceRevenue || [];
  const leadSources = reports.leadSources || [];
  const jobSummary = reports.jobSummary || [];
  const inventoryValue = reports.inventoryValue || [];

  const totalInvoiced = reports.totalInvoiced || 0;
  const totalCollected = reports.totalCollected || 0;
  const leadConversion = reports.leadConversion || 0;
  const franchiseRevenue = reports.franchiseRevenue || 0;
  const totalInventoryValue = inventoryValue.reduce((sum: number, item: any) => sum + item.value, 0);

  const downloadCSV = (csvContent: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportReport = (reportType: string) => {
    let csvContent = "";
    const date = new Date().toISOString().split("T")[0];

    if (reportType === "Revenue Report") {
      csvContent = "Service,Amount (₹),Percentage\n";
      serviceRevenue.forEach((item: any) => {
        csvContent += `${item.service},${item.amount},${item.percentage}%\n`;
      });
      const total = serviceRevenue.reduce((sum: number, item: any) => sum + item.amount, 0);
      csvContent += `Total Revenue,${total},100%\n`;
    } else if (reportType === "Lead Report") {
      csvContent = "Lead Source,Count,Percentage\n";
      leadSources.forEach((item: any) => {
        csvContent += `${item.source},${item.count},${item.percentage}%\n`;
      });
      const total = leadSources.reduce((sum: number, item: any) => sum + item.count, 0);
      csvContent += `Total Leads,${total},100%\n`;
    } else if (reportType === "Inventory Report") {
      csvContent = "Category,Stock Value (₹),Items\n";
      inventoryValue.forEach((item: any) => {
        csvContent += `${item.category},${item.value},${item.items}\n`;
      });
      const totalItems = inventoryValue.reduce((sum: number, item: any) => sum + item.items, 0);
      csvContent += `Total,${totalInventoryValue},${totalItems}\n`;
    } else if (reportType === "Invoice Aging") {
      csvContent = "Status,Amount (₹),Document Count\n";
      billingData.forEach((item: any) => {
        csvContent += `${item.status},${item.amount},${item.count}\n`;
      });
      const totalAmount = billingData.reduce((sum: number, item: any) => sum + item.amount, 0);
      const totalCount = billingData.reduce((sum: number, item: any) => sum + item.count, 0);
      csvContent += `Total,${totalAmount},${totalCount}\n`;
    } else if (reportType === "Franchise P&L") {
      csvContent = "Metric,Amount (₹)\n";
      csvContent += `Total Invoiced,${totalInvoiced}\n`;
      csvContent += `Total Collected,${totalCollected}\n`;
      csvContent += `Outstanding,${totalInvoiced - totalCollected}\n`;
      csvContent += `Franchise Revenue,${franchiseRevenue}\n`;
      csvContent += `Collection Rate,${totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : 0}%\n`;
    } else if (reportType === "Job Summary") {
      csvContent = "Job Status,Count\n";
      jobSummary.forEach((item: any) => {
        csvContent += `${item.status},${item.count}\n`;
      });
      const total = jobSummary.reduce((sum: number, item: any) => sum + item.count, 0);
      csvContent += `Total Jobs,${total}\n`;
    }

    const filename = `${reportType.replace(/\s+/g, "_")}_${date}.csv`;
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
            Total Invoiced
          </p>
          <p className="text-3xl font-black text-yellow-600">
            ₹{totalInvoiced.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-green-400 tracking-wider mb-2 uppercase">
            Total Collected
          </p>
          <p className="text-3xl font-black text-green-600">
            ₹{totalCollected.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
            Lead Conversion
          </p>
          <p className="text-3xl font-black text-gray-900">{leadConversion}%</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-purple-400 tracking-wider mb-2 uppercase">
            Franchise Revenue
          </p>
          <p className="text-3xl font-black text-purple-600">
            ₹{franchiseRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue by Service */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-yellow-500" /> Revenue by Service
          </h3>
          <div className="space-y-4">
            {serviceRevenue.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              serviceRevenue.map((item: any) => (
                <div key={item.service}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {item.service}
                    </span>
                    <span className="text-sm font-bold text-gray-600">
                      ₹{item.amount.toLocaleString("en-IN")} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lead Source Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Lead Source Analysis
          </h3>
          <div className="space-y-4">
            {leadSources.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              leadSources.map((item: any) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-semibold text-gray-700 min-w-24">
                      {item.source}
                    </span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">{item.count}</p>
                    <p className="text-xs text-gray-500">({item.percentage}%)</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Invoice Aging */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-purple-500" /> Invoice Aging
          </h3>
          <div className="space-y-3">
            {billingData.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              billingData.map((item: any) => (
                <div key={item.status} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        item.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "Overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.amount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-500">{item.count} docs</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Job Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-500" /> Job Summary
          </h3>
          <div className="space-y-3">
            {jobSummary.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              jobSummary.map((item: any) => (
                <div key={item.status} className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded ${item.color || 'bg-gray-100 text-gray-700'}`}
                  >
                    {item.status}
                  </span>
                  <p className="font-bold text-gray-900">{item.count}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory Value</h3>
          <div className="space-y-3">
            {inventoryValue.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              inventoryValue.map((item: any) => (
                <div key={item.category} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm font-semibold text-gray-700">
                    {item.category}
                  </span>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{item.value.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-500">{item.items} item{item.items > 1 ? "s" : ""}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Export Reports</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExportReport("Revenue Report")}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold rounded-lg transition-colors border border-yellow-200"
          >
            <Download className="w-4 h-4" />
            Revenue Report
          </button>
          <button
            onClick={() => handleExportReport("Lead Report")}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition-colors border border-purple-200"
          >
            <Download className="w-4 h-4" />
            Lead Report
          </button>
          <button
            onClick={() => handleExportReport("Inventory Report")}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg transition-colors border border-green-200"
          >
            <Download className="w-4 h-4" />
            Inventory Report
          </button>
          <button
            onClick={() => handleExportReport("Invoice Aging")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition-colors border border-blue-200"
          >
            <Download className="w-4 h-4" />
            Invoice Aging
          </button>
          <button
            onClick={() => handleExportReport("Franchise P&L")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg transition-colors border border-indigo-200"
          >
            <Download className="w-4 h-4" />
            Franchise P&L
          </button>
          <button
            onClick={() => handleExportReport("Job Summary")}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-semibold rounded-lg transition-colors border border-cyan-200"
          >
            <Download className="w-4 h-4" />
            Job Summary
          </button>
        </div>
      </div>
    </div>
  );
}
