import { Badge, Box, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

const ProductPageSkeleton = () => {
  return (
    <>
      <Box maxW={"sm"} mx={"auto"} mt={"20px"}>
        <Skeleton h={"30px"} bg="gray.600" w={"60px"} />
      </Box>
      <Stack
        maxW={"sm"}
        mx={"auto"}
        gap="2"
        mt={"20px"}
        borderRadius={"xl"}
        border={"1px solid #333"}
        p={"2"}
      >
        <SkeletonText
          noOfLines={1}
          height={"200px"}
          width={"350px"}
          mx={"auto"}
        />
        <SkeletonText noOfLines={1} />
        <SkeletonText noOfLines={1} height={"70px"} />
        <SkeletonText noOfLines={1} />
        <Skeleton asChild loading={true} w={"fit-content"} mx={"auto"}>
          <Badge>Select</Badge>
        </Skeleton>
        <Skeleton asChild loading={true} w={"fit-content"} mx={"auto"}>
          <Badge>Select</Badge>
        </Skeleton>
        <Skeleton height="40px" />
      </Stack>
    </>
  );
};

export default ProductPageSkeleton;
