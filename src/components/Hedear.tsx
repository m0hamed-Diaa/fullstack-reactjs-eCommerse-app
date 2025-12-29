import { Heading, Stack, Text, Button, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);
const MotionBox = motion.create(Box);

export default function Header() {
  return (
    <Box
      position={"relative"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      h={"100vh"}
      w={"100%"}
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "-1",
        w: "100%",
        h: "100%",
        bg: "orange.300",
        opacity: ".3",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexDirection={{ base: "column-reverse", xl: "row" }}
        alignItems={"center"}
        gap={{ base: "0", lg: "10" }}
      >
        <Stack
          textAlign={"center"}
          align={"center"}
          gap={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "3xl", md: "5xl" }}
            lineHeight={"110%"}
          >
            Made for you,{" "}
            <Text as={"span"} color={"orange.400"}>
              shopping now
            </Text>
          </Heading>
          <Text color={"gray.500"} maxW={"3xl"}>
            Explore trending products, exclusive deals, and new arrivals picked
            specially for you. Start shopping now and enjoy a modern, fast, and
            secure e-commerce experience.
          </Text>
          <Stack gap={6} direction={"row"}>
            <MotionButton
              rounded="full"
              px={6}
              colorScheme="orange"
              bg="orange.400"
              _hover={{ bg: "orange.500" }}
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0px rgba(255,140,0,0.7)",
                  "0 0 12px rgba(255,140,0,1)",
                  "0 0 0px rgba(255,140,0,0.7)",
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <RouterLink to={"/products"}>Go to Products</RouterLink>
            </MotionButton>

            <Button rounded={"full"} px={6}>
              <RouterLink to={"/about"}>Our Services</RouterLink>
            </Button>
          </Stack>
        </Stack>
        <Stack w={"300px"} h={"400px"} mt={{ base: "100px", lg: "0" }}>
          <MotionBox
            backgroundImage={'url("../../src/assets/an orange shopping c.png")'}
            backgroundSize={"cover"}
            w={"100%"}
            h={"100%"}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
              boxShadow: [
                "0 0 0px rgba(255,140,0,0.7)",
                "0 0 15px rgba(255,140,0,1)",
                "0 0 0px rgba(255,140,0,0.7)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
