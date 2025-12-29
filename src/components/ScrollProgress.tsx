
import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

const ScrollProgress = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollerRef.current) return;

      const scrollTop = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / height) * 100;

      scrollerRef.current.style.width = `${scrollPercentage}%`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      ref={scrollerRef}
      position="fixed"
      top={0}
      left={0}
      height="4px"
      bg="orange.400"
      zIndex={99999999}
      transition="width 0.1s ease"
    />
  );
};

export default ScrollProgress;
