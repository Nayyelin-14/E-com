import { useEffect } from "react";
import Loader from "@/common/Loader";
import { clearUserInfo } from "@/store/slices/auth";
import { useAuthCheckQuery } from "@/store/slices/userApiSlice";
import { useDispatch } from "react-redux";
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

  const dispatch = useDispatch();

  // 1️⃣ Handle errors safely
  useEffect(() => {
    if (error) {
      dispatch(clearUserInfo());
    }
  }, [error, dispatch]);

  // 2️⃣ Handle unauthorized role warning safely
  useEffect(() => {
    if (requireAuth && data?.user && allowedRoles?.length) {
      const role = data.user.role;
      if (!allowedRoles.includes(role)) {
        toast.warning("Unauthorized access");
      }
    }
  }, [data, requireAuth, allowedRoles]);

  // 3️⃣ Loading state
  if (isLoading || isUninitialized || isFetching) {
    return <Loader />;
  }

  // 4️⃣ Error redirect
  if (requireAuth && error) {
    return <Navigate to="/auth/login" replace />;
  }

  // 5️⃣ Role-protected route
  if (requireAuth) {
    const userRole = data?.user.role;
    if (allowedRoles?.length && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  // 6️⃣ Redirect logged-in users away from non-auth routes
  if (!requireAuth && data?.success) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RouteGuard;
