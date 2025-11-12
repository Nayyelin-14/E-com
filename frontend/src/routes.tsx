import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

// Eagerly load layouts (they're used immediately)
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import RouteGuard from "./layouts/AuthCheck";
import Loader from "./common/Loader";
import AdminLayout from "./layouts/AdminLayout";

// Lazy load pages
const Homepage = lazy(() => import("./pages/Homepage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const AllProducts = lazy(() => import("./pages/Products/AllProducts"));
const ProductDetails = lazy(() => import("./pages/Products/ProductDetails"));
const CreateProductPage = lazy(
  () => import("./pages/Products/admin/createProductPage")
);
const Profile = lazy(() => import("./pages/Users/Profile"));
const SettingPage = lazy(() => import("./pages/Users/SettingPage"));
// Wrapper component for Suspense
// eslint-disable-next-line react-refresh/only-export-components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Homepage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <AllProducts />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products/:id",
        element: (
          <SuspenseWrapper>
            <ProductDetails />
          </SuspenseWrapper>
        ),
      },

      // Admin routes
      {
        element: <RouteGuard requireAuth={true} allowedRoles={["admin"]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "admin/product/create-products",
                element: (
                  <SuspenseWrapper>
                    <CreateProductPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },

      // Authenticated user routes (admin + customer)
      {
        element: (
          <RouteGuard requireAuth={true} allowedRoles={["admin", "customer"]} />
        ),
        children: [
          {
            path: "profile",
            element: (
              <SuspenseWrapper>
                <Profile />
              </SuspenseWrapper>
            ),
          },
          {
            path: "setting",
            element: (
              <SuspenseWrapper>
                <SettingPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },

  // Auth routes
  {
    path: "/auth",
    element: <RouteGuard requireAuth={false} />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <SuspenseWrapper>
                <LoginPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "register",
            element: (
              <SuspenseWrapper>
                <RegisterPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
