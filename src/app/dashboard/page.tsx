"use client";

import { useState, useEffect } from "react";
import { TrendingUp, AlertCircle, Car, Users } from "lucide-react";
import { getDashboardData } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getDashboardData();
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  // Fallback to empty arrays/objects if data is null (e.g. backend not returning expected format yet)
  const dashboard = data || {};
  const stats = dashboard.stats || { revenue: 0, revenueGrowth: 0, carsInWorkshop: 0, activeLeads: 0, totalLeads: 0, pendingAmount: 0, overdueCount: 0 };
  const alerts = dashboard.alerts || [];
  const carsIn = dashboard.carsIn || [];
  const recentLeads = dashboard.recentLeads || [];
  const leadSources = dashboard.leadSources || [];
  const invoiceStatus = dashboard.invoiceStatus || [];
  const franchiseRevenue = dashboard.franchiseRevenue || [];

  return (
    <div className="p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Revenue (MAY)
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">₹{stats.revenue.toLocaleString("en-IN")}</p>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              {stats.revenueGrowth}% vs Apr
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Cars in Workshop
          </p>
          <p className="text-3xl font-bold text-gray-900">{stats.carsInWorkshop}</p>
          <p className="text-sm text-gray-600 mt-2">Active right now</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Active Leads
          </p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeLeads}</p>
          <p className="text-sm text-gray-600 mt-2">Total {stats.totalLeads}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Pending / Overdue
          </p>
          <p className="text-3xl font-bold text-red-600">₹{stats.pendingAmount.toLocaleString("en-IN")}</p>
          <p className="text-sm text-gray-600 mt-2">{stats.overdueCount} overdue</p>
        </div>
      </div>

      {/* Alert */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            {alerts.map((alert: string, idx: number) => (
              <p key={idx}>{alert}</p>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cars Currently In */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Cars Currently In
            </h2>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {carsIn.length === 0 ? (
              <p className="text-sm text-gray-500">No cars currently in workshop.</p>
            ) : (
              carsIn.map((car: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">{car.vehicleNo}</p>
                  <p className="text-sm text-gray-600">
                    {car.model} · {car.customer}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                    <span className="text-gray-600">In - {car.inTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Leads
            </h2>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-gray-500">No recent leads.</p>
            ) : (
              recentLeads.map((lead: any) => (
                <div
                  key={lead.name}
                  className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.source}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      lead.color === "yellow"
                        ? "bg-yellow-100 text-yellow-700"
                        : lead.color === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : lead.color === "green"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Sources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Lead Sources
          </h2>
          <div className="space-y-4">
            {leadSources.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              leadSources.map((source: any) => (
                <div key={source.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{source.name}</span>
                    <span className="text-sm text-gray-600">
                      {source.value} ({source.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        source.color === "blue"
                          ? "bg-blue-500"
                          : source.color === "purple"
                            ? "bg-purple-500"
                            : source.color === "green"
                              ? "bg-green-500"
                              : "bg-gray-400"
                      }`}
                      style={{ width: `${source.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invoice Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Invoice Status
          </h2>
          <div className="space-y-4">
            {invoiceStatus.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              invoiceStatus.map((invoice: any) => (
                <div
                  key={invoice.status}
                  className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {invoice.status}
                    </p>
                    <p className="text-sm text-gray-600">{invoice.count} docs</p>
                  </div>
                  <p className="font-semibold text-gray-900">{invoice.amount}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Franchise Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Franchise Revenue
          </h2>
          <div className="space-y-4">
            {franchiseRevenue.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              franchiseRevenue.map((franchise: any) => (
                <div
                  key={franchise.location}
                  className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {franchise.location}
                    </p>
                    <p className="text-sm text-gray-600">{franchise.jobs}</p>
                  </div>
                  <p className="font-semibold text-yellow-600">
                    {franchise.revenue}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
