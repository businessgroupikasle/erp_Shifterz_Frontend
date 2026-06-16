"use client";

import { useState, ReactNode, Children, useEffect } from "react";
import { SidebarContext } from "@/lib/context/SidebarContext";

interface DashboardLayoutClientProps {
  children: ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 1024;
    setIsSidebarOpen(!isSmallScreen);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const childrenArray = Children.toArray(children);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div className="flex h-screen bg-gray-50">
        {/* Overlay for mobile and tablet */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile/tablet by default */}
        <div
          className={`fixed lg:relative z-40 h-screen transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {childrenArray[0]}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {childrenArray[1]}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
