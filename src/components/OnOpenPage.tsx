import { Box, Text, Center, Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function HomeIntro() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!showIntro) return null;

  return (
    <Box
      className="intro-bg"
      position="fixed"
      inset={0}
      zIndex={999999}
      bg={"orange.100"}
    >
      <Center h="100vh" flexDirection="column">
        <Avatar.Root size="2xl" w={"250px"} h={"250px"} objectFit={"cover"}>
          <Avatar.Image src="./E-commerce_logo_with.png" />
        </Avatar.Root>
        <Text
          fontSize="6xl"
          fontWeight="bold"
          color="orange.400"
          className="animate-bounce"
        >
          E-commerse
        </Text>
        <Text fontSize="2xl" color="black" mt={4} className="animate-fade">
          Explore our amazing products!
        </Text>
      </Center>
    </Box>
  );
}
