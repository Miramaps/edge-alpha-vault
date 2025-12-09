import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletAddressProvider } from "@/contexts/WalletAddressContext";
import Index from "./pages/Index";
import Channels from "./pages/Channels";
import Leaderboard from "./pages/Leaderboard";
import TraderDashboard from "./pages/TraderDashboard";
import BecomeTrader from "./pages/BecomeTrader";
import Dashboard from "./pages/Dashboard";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/become-trader" element={<BecomeTrader />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/security" element={<Security />} />
            <Route path="/t/:handle" element={<TraderDashboard />} />
            <Route path="/channels/:id" element={<TraderDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WalletAddressProvider>
);

export default App;
