import CookieService from "@/services/CookieService";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IProps {
  allowFor: "protected" | "public";
  children: ReactNode;
}

const UserProtectedRouter = ({ children, allowFor }: IProps) => {
  const token = CookieService.get("userInfo");
  const loggedIn = !!token;
  const location = useLocation();

  if (allowFor === "protected" && !loggedIn) {
    return <Navigate to={"/login"} replace state={{ from: location }} />;
  }

  if (allowFor === "public" && loggedIn) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default UserProtectedRouter;
