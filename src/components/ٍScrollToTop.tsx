import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bottom: "20px",
        right: "20px",
        transform: visible ? "translateX(0)" : "translateX(100px)",
        opacity: visible ? 1 : 0,
        transition: "all 0.4s ease-in-out",
        backgroundColor: "orange",
        zIndex: 99999,
        borderRadius: "50%",
        width: "33px",
        height: "33px",
        border: "none",
        cursor: "pointer",

        pointerEvents: visible ? "auto" : "none",
      }}
      aria-label="Scroll to top"
    >
      <ChevronUp size={18} />
    </button>
  );
};

export default ScrollToTop;
