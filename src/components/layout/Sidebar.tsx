"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Car,
  Ticket,
  Users,
  FileText,
  CreditCard,
  Wrench,
  Package,
  Briefcase,
  Building2,
  Users2,
  PieChart,
  Settings,
  Grid3x3,
} from "lucide-react";

const sidebarSections = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: Grid3x3, href: "/dashboard" },
    ],
  },
  {
    label: "WORKSHOP",
    items: [
      { label: "Car In / Out", icon: Car, href: "/dashboard/carin" },
      { label: "Out Pass", icon: Ticket, href: "/dashboard/outpass" },
    ],
  },
  {
    label: "SALES & CRM",
    items: [
      { label: "Leads", icon: Users, href: "/dashboard/leads" },
      { label: "Billing", icon: FileText, href: "/dashboard/billing" },
      { label: "Payments", icon: CreditCard, href: "/dashboard/payments" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Services", icon: Wrench, href: "/dashboard/services" },
      { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
      { label: "Job Cards", icon: Briefcase, href: "/dashboard/jobs" },
    ],
  },
  {
    label: "GROWTH",
    items: [
      { label: "Franchise", icon: Building2, href: "/dashboard/franchise" },
      { label: "Customers", icon: Users2, href: "/dashboard/customers" },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { label: "Reports", icon: PieChart, href: "/dashboard/reports" },
      { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-linear-to-b from-white to-gray-50 border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-bold text-black">
            sz
          </div>
          <span className="font-bold text-gray-900">SHIFTERZ</span>
        </div>
        <p className="text-xs text-gray-500 ml-10">PRO SUITE</p>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-4 py-6">
        {sidebarSections.map((section) => (
          <div key={section.label} className="mb-8">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.label}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-yellow-100 text-gray-900 border-l-4 border-yellow-400"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
