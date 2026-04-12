import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
