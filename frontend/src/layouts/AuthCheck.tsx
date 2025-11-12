// RouteGuard.tsx
import Loader from "@/common/Loader";

import { useAuthCheckQuery } from "@/store/slices/userApiSlice";

import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

interface RouteGuardProps {
  requireAuth?: boolean;
  allowedRoles?: string[];
}

function RouteGuard({ requireAuth = false, allowedRoles }: RouteGuardProps) {
  const { data, isLoading, error, isUninitialized, isFetching } =
    useAuthCheckQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  if (isLoading || isUninitialized || isFetching) {
    return <Loader />;
  }

  const userRole = data?.user.role;

  if (requireAuth) {
    if (error) {
      return <Navigate to="/auth/login" replace />;
    }
    if (allowedRoles && allowedRoles.length > 0) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        toast.warning("Unauthorized access");
        return <Navigate to="/" replace />;
      }
    }
    return <Outlet />;
  }

  if (!requireAuth && data?.success) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RouteGuard;
