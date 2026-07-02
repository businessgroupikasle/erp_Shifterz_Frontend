"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import {
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
  LogOut,
  Lock,
  X,
} from "lucide-react";
import { SidebarContext } from "@/lib/context/SidebarContext";

const sidebarSections = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: Grid3x3, href: "/dashboard" },
    ],
  },
  {
    label: "WORKSHOP MANAGEMENT",
    items: [
      { label: "Car In / Out", icon: Car, href: "/dashboard/carin" },
      { label: "Job Cards", icon: Briefcase, href: "/dashboard/jobs" },
      { label: "Services", icon: Wrench, href: "/dashboard/services" },
      { label: "Out Pass", icon: Ticket, href: "/dashboard/outpass" },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Leads", icon: Users, href: "/dashboard/leads" },
      { label: "Customers", icon: Users2, href: "/dashboard/customers" },
      { label: "Franchise", icon: Building2, href: "/dashboard/franchise", locked: true },
    ],
  },
  {
    label: "SALES & BILLING",
    items: [
      { label: "Billing", icon: FileText, href: "/dashboard/billing" },
      { label: "Payments", icon: CreditCard, href: "/dashboard/payments" },
    ],
  },
  {
    label: "INVENTORY",
    items: [
      { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { label: "Reports", icon: PieChart, href: "/dashboard/reports" },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <aside className="w-64 bg-linear-to-b from-white to-gray-50 border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-start justify-between min-h-[88px]">
        <div className="flex flex-col items-start justify-center">
          <Image src="/logo.svg" alt="Shifterz Logo" width={160} height={50} className="h-10 w-auto mb-1" priority />
          <p className="text-[10px] text-gray-500 tracking-widest font-bold ml-1">PRO SUITE</p>
        </div>
        {/* Close button for mobile and tablet */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close sidebar"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
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
                const isLocked = (item as any).locked;

                if (isLocked) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 cursor-not-allowed"
                      title="This section is locked"
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      <Lock className="w-4 h-4 shrink-0 text-red-500" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
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

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.clear();
            document.cookie = "token=; path=/; max-age=0";
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
