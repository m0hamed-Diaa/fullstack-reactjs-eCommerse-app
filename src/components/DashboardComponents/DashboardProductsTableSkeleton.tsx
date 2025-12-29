import { Box, Flex, HStack, Skeleton, Stack, VStack } from "@chakra-ui/react";

const DashboardProductsTableSkeleton = () => {
  return (
    <>
      {/* control Products Skeleton */}
      <Box
        as={Flex}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDirection={{ base: "column", lg: "row" }}
        gap={{ base: "2", lg: "0" }}
      >
        <HStack gap={6} align="flex-start">
          {/* Sort By Skeleton */}
          <VStack align="stretch" gap={2}>
            <Skeleton height="20px" width="60px" />
            <Skeleton height="40px" width="120px" />
          </VStack>

          {/* Page Size Skeleton */}
          <VStack align="stretch" gap={2}>
            <Skeleton height="20px" width="100px" />
            <Skeleton height="40px" width="120px" />
          </VStack>
        </HStack>

        {/* Search Box Skeleton */}
        <Box mx={"auto"} w={{ base: "full", md: "380px" }} px={"3"}>
          <Skeleton height="40px" width="full" mt={"5"} />
        </Box>

        {/* Pagination Skeleton */}
        <VStack gap={2}>
          <Skeleton height="20px" width="150px" />
          <HStack gap={2}>
            <Skeleton height="36px" width="80px" bg={"orange.400"} />
            <Skeleton height="20px" width="60px" />
            <Skeleton height="36px" width="80px" bg={"orange.400"} />
          </HStack>
        </VStack>
      </Box>
      <Flex mt={5} justifyContent={{ base: "center", md: "start" }}>
        <Skeleton
          h={"30px"}
          bg="blue.600"
          w={"50px"}
        />
      </Flex>
      {/* Table Skeleton */}
      <Stack maxW={"90"} mx={"auto"} my={10} overflowX={"auto"}>
        {Array.from({ length: 10 }, (_, idx) => (
          <Flex
            key={idx}
            alignItems={"center"}
            justifyContent={"space-between"}
            border={"1px solid #333"}
            h={"50px"}
            rounded={"md"}
            gap={2}
            w={"full"}
            p={2}
          >
            <Skeleton h={"9px"} w={"120px"} bg={"gray"} />
            <Skeleton h={"9px"} w={"120px"} bg={"gray"} />
            <Skeleton h={"9px"} w={"120px"} bg={"gray"} />
            <Skeleton h={"9px"} w={"120px"} bg={"gray"} />
            <Flex>
              <Skeleton h={"30px"} bg="purple.400" w={"50px"} mr={4} />
              <Skeleton h={"30px"} bg="red.400" w={"50px"} mr={4} />
              <Skeleton h={"30px"} bg="blue.400" w={"50px"} mr={4} />
            </Flex>
          </Flex>
        ))}
        <Box>
          <Skeleton h={"15px"} w={"250px"} bg={"gray"} mx={"auto"} />
        </Box>
      </Stack>
    </>
  );
};

export default DashboardProductsTableSkeleton;
