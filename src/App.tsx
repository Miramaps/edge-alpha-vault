import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Channels from "./pages/Channels";
import Leaderboard from "./pages/Leaderboard";
import TraderDashboard from "./pages/TraderDashboard";
import BecomeTrader from "./pages/BecomeTrader";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="/t/:handle" element={<TraderDashboard />} />
          <Route path="/channels/:id" element={<TraderDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
