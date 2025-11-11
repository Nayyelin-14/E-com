// RouteGuard.tsx
import Loader from "@/common/Loader";

import { useAuthCheckQuery } from "@/store/slices/userApiSlice";

import { Navigate, Outlet } from "react-router";

interface RouteGuardProps {
  requireAuth?: boolean;
}

function RouteGuard({ requireAuth = false }: RouteGuardProps) {
  const { data, isLoading, error } = useAuthCheckQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log(data, error);
  if (isLoading) {
    return <Loader />;
  }

  if (requireAuth) {
    if (error) {
      return <Navigate to="/auth/login" replace />;
    }
    return <Outlet />;
  }

  if (!requireAuth && data?.success) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RouteGuard;
