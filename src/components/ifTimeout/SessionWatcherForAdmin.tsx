import CookieService from "@/services/CookieService";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SessionWatcherForAdmin = () => {
  const navigate = useNavigate();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      const expiresAt = localStorage.getItem("admin_jwt_expires_at");

      if (!expiresAt) {
        return;
      }

      const timeLeft = Number(expiresAt) - Date.now();

      if (timeLeft <= 0) {

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        localStorage.removeItem("admin_jwt_expires_at");
        CookieService.remove("AdminInfo", { path: "/" });

        toast.success(
          "For security reasons, you have been logged out. Please sign in again.",
          { duration: 6000 }
        );

        navigate("/admin/login", { replace: true });
      }
    }, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigate]);

  return null;
};

export default SessionWatcherForAdmin;
