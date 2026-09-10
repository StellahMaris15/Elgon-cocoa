import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-6">
        <div className="max-w-md text-center">
          <h1 className="font-heading font-bold text-2xl text-primary mb-3">Admin access required</h1>
          <p className="text-muted-foreground">
            Your account is signed in but has no admin role for this cooperative workspace.
            Ask an existing administrator to grant you access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
