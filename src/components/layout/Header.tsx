"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Settings, User, LogOut, Clock } from "lucide-react";

const pageHeaders: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Welcome to Shifterz Pro Suite",
  },
  "/carin": {
    title: "Car In / Out",
    description: "Manage vehicle check-in and check-out",
  },
  "/outpass": {
    title: "Out Pass",
    description: "Manage vehicle out passes",
  },
  "/leads": {
    title: "Leads",
    description: "Manage your sales leads",
  },
  "/billing": {
    title: "Billing",
    description: "Manage billing documents",
  },
  "/payments": {
    title: "Payments",
    description: "Track and manage payments",
  },
  "/services": {
    title: "Services",
    description: "Manage services offered",
  },
  "/inventory": {
    title: "Inventory",
    description: "Manage inventory items",
  },
  "/jobs": {
    title: "Job Cards",
    description: "Manage job cards",
  },
  "/franchise": {
    title: "Franchise",
    description: "Manage franchise locations",
  },
  "/customers": {
    title: "Customers",
    description: "Manage customer information",
  },
  "/reports": {
    title: "Reports",
    description: "View business reports",
  },
  "/settings": {
    title: "Settings",
    description: "Configure your settings",
  },
};

function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function Header() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(getCurrentTime());
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageInfo = pageHeaders[pathname] || {
    title: "Dashboard",
    description: "Welcome to Shifterz Pro Suite",
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageInfo.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{pageInfo.description}</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Current Time Display */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">{currentTime}</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              sessionStorage.clear();
              document.cookie = "token=; path=/; max-age=0";
              window.location.href = '/login';
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500" 
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 ml-2">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
