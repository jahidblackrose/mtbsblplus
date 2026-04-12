import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import ApplicationList from "./pages/applications/ApplicationList";
import ApplicationForm from "./pages/applications/ApplicationForm";
import ApplicationView from "./pages/applications/ApplicationView";
import WorkflowPage from "./pages/workflow/WorkflowPage";
import ReportsPage from "./pages/reports/ReportsPage";
import MastersPage from "./pages/masters/MastersPage";
import SettingsPage from "./pages/settings/SettingsPage";
import FormShowcase from "./pages/showcase/FormShowcase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
      <Route path="/applications/new" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
      <Route path="/applications/:id" element={<ProtectedRoute><ApplicationView /></ProtectedRoute>} />
      <Route path="/applications/:id/edit" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
      <Route path="/workflow" element={<Navigate to="/workflow/crm" replace />} />
      <Route path="/workflow/:tab" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
      <Route path="/reports" element={<Navigate to="/reports/pending" replace />} />
      <Route path="/reports/:tab" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/masters" element={<Navigate to="/masters/branches" replace />} />
      <Route path="/masters/:tab" element={<ProtectedRoute><MastersPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/showcase" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
