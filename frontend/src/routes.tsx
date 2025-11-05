import { createBrowserRouter } from "react-router"; // Use 'react-router-dom' not just 'react-router'
import MainLayout from "./layouts/MainLayout";
import Homepage from "./pages/Homepage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ProductDetails from "./pages/ProductDetails";
import RouteGuard from "./layouts/AuthCheck";
import Profile from "./pages/Users/Profile";

const router = createBrowserRouter([
  // 1. PUBLIC ROUTES (MainLayout wrapper for all non-auth content)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "products/:id", // No leading slash here
        element: <ProductDetails />,
      },
      // 2. PROTECTED ROUTES NESTED UNDER MAINLAYOUT
      {
        // This element acts as the guard for the routes below it.
        // It renders nothing itself, just redirects if unauthenticated.
        element: <RouteGuard requireAuth={true} />,
        children: [
          {
            path: "profile", // Path will be /profile
            element: <Profile />,
          },
          {
            path: "orders", // Path will be /orders
            // element: <OrdersPage />,
          },
        ],
      },
    ],
  },

  // 3. AUTH ROUTES (Protected from logged-in users)
  {
    path: "/auth",
    // Guard that redirects if authenticated (already logged in)
    element: <RouteGuard requireAuth={false} />,
    children: [
      {
        // This route uses the specific AuthLayout
        element: <AuthLayout />,
        children: [
          {
            path: "login", // Path will be /auth/login
            element: <LoginPage />,
          },
          {
            path: "register", // Path will be /auth/register
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
