import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletAddressProvider } from "@/contexts/WalletAddressContext";
import { WalletProvider } from "@/providers/WalletProvider";
import Index from "./pages/Index";
import Channels from "./pages/Channels";
import Leaderboard from "./pages/Leaderboard";
import TraderDashboard from "./pages/TraderDashboard";
import JoinEdge from "./pages/JoinEdge";
import Dashboard from "./pages/Dashboard";
import Security from "./pages/Security";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WalletProvider>
    <WalletAddressProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/join-edge" element={<JoinEdge />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/security" element={<Security />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/t/:handle" element={<TraderDashboard />} />
              <Route path="/channels/:id" element={<TraderDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </WalletAddressProvider>
  </WalletProvider>
);

export default App;
