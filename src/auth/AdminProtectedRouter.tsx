import CookieService from "@/services/CookieService";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IProps {
  allowFor: "protected" | "public";
  children: ReactNode;
}
const AdminProtectedRouter = ({ children, allowFor }: IProps) => {
  const token = CookieService.get("AdminInfo");
  const loggedIn = !!token;
  const location = useLocation();

  if (allowFor === "protected" && !loggedIn) {
    return <Navigate to={"/admin/login"} replace state={{ from: location }} />;
  }

  if (allowFor === "public" && loggedIn) {
    return <Navigate to={"/admin/dashboard"} replace />;
  }

  return children;
};

export default AdminProtectedRouter;
