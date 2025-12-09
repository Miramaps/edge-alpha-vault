import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const Channels = lazy(() => import("./pages/Channels"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const TraderDashboard = lazy(() => import("./pages/TraderDashboard"));
const BecomeTrader = lazy(() => import("./pages/BecomeTrader"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white/70">Loading...</div>}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
