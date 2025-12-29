import { Box, Button, Card, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import useCustomQuery from "@/hooks/useAuthenticatedQuery";
import { LuArrowLeft } from "react-icons/lu";
import { useAppDispatch } from "@/app/store";
import {
  addItemToCartAction,
  cartSelector,
} from "@/app/features/cart/cartSlice";
import { useSelector } from "react-redux";
import { descriptionControl } from "@/utils";
import { toaster } from "@/components/ui/toaster";
import CookieService from "@/services/CookieService";
import { networkSelector } from "@/app/features/networkSlice";
import ProductPageSkeleton from "@/components/Skeletons/ProductPageSkeleton";

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { documentId } = useParams();
  const goBack = () => navigate(-1);
  const [isOpenDecription, setOpenDecription] = useState(false);
  // User_JWT_In_Cookie
  const User_Jwt_Cookie = CookieService.get("userInfo");
  const { isOnline } = useSelector(networkSelector);
  const { isLoading, data } = useCustomQuery({
    queryKey: [`product`, `${documentId}`],
    url: `/products/${documentId}?populate=categories&populate=thumbnail&fields=title,price,description`,
    config: {
      headers: {
        Authorization: `Bearer ${User_Jwt_Cookie.jwt}`,
      },
    },
  });

  const product = data?.data;
  useEffect(() => {
    document.title = `${product?.title} | e-commerse app`;
  }, [product?.title]);
  const addToCartProduct = () => {
    dispatch(addItemToCartAction(product));
    toaster.create({
      description: "Product added to card",
      type: "success",
    });
  };
  const { cartProducts } = useSelector(cartSelector);
  const exitsItem = cartProducts.some((item) => item.id === product?.id);
  if (!product) {
    return <div>Loading...</div>;
  }
  if (isLoading || !isOnline) return <ProductPageSkeleton />;
  return (
    <>
      <Box h={"100vh"} w={"100%"}>
        <Flex
          alignItems={"center"}
          maxW={"sm"}
          mx={"auto"}
          my={7}
          fontSize={"lg"}
          cursor={"pointer"}
          onClick={goBack}
        >
          <LuArrowLeft />
          <Text ml={2}>Back</Text>
        </Flex>
        <Card.Root
          textAlign={"center"}
          maxW={"sm"}
          mx={"auto"}
          overflow="hidden"
          mt={"3"}
          position={"relative"}
        >
          <Image
            src={`${product.thumbnail?.url}`}
            alt={`${product.title.split(" ").slice(0, 1).join(" ")}`}
            borderRadius={"xl"}
            mx={"auto"}
            mt={"10px"}
            boxSize={"340px"}
            objectFit={"cover"}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "../../src/assets/No Image Vector Symb.png";
            }}
          />
          <Card.Body gap="2">
            <Card.Title textAlign={"center"}>{product.title}</Card.Title>
            <Card.Description
              onClick={() => setOpenDecription((prev) => !prev)}
              fontSize={"md"}
              title={product.description}
            >
              {product.description
                ? descriptionControl({
                    isOpen: isOpenDecription,
                    title: product.description,
                  })
                : null}
            </Card.Description>
            <Text
              textStyle="2xl"
              fontWeight="medium"
              letterSpacing="tight"
              mt="2"
            >
              {product.categories[0].title}
            </Text>
            <Text
              textStyle="2xl"
              fontWeight="medium"
              letterSpacing="tight"
              mt="2"
            >
              Price: ${product.price}
            </Text>
          </Card.Body>
          <Link
            style={{ pointerEvents: exitsItem ? "none" : "auto" }}
            to={`/products/${product.documentId}`}
          >
            <Button
              bg={
                exitsItem
                  ? "transparent"
                  : colorMode === "light"
                  ? "#e6f3fd"
                  : "#9f7aea"
              }
              size={"xl"}
              variant={"outline"}
              border={exitsItem ? "" : "none"}
              color={colorMode !== "light" ? "#e6f3fd" : "#9f7aea"}
              overflow={"hidden"}
              w={"95%"}
              _hover={{
                bg: colorMode !== "light" ? "#e6f3fd" : "#9f7aea",
                color: colorMode !== "light" ? "#333" : "#e6f3fd",
                border: "transparent",
              }}
              mb={"10px"}
              mx={"10px"}
              textTransform={"uppercase"}
              onClick={addToCartProduct}
            >
              {exitsItem ? "Product in Cart" : "Add to Cart"}
            </Button>
          </Link>
        </Card.Root>
      </Box>
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

export default ProductPage;
