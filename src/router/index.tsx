import {
  Route,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import { Text } from "@chakra-ui/react";
import AppLayout from "@/layout/AppLayout";
import { lazy, Suspense } from "react";
import FormErrorHandler from "@/errors/FormErrorHandler";
import UserErrorHandler from "../errors/UserErrorHandler";
import AdminErrorHandler from "@/errors/AdminErrorHandler";

const HomePage = lazy(() => import("@/pages"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const LoginPage = lazy(() => import("@/pages/Login"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const GoogleCallback = lazy(() => import("@/pages/GoogleCallback"));
const DashboardLayout = lazy(
  () => import("@/pages/AdminDashboard/DashboardLayout")
);
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const DashboardProducts = lazy(
  () => import("@/pages/AdminDashboard/DashboardProducts")
);
const AdminLoginPage = lazy(() => import("@/pages/AdminDashboard/AdminLogin"));
const AdminProtectedRouter = lazy(() => import("@/auth/AdminProtectedRouter"));
const UserProtectedRouter = lazy(() => import("@/auth/UserProtectedRouter"));
const AdminProfilePage = lazy(() => import("@/pages/AdminDashboard/AdminProfilePage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));


const router = createHashRouter(
  createRoutesFromElements(
    <>
      {/* User Pages */}
      <Route
        path="/"
        element={
          <UserProtectedRouter allowFor="protected">
            <Suspense
              fallback={
                <Text
                  as={"h1"}
                  style={{ textAlign: "center", marginTop: "100px" }}
                >
                  Loading...
                </Text>
              }
            >
              <AppLayout />
            </Suspense>
          </UserProtectedRouter>
        }
        errorElement={<UserErrorHandler />}
      >
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="products/:documentId" element={<ProductPage />} />
      </Route>
      {/* Admin Router */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRouter allowFor="protected">
            <Suspense
              fallback={
                <Text
                  as={"h1"}
                  style={{ textAlign: "center", marginTop: "100px" }}
                >
                  Loading...
                </Text>
              }
            >
              <DashboardLayout />
            </Suspense>
          </AdminProtectedRouter>
        }
        errorElement={<AdminErrorHandler />}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<DashboardProducts />} />
        <Route path="categories" element={<h1>Categories Page</h1>} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>
      {/* Admin Login */}
      <Route
        path="/admin/login"
        element={
          <AdminProtectedRouter allowFor="public">
            <Suspense
              fallback={
                <Text
                  as={"h1"}
                  style={{ textAlign: "center", marginTop: "100px" }}
                >
                  Loading...
                </Text>
              }
            >
              <AdminLoginPage />
            </Suspense>
          </AdminProtectedRouter>
        }
        errorElement={<FormErrorHandler />}
      />
      {/* User Login */}
      <Route
        path="/login"
        element={
          <UserProtectedRouter allowFor="public">
            <Suspense
              fallback={
                <Text
                  as={"h1"}
                  style={{ textAlign: "center", marginTop: "100px" }}
                >
                  Loading...
                </Text>
              }
            >
              <LoginPage />
            </Suspense>
          </UserProtectedRouter>
        }
        errorElement={<FormErrorHandler />}
      />
      {/* User Register */}
      <Route
        path="/register"
        element={
          <UserProtectedRouter allowFor="public">
            <Suspense
              fallback={
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  Loading...
                </div>
              }
            >
              <RegisterPage />
            </Suspense>
          </UserProtectedRouter>
        }
        errorElement={<FormErrorHandler />}
      />
      {/* Google Callback Login */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      <Route path="*" element={<PageNotFound />} />
    </>
  )
);

export default router;
