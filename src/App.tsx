
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Finances from "./pages/Finances";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/clients" element={<MainLayout><div>Clients Page</div></MainLayout>} />
          <Route path="/projects" element={<MainLayout><div>Projects Page</div></MainLayout>} />
          <Route path="/documents" element={<MainLayout><div>Documents Page</div></MainLayout>} />
          <Route path="/finances" element={<MainLayout><Finances /></MainLayout>} />
          <Route path="/files" element={<MainLayout><div>Files Page</div></MainLayout>} />
          <Route path="/analytics" element={<MainLayout><div>Analytics Page</div></MainLayout>} />
          <Route path="/settings" element={<MainLayout><div>Settings Page</div></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
