// RouteGuard.tsx
import Loader from "@/common/Loader";

import { useAuthCheckQuery } from "@/store/slices/userApiSlice";

import { Navigate, Outlet } from "react-router";

interface RouteGuardProps {
  requireAuth?: boolean;
}

function RouteGuard({ requireAuth = false }: RouteGuardProps) {
  const { data, error, isLoading } = useAuthCheckQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const isAuthenticated = data?.success && !error;

  // 🟡 1. Wait until loading finishes before deciding anything
  if (isLoading) {
    return <Loader />;
  }

  // 🟢 2. Protected route (needs auth)
  if (requireAuth) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }
    return <Outlet />;
  }

  // 🔓 3. Public route (redirect if already logged in)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RouteGuard;
