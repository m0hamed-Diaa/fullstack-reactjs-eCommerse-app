import CookieService from "@/services/CookieService";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SessionWatcher = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const expiresAt = localStorage.getItem("jwt_expires_at");
    if (!expiresAt) return;
    const expiredATTime = Number(expiresAt);
    const timeLeft = expiredATTime - Date.now();

    const logout = () => {
      localStorage.removeItem("jwt_expires_at");
      CookieService.remove("userInfo", { path: "/" });
      navigate("/login", { replace: true });
      toast.success("For security reasons, you have been logged out. Please sign in again.", {
        duration: 6000
      })
    };

    if (timeLeft > 0) {
      const timer = setTimeout(logout, timeLeft);
      return () => clearTimeout(timer);
    } else {
      logout();
    }
  }, [navigate]);

  return null;
};

export default SessionWatcher;
