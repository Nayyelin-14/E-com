import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

// Eagerly load layouts (they're used immediately)
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import RouteGuard from "./layouts/AuthCheck";
import Loader from "./common/Loader";

// Lazy load pages
const Homepage = lazy(() => import("./pages/Homepage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Profile = lazy(() => import("./pages/Users/Profile"));
const SettingPage = lazy(() => import("./pages/Users/SettingPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Homepage />
          </Suspense>
        ),
      },
      {
        path: "products/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductDetails />
          </Suspense>
        ),
      },

      {
        element: (
          <Suspense fallback={<Loader />}>
            <RouteGuard requireAuth={true} />
          </Suspense>
        ),
        children: [
          {
            path: "profile",
            element: (
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "setting",
            element: (
              <Suspense fallback={<Loader />}>
                <SettingPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    path: "/auth",
    element: (
      <Suspense fallback={<Loader />}>
        <RouteGuard requireAuth={false} />
      </Suspense>
    ),
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<Loader />}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: "register",
            element: (
              <Suspense fallback={<Loader />}>
                <RegisterPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
