
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  FolderOpen, 
  BarChart2, 
  Settings, 
  Menu, 
  X
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ icon, label, href, isActive, isCollapsed }: NavItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 my-1",
          isActive ? "bg-gray-200 text-gray-800" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/' },
    { icon: <Users size={20} />, label: 'Clients', href: '/clients' },
    { icon: <Calendar size={20} />, label: 'Projects', href: '/projects' },
    { icon: <FileText size={20} />, label: 'Documents', href: '/documents' },
    { icon: <CreditCard size={20} />, label: 'Finances', href: '/finances' },
    { icon: <FolderOpen size={20} />, label: 'Files', href: '/files' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', href: '/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-gray-200">
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 flex-1">Allset</h1>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
