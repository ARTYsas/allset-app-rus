
import { useAuth } from '@/components/Auth/AuthContext';
import Sidebar from './Sidebar';
import SignIn from '@/components/Auth/SignIn';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <SignIn />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
