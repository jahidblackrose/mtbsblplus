import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<ApplicationList />} />
          <Route path="/applications/new" element={<ApplicationForm />} />
          <Route path="/applications/:id" element={<ApplicationView />} />
          <Route path="/applications/:id/edit" element={<ApplicationForm />} />
          <Route path="/workflow" element={<Navigate to="/workflow/crm" replace />} />
          <Route path="/workflow/:tab" element={<WorkflowPage />} />
          <Route path="/reports" element={<Navigate to="/reports/pending" replace />} />
          <Route path="/reports/:tab" element={<ReportsPage />} />
          <Route path="/masters" element={<Navigate to="/masters/branches" replace />} />
          <Route path="/masters/:tab" element={<MastersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<SettingsPage />} />
          <Route path="/showcase" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
