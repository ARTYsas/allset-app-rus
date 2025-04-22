
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  FileText,
  FolderClosed,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Allset
          </h2>
          <div className="space-y-1">
            <SidebarItem Icon={LayoutDashboard} to="/">
              Dashboard
            </SidebarItem>
            <SidebarItem Icon={Users} to="/clients">
              Clients
            </SidebarItem>
            <SidebarItem Icon={FolderClosed} to="/projects">
              Projects
            </SidebarItem>
            <SidebarItem Icon={FileText} to="/documents">
              Documents
            </SidebarItem>
            <SidebarItem Icon={Wallet} to="/finances">
              Finances
            </SidebarItem>
            <SidebarItem Icon={Home} to="/files">
              Files
            </SidebarItem>
            <SidebarItem Icon={BarChart} to="/analytics">
              Analytics
            </SidebarItem>
            <SidebarItem Icon={Settings} to="/settings">
              Settings
            </SidebarItem>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  Icon: LucideIcon;
  children: React.ReactNode;
  to: string;
}

function SidebarItem({ Icon, children, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "transparent"
        )
      }
    >
      <Icon className="mr-2 h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  );
}
