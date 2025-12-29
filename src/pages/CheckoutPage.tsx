import {
  Box,
  Button,
  Card,
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
  Flex,
  Input,
  Field,
} from "@chakra-ui/react";
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector, updateCartAction } from "@/app/features/cart/cartSlice";
import type { IProducts } from "@/interfaces";
import { increaseProductInShopping } from "@/utils";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { networkSelector } from "@/app/features/networkSlice";
import CheckoutSkeleton from "@/components/Skeletons/CheckoutSkeleton ";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();

  const { cartProducts } = useSelector(cartSelector);
  const { isOnline } = useSelector(networkSelector);
  const [productToRemove, setProductToRemove] = useState<IProducts | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  // Handle Form Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Increase Product
  const handleIncrease = (product: IProducts) => {
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
        description: "Product removed from cart",
        type: "error",
      });
      dispatch(updateCartAction(updatedCart));
    }
    setIsDialogOpen(false);
    setProductToRemove(null);
  };

  // Calculate Prices
  const deliveryCost = 20;
  const subtotal = cartProducts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
  const totalPrice = subtotal + deliveryCost;

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      customerInfo: formData,
      products: cartProducts,
      deliveryCost,
      subtotal,
      totalPrice,
    };

    console.log("Order submitted:", orderData);

    toaster.create({
      description: "Order sent successfully!",
      type: "success",
    });

    // هنا تبعت البيانات للـ backend
    // await sendOrder(orderData);
  };
  if (!isOnline) return <CheckoutSkeleton />;
  return (
    <>
      <Button maxW={"sm"} mx={6} mt={"20px"} bg={"orange.400"}>
        <Link to="/products">Go to Products</Link>
      </Button>
      <form onSubmit={handleSubmit}>
        <Box
          display={{ md: "grid" }}
          gridTemplateColumns={{ md: "1fr 1fr" }}
          gap={"4"}
          spaceY={{ base: "4", md: "0" }}
          maxW="1200px"
          mx="auto"
          px={{ base: 4, md: 6 }}
          py={10}
        >
          <Card.Root>
            <Card.Header>
              <Card.Title fontSize="xl">Customer Information</Card.Title>
            </Card.Header>
            <Card.Body gap={4}>
              <Field.Root>
                <Field.Label>Full Name *</Field.Label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Email *</Field.Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Phone Number *</Field.Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+20 123 456 7890"
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Address *</Field.Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  required
                />
              </Field.Root>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
                <Field.Root>
                  <Field.Label>City *</Field.Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Zip Code *</Field.Label>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="12345"
                    required
                  />
                </Field.Root>
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Cart Summary */}
          <Card.Root>
            <Text m={2} fontSize="lg" fontWeight="semibold">
              Your Shopping Cart{" "}
              <Text
                fontWeight={"bold"}
                display={"inline-block"}
                color={"orange.400"}
              >
                ({cartProducts.length})
              </Text>
            </Text>

            <Box maxH="450px" overflowY="auto" px={2}>
              {cartProducts.length ? (
                cartProducts.map((product: IProducts, idx) => {
                  return (
                    <Box key={idx} mb={3} pb={3} borderBottom="1px solid #eee">
                      <Box display={"flex"} alignItems="center" gap={3}>
                        <Image
                          src={`${product.thumbnail?.formats?.small?.url}`}
                          alt={product.title.split(" ").slice(0, 1).join(" ")}
                          borderRadius="full"
                          boxSize="70px"
                          objectFit="cover"
                          border="1px solid gold"
                        />

                        <Box flex="1">
                          <Text fontWeight="semibold" fontSize="sm" mb={1}>
                            {product.title}
                          </Text>
                          <Text fontSize="xs" color="gray.500" mb={1}>
                            {product.description}
                          </Text>
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="orange.400"
                          >
                            ${(product.price * product.quantity).toFixed(2)}
                          </Text>
                        </Box>
                      </Box>

                      <Box
                        display={"flex"}
                        mt={2}
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={3}
                      >
                        <Button
                          onClick={() => handleDecrease(product)}
                          bg={"orange.400"}
                          size="xs"
                          w={"28px"}
                          h={"28px"}
                          _hover={{ bg: "orange.500" }}
                        >
                          <Minus size={16} />
                        </Button>
                        <Text
                          fontWeight="semibold"
                          minW="30px"
                          textAlign="center"
                        >
                          {product.quantity}
                        </Text>
                        <Button
                          onClick={() => handleIncrease(product)}
                          bg={"orange.400"}
                          size="xs"
                          w={"28px"}
                          h={"28px"}
                          _hover={{ bg: "orange.500" }}
                        >
                          <Plus size={16} />
                        </Button>
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Text
                  w={"100%"}
                  h={"400px"}
                  color={"red"}
                  fontWeight={"bold"}
                  fontSize={"18px"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  No Shopping yet!
                </Text>
              )}
            </Box>

            {cartProducts.length > 0 && (
              <Box borderTop="2px solid #eee" pt={3} px={3}>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontSize={"16px"}>Subtotal:</Text>
                  <Text fontWeight="semibold">${subtotal.toFixed(2)}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontSize={"16px"}>Delivery Cost:</Text>
                  <Text fontWeight="semibold" color="orange.400">
                    ${deliveryCost.toFixed(2)}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  mb={4}
                  pt={2}
                  borderTop="1px solid #eee"
                >
                  <Text fontSize={"18px"} fontWeight="bold">
                    Total Price:
                  </Text>
                  <Text fontSize={"20px"} fontWeight="bold" color="orange.400">
                    ${totalPrice.toFixed(2)}
                  </Text>
                </Flex>
                <Button
                  type="submit"
                  bg={"orange.400"}
                  w="100%"
                  _hover={{ bg: "orange.500" }}
                  disabled={!cartProducts.length}
                >
                  Send Order
                </Button>
              </Box>
            )}
          </Card.Root>
        </Box>
      </form>

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

export default CheckoutPage;
