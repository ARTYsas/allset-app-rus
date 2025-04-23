
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderClosed,
  FileText,
  Wallet,
  Home,
  BarChart,
  Settings
} from "lucide-react";

// List of navigation items (same as your menu, add more as needed)
const navItems = [
  { label: "Главная", to: "/", icon: LayoutDashboard },
  { label: "Клиенты", to: "/clients", icon: Users },
  { label: "Проекты", to: "/projects", icon: FolderClosed },
  { label: "Документы", to: "/documents", icon: FileText },
  { label: "Финансы", to: "/finances", icon: Wallet },
  { label: "Файлы", to: "/files", icon: Home },
  { label: "Аналитика", to: "/analytics", icon: BarChart },
  { label: "Настройки", to: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar className="!bg-sidebar !text-sidebar-foreground">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Allset</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                  >
                    <NavLink to={item.to} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
