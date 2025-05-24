import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SurgicalDashboard } from '@/components/SurgicalDashboard';
import { DataCapture } from '@/components/DataCapture';
import { AIOrchestrator } from '@/components/AIOrchestrator';
import { Navigation } from '@/components/Navigation';
import NotFound from "./pages/NotFound";
import { PostOperative } from '@/components/PostOperative';
import SurgicalRequestUpload from '@/components/SurgicalRequestUpload';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <Navigation />
            <main className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<SurgicalDashboard />} />
                <Route path="/capture" element={<DataCapture />} />
                <Route path="/orchestrator" element={<AIOrchestrator />} />
                <Route path="/post-operative" element={<PostOperative />} />
                <Route path="/surgical-request" element={<SurgicalRequestUpload />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
