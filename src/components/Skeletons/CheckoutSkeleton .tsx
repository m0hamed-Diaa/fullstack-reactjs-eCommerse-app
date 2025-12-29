import { Box, Card, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";

const CheckoutSkeleton = () => {
  return (
    <>
      <Box maxW={"sm"} mt={"20px"} mx={6}>
        <Skeleton h={"30px"} bg="gray.600" w={"60px"} />
      </Box>
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
        {/* Customer Information Skeleton */}
        <Card.Root>
          <Card.Header>
            <Skeleton height="28px" width="200px" />
          </Card.Header>
          <Card.Body gap={4}>
            {/* Full Name */}
            <Box>
              <Skeleton height="16px" width="80px" mb={2} />
              <Skeleton height="40px" width="100%" />
            </Box>

            {/* Email */}
            <Box>
              <Skeleton height="16px" width="60px" mb={2} />
              <Skeleton height="40px" width="100%" />
            </Box>

            {/* Phone */}
            <Box>
              <Skeleton height="16px" width="110px" mb={2} />
              <Skeleton height="40px" width="100%" />
            </Box>

            {/* Address */}
            <Box>
              <Skeleton height="16px" width="70px" mb={2} />
              <Skeleton height="40px" width="100%" />
            </Box>

            {/* City & Zip Code */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
              <Box>
                <Skeleton height="16px" width="50px" mb={2} />
                <Skeleton height="40px" width="100%" />
              </Box>
              <Box>
                <Skeleton height="16px" width="70px" mb={2} />
                <Skeleton height="40px" width="100%" />
              </Box>
            </Box>
          </Card.Body>
        </Card.Root>

        {/* Cart Summary Skeleton */}
        <Card.Root>
          <Box m={2}>
            <Skeleton height="24px" width="220px" />
          </Box>

          <Box px={2} py={3}>
            {/* Product Items Skeleton */}
            {[1, 2, 3].map((item) => (
              <Box key={item} mb={3} pb={3} borderBottom="1px solid #eee">
                <Box display="flex" alignItems="center" gap={3}>
                  <SkeletonCircle size="70px" />

                  <Box flex="1">
                    <Skeleton height="18px" width="150px" mb={2} />
                    <Skeleton height="14px" width="200px" mb={2} />
                    <Skeleton height="20px" width="80px" />
                  </Box>
                </Box>

                <Box
                  display="flex"
                  mt={3}
                  justifyContent="center"
                  alignItems="center"
                  gap={3}
                >
                  <Skeleton width="28px" height="28px" borderRadius="md" />
                  <Skeleton height="20px" width="30px" />
                  <Skeleton width="28px" height="28px" borderRadius="md" />
                </Box>
              </Box>
            ))}
          </Box>

          {/* Price Summary Skeleton */}
          <Box borderTop="2px solid #eee" pt={3} px={3}>
            <Flex justifyContent="space-between" mb={2}>
              <Skeleton height="20px" width="80px" />
              <Skeleton height="20px" width="60px" />
            </Flex>
            <Flex justifyContent="space-between" mb={2}>
              <Skeleton height="20px" width="100px" />
              <Skeleton height="20px" width="50px" />
            </Flex>
            <Flex
              justifyContent="space-between"
              mb={4}
              pt={2}
              borderTop="1px solid #eee"
            >
              <Skeleton height="24px" width="100px" />
              <Skeleton height="28px" width="80px" />
            </Flex>
            <Skeleton height="40px" width="100%" borderRadius="md" />
          </Box>
        </Card.Root>
      </Box>
    </>
  );
};

export default CheckoutSkeleton;
