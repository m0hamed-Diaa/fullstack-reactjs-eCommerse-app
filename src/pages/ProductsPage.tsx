import { Badge, Box, Grid, Input } from "@chakra-ui/react";
import ProductCard from "../components/ProductCard";
import type { IProducts } from "@/interfaces";
import useCustomQuery from "@/hooks/useAuthenticatedQuery";
import {
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import CookieService from "@/services/CookieService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { networkSelector } from "@/app/features/networkSlice";

const Products = () => {
  // User_JWT_In_Cookie
  const User_Jwt_Cookie = CookieService.get("userInfo");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { isOnline } = useSelector(networkSelector);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);
  const { isLoading, data } = useCustomQuery({
    queryKey: ["todoList", `${debouncedSearch}`],
    url: `/products?populate=categories&populate=thumbnail&filters[title][$containsi]=${debouncedSearch}`,
    config: {
      headers: {
        Authorization: `Bearer ${User_Jwt_Cookie.jwt}`,
      },
    },
  });
  const searchForProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  if (isLoading || !isOnline)
    return (
      <>
        {/* Search Box Skeleton */}
        <Box mx={"auto"} w={{ base: "full", md: "380px" }} px={"3"}>
          <Skeleton height="40px" width="full" mt={"5"} />
        </Box>
        <Grid
          m={"20px"}
          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          gap="2"
        >
          {Array.from({ length: 6 }, (_, idx) => (
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
      </>
    );
  return (
    <>
      <Box mx={"auto"} w={{ base: "full", md: "380px" }} px={"6"}>
        <Input
          onChange={searchForProduct}
          type="search"
          mt={"5"}
          w={"full"}
          placeholder="Search for product"
          name="search"
          value={search}
          border={"1px solid gray"}
          outline={"none"}
          _focus={{
            border: "1px solid orange",
          }}
        />
        {isLoading && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            Searching...
          </Text>
        )}
      </Box>
      {data?.data.length ? (
        <Box w={"100%"}>
          <Grid
            m={"10px"}
            templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap="2"
          >
            {data?.data?.length ? (
              data?.data?.map((product: IProducts) => (
                <ProductCard product={product} key={product.id} />
              ))
            ) : (
              <Text as={"h2"}>No Products yet!</Text>
            )}
          </Grid>
        </Box>
      ) : (
        <Box
          w={"100%"}
          h={"100vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          NOT Found '
          <Text color={"orange.400"} mx={"2"} borderBottom={"1px solid orange"}>
            {search}
          </Text>
          ' Product
        </Box>
      )}
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

export default Products;
