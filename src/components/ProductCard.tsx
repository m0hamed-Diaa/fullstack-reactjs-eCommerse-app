import { Button, Card, Image, Text } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { Link } from "react-router-dom";
import type { IProducts } from "@/interfaces";
import { descriptionControl, timeAgo } from "@/utils";
import { useState } from "react";

interface IProps {
  product: IProducts;
}

const ProductCard = ({ product }: IProps) => {
  const { colorMode } = useColorMode();
  const [isOpenDecription, setOpenDecription] = useState(false);
  return (
    <Card.Root overflow="hidden" m={"3"} position={"relative"}>
      <Text fontSize={"sm"} position={"absolute"} top={"0"} left={"0"} bg={"orange.400"} rounded={"lg"}>{timeAgo(product.createdAt)}</Text>
      <Image
        src={`${product.thumbnail?.url}`}
        alt={product.title.split(" ").slice(0, 1).join(" ")}
        borderRadius={"full"}
        boxSize={"200px"}
        mx={"auto"}
        mt={"10px"}
        objectFit={"cover"}
        border={"1px solid orange"}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "../../src/assets/No Image Vector Symb.png" 
        }}

      />
      <Card.Body gap="2">
        <Card.Title textAlign={"center"}>{product.title}</Card.Title>
        <Card.Description title={product.description} textAlign={"center"} fontSize={"md"} onClick={() => setOpenDecription((prev) => !prev)}>
          {product.description
            ? descriptionControl({ isOpen: isOpenDecription, title: product.description })
            : null}
        </Card.Description>
        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
          ${product.price}
        </Text>
      </Card.Body>
      <Link to={`/products/${product.documentId}`}>
        <Button
          bg={colorMode === "light" ? "#e6f3fd" : "#9f7aea"}
          size={"xl"}
          variant={"outline"}
          border={"none"}
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
        >
          View Details
        </Button>
      </Link>
    </Card.Root>
  );
};

export default ProductCard;
