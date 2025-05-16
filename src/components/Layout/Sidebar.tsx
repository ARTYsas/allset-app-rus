
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  FileText,
  Users,
  Briefcase,
  BarChart2,
  Settings,
  FileIcon,
  DollarSign,
  LogOut
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navigation: NavItem[] = [
    { name: "Дашборд", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Проекты", path: "/projects", icon: <Briefcase className="h-5 w-5" /> },
    { name: "Клиенты", path: "/clients", icon: <Users className="h-5 w-5" /> },
    { name: "Документы", path: "/documents", icon: <FileText className="h-5 w-5" /> },
    { name: "Файлы", path: "/files", icon: <FileIcon className="h-5 w-5" /> },
    { name: "Финансы", path: "/finances", icon: <DollarSign className="h-5 w-5" /> },
    { name: "Аналитика", path: "/analytics", icon: <BarChart2 className="h-5 w-5" /> },
    { name: "Настройки", path: "/settings", icon: <Settings className="h-5 w-5" /> }
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6 py-6">
        <div className="px-6">
          <h2 className="text-xl font-bold">IT Workbench</h2>
          <p className="text-sm text-muted-foreground">Управление проектами</p>
        </div>
        <nav className="space-y-1 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.path)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-secondary-foreground"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Выйти
        </button>
      </div>
    </div>
  );
}
