import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CookieService from "@/services/CookieService";
import toast from "react-hot-toast";
import axiosInstance from "@/config/axios.config";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get("jwt");

    if (!jwt) {
      toast.error("Google login failed");
      navigate("/login", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        // 🟢 جلب بيانات اليوزر من Strapi
        const { data } = await axiosInstance.get("/users/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const dateNow = Date.now();
        const IN_DAYS = 3;
        const EXPIRES_AT_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS;
        const expiresDate = new Date(dateNow + EXPIRES_AT_DAYS);
        const option = { path: "/", expires: expiresDate };

        CookieService.set(
          "userInfo",
          {
            jwt,
            email: data.email,
            userName: data.username,
            createdAt: data.createdAt,
          },
          option
        );

        localStorage.setItem("jwt_expires_at", String(expiresDate.getTime()));

        toast.success("Login with Google successfully!");
        navigate("/", { replace: true });
      } catch {
        toast.error("Failed to fetch user data");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return <p>Signing in with Google...</p>;
};

export default GoogleCallback;
