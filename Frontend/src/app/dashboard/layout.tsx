"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar toggleMobileSidebar={toggleMobileSidebar} />

      <div className="flex-1 flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0 transition-all duration-300 relative z-30">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Mobile Sidebar overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/50 z-40"
            onClick={toggleMobileSidebar}
          ></div>
        )}

        {/* Mobile Sidebar container */}
        <div className={`md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
           <Sidebar isOpen={true} toggleSidebar={toggleMobileSidebar} />
        </div>

        {/* Main Content Area */}
        <main 
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : "md:ml-20"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
              </div>
            ) : !isAuthenticated ? (
              null
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
