
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {/* SidebarTrigger (burger icon) floats in top-left for mobile, top-bar for desktop */}
          <div className="lg:hidden flex px-4 pt-4">
            <SidebarTrigger />
          </div>
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

