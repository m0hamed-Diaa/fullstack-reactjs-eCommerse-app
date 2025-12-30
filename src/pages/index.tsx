import { networkSelector } from "@/app/features/networkSlice";
import Hedear from "@/components/Hedear";
import ProductCard from "@/components/ProductCard";
import useCustomQuery from "@/hooks/useAuthenticatedQuery";
import type { IProducts } from "@/interfaces";
import CookieService from "@/services/CookieService";
import {
  Badge,
  Box,
  Container,
  Grid,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
const MotionBox = motion.create(Box);

const HomePage = () => {
  const { isOnline } = useSelector(networkSelector);
  // User_JWT_In_Cookie
  const User_Jwt_Cookie = CookieService.get("userInfo");

  const { isLoading, data } = useCustomQuery({
    queryKey: ["todoList"],
    url: "/products?populate=categories&populate=thumbnail",
    config: {
      headers: {
        Authorization: `Bearer ${User_Jwt_Cookie.jwt}`,
      },
    },
  });

  return (
    <>
      <Hedear />
      <Container mx={"auto"} textAlign={"center"} as={"div"}>
        <Heading size="md" mb={4} m="5" textAlign={"center"}>
          All Categories
        </Heading>{" "}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="5">
          {[
            "Smartphones 📱",
            "Laptops 💻",
            "Home Appliances 🔌",
            "Accessories 🎧",
          ].map((item, i) => (
            <MotionBox
              key={i}
              shadow="md"
              p={5}
              animate={{
                backgroundColor: [
                  "rgba(255,165,0,0.1)",
                  "rgba(255,165,0,0.3)",
                  "rgba(255,165,0,0.1)",
                ],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item}
            </MotionBox>
          ))}
        </Grid>
      </Container>

      <Container my={"5"}>
        <Heading size="md" mb={3} textAlign={"center"}>
          Best Sellers
        </Heading>
        {isLoading || !isOnline ? (
          <Grid
            m={"20px"}
            templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap="2"
          >
            {Array.from({ length: 4 }, (_, idx) => (
              <Stack
                key={idx}
                gap="2"
                borderRadius={"xl"}
                border={"1px solid #333"}
                p={"2"}
              >
                <HStack width="fit" mx={"auto"}>
                  <SkeletonCircle size="40" />
                </HStack>
                <SkeletonText noOfLines={1} />
                <SkeletonText noOfLines={1} height={"70px"} />
                <Skeleton asChild loading={true} w={"fit-content"}>
                  <Badge>Select</Badge>
                </Skeleton>
                <Skeleton height="40px" />
              </Stack>
            ))}
          </Grid>
        ) : (
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="2">
            {data?.data?.length ? (
              data?.data
                ?.slice(0, 10)
                .map((product: IProducts) => (
                  <ProductCard product={product} key={product.id} />
                ))
            ) : (
              <Text as={"h2"}>No Products yet!</Text>
            )}
          </Grid>
        )}
      </Container>
      {/* Footer */}
      <Box bg="gray.800" color="white" p={6} textAlign="center">
        <Box
          as={"div"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"2"}
        >
          © 2025{" "}
          <Text
            fontWeight={"bold"}
            color={"orange.400"}
            textDecoration={"underline"}
          >
            Mohamed Diaa
          </Text>{" "}
          Store. All rights reserved.
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
