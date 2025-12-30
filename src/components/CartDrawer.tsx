import {
  Box,
  Button,
  Card,
  CloseButton,
  Drawer,
  Portal,
  Text,
  Image,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogFooter,
  DialogBody,
  DialogHeader,
  DialogTitle,
  DialogBackdrop,
} from "@chakra-ui/react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  cartSelector,
  clearCartAction,
  updateCartAction,
} from "@/app/features/cart/cartSlice";
import type { IProducts } from "@/interfaces";
import { increaseProductInShopping } from "@/utils";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { networkSelector } from "@/app/features/networkSlice";
import CardDrawerSkeleton from "./Skeletons/CartDrawerSkeleton";

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const { cartProducts } = useSelector(cartSelector);
  const { isOnline } = useSelector(networkSelector);
  const [productToRemove, setProductToRemove] = useState<IProducts | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Increase Product
  const handleIncrease = (product: IProducts)  => {
    const updatedCart = increaseProductInShopping(product, cartProducts);
    dispatch(updateCartAction(updatedCart));
  };
  // Decrease Product
  const handleDecrease = (product: IProducts) => {
    const existItem = cartProducts.find((item) => item.id === product.id);

    if (existItem && existItem.quantity === 1) {
      setProductToRemove(product);
      setIsDialogOpen(true);
    } else {
      const updatedCart = cartProducts.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
      dispatch(updateCartAction(updatedCart));
      toaster.create({
        description: "Product quantity decreased",
        type: "error",
      });
    }
  };
  // Remove Product
  const confirmRemove = () => {
    if (productToRemove) {
      const updatedCart = cartProducts.filter(
        (item) => item.id !== productToRemove.id
      );
      toaster.create({
        description: "Product removed from card",
        type: "error",
      });
      dispatch(updateCartAction(updatedCart));
    }
    setIsDialogOpen(false);
    setProductToRemove(null);
  };
  // Remove All Products
  const handleClearAll = () => {
    if (!cartProducts.length) {
      closeDrawer();
      return;
    }
    dispatch(clearCartAction());
    toaster.create({
      description: "All Products removed from card",
      type: "error",
    });
    closeDrawer();
  };

  const totalPrice = cartProducts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
  if (cartProducts.length === 0 && !isOnline && isDrawerOpen) return <CardDrawerSkeleton />
  return (
    <>
      <Drawer.Root
        open={isDrawerOpen}
        onOpenChange={(e) => setIsDrawerOpen(e.open)}
      >
        <Drawer.Trigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Box position={"relative"}>
              <ShoppingCart width={"25px"} />
              <span
                style={{
                  position: "absolute",
                  backgroundColor: "orange",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  top: "-14px",
                  right: "-14px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "13px",
                }}
              >
                {cartProducts.length}
              </span>
            </Box>
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner zIndex={"99999"}>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>
                  Your Shopping Cart{" "}
                  <Text
                    fontWeight={"bold"}
                    display={"inline-block"}
                    color={"orange.400"}
                  >
                    {cartProducts.length}
                  </Text>
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                {cartProducts.length ? (
                  cartProducts.map((product: IProducts, idx) => {
                    return (
                      <Card.Root key={idx} mb={2}>
                        <Box display={"flex"} alignItems="center" mx={"2"}>
                          <Image
                            src={`${
                              product.thumbnail?.formats?.small?.url
                            }`}
                            alt={product.title.split(" ").slice(0, 1).join(" ")}
                            borderRadius="full"
                            boxSize="80px"
                            objectFit="cover"
                            border="1px solid gold"
                          />

                          <Card.Body gap="2">
                            <Card.Title textAlign="left">
                              {product.title}
                            </Card.Title>
                            <Card.Description fontSize={"md"}>
                              {product.description}
                            </Card.Description>
                            <Text
                              textStyle="2xl"
                              fontWeight="medium"
                              letterSpacing="tight"
                            >
                              ${product.price * product.quantity}
                            </Text>
                          </Card.Body>
                        </Box>
                        <Box
                          display={"flex"}
                          mb={2}
                          justifyContent={"center"}
                          alignItems={"center"}
                          gap={3}
                        >
                          <Button
                            onClick={() => handleDecrease(product)}
                            bg={"orange.400"}
                            w={"25px"}
                            h={"25px"}
                          >
                            <Minus />
                          </Button>
                          <Text
                            textStyle="2xl"
                            fontWeight="medium"
                            letterSpacing="tight"
                          >
                            {product.quantity}
                          </Text>
                          <Button
                            onClick={() => handleIncrease(product)}
                            bg={"orange.400"}
                            w={"25px"}
                            h={"25px"}
                          >
                            <Plus />
                          </Button>
                        </Box>
                      </Card.Root>
                    );
                  })
                ) : (
                  <Text
                    w={"100%"}
                    h={"100%"}
                    color={"red"}
                    fontWeight={"bold"}
                    fontSize={"20px"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    No Shopping yet!
                  </Text>
                )}
              </Drawer.Body>
              <Text fontSize={"18px"} pl={"4"} mb={"4"}>
                Total price:{" "}
                <span style={{ color: "orange", fontWeight: "bold" }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </Text>
              <Drawer.Footer>
                <Button
                  variant="outline"
                  _hover={{ bg: "red", color: "white" }}
                  border="1px solid red"
                  color="red"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
                <Button bg={"orange.400"} onClick={closeDrawer}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      {/* Dialog to warn user if delete product */}
      <DialogRoot
        open={isDialogOpen}
        onOpenChange={(e) => setIsDialogOpen(e.open)}
      >
        <Portal>
          <DialogBackdrop
            style={{
              zIndex: 9999999,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          />
          <DialogContent
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 99999999,
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <DialogHeader>
              <DialogTitle>Remove Product?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>
                Are you sure you want to remove{" "}
                <strong
                  style={{
                    color: "orange",
                    borderBottom: "2px solid orange",
                  }}
                >
                  {productToRemove?.title}
                </strong>{" "}
                from your cart?
              </Text>
            </DialogBody>
            <DialogFooter gap={2}>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600" }}
                onClick={confirmRemove}
              >
                Remove
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </Portal>
      </DialogRoot>
    </>
  );
};
