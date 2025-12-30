import { Box, Card, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { Drawer, Portal } from "@chakra-ui/react";

const CartDrawerSkeleton = () => {
  return (
    <Drawer.Root open={true}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner zIndex={"99999"}>
          <Drawer.Content>
            <Drawer.Header>
              <Skeleton height="24px" width="220px" />
            </Drawer.Header>

            <Drawer.Body>
              {/* Product Items Skeleton */}
              {Array.from({ length: 3 }, (_, idx) => (
                <Card.Root key={idx} mb={2}>
                  <Box display="flex" alignItems="center" mx={2} py={2}>
                    <SkeletonCircle size="80px" />

                    <Box ml={3} flex="1">
                      <Skeleton height="20px" width="150px" mb={2} />
                      <Skeleton height="16px" width="150px" mb={2} />
                      <Skeleton height="24px" width="70px" />
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    mb={2}
                    justifyContent="center"
                    alignItems="center"
                    gap={3}
                  >
                    <Skeleton width="25px" height="25px" borderRadius="md" />
                    <Skeleton height="20px" width="30px" />
                    <Skeleton width="25px" height="25px" borderRadius="md" />
                  </Box>
                </Card.Root>
              ))}
            </Drawer.Body>

            {/* Total Price Skeleton */}
            <Box pl={4} mb={4}>
              <Skeleton height="20px" width="180px" />
            </Box>

            {/* Footer Buttons Skeleton */}
            <Drawer.Footer>
              <Skeleton height="40px" width="120px" borderRadius="md" />
              <Skeleton height="40px" width="120px" borderRadius="md" />
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default CartDrawerSkeleton;
