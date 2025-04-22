
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
              Главная
            </SidebarItem>
            <SidebarItem Icon={Users} to="/clients">
              Клиенты
            </SidebarItem>
            <SidebarItem Icon={FolderClosed} to="/projects">
              Проекты
            </SidebarItem>
            <SidebarItem Icon={FileText} to="/documents">
              Документы
            </SidebarItem>
            <SidebarItem Icon={Wallet} to="/finances">
              Финансы
            </SidebarItem>
            <SidebarItem Icon={Home} to="/files">
              Файлы
            </SidebarItem>
            <SidebarItem Icon={BarChart} to="/analytics">
              Аналитика
            </SidebarItem>
            <SidebarItem Icon={Settings} to="/settings">
              Настройки
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
