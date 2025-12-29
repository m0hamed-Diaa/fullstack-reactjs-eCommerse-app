import { useColorMode } from "@/components/ui/color-mode";
import CookieService from "@/services/CookieService";
import {
  Avatar,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Calendar, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import Dialog from "@/components/Dialog";

const ProfilePage = () => {
  const UserData = CookieService.get("userInfo");
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  if (!UserData) {
    navigate("/admin/login");
    return null;
  }

  const createdDate = UserData.createdAt
    ? new Date(UserData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const handleLogout = () => {
    localStorage.removeItem("jwt_expires_at");
    CookieService.remove("userInfo", { path: "/" });
    toast.success("Logged out successfully!");
    navigate("/login", { replace: true });
  };

  const firstLetter = UserData.userName?.charAt(0).toUpperCase() || "A";

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={colorMode === "dark" ? "gray.900" : "gray.100"}
      p={4}
    >
      <Box
        maxW="500px"
        w="full"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        borderRadius="2xl"
        boxShadow="xl"
        p={{ base: 2, sm: 8 }}
      >
        {/* Avatar Section */}
        <VStack gap={4} mb={6}>
          <Avatar.Root size="2xl" bg="orange.400">
            <Avatar.Fallback fontSize="4xl" color="white">
              {firstLetter}
            </Avatar.Fallback>
          </Avatar.Root>

          <Heading size="xl" textAlign="center">
            {UserData.userName || "Admin"}
          </Heading>

          <Text
            fontSize="sm"
            color={colorMode === "dark" ? "gray.400" : "gray.600"}
            bg={colorMode === "dark" ? "gray.700" : "gray.100"}
            px={3}
            py={1}
            borderRadius="full"
          >
            User
          </Text>
        </VStack>

        {/* Info Cards */}
        <VStack gap={3} mb={6}>
          {/* Email */}
          <Box
            w="full"
            p={4}
            bg={colorMode === "dark" ? "gray.700" : "orange.50"}
            borderRadius="lg"
            borderLeft="4px solid"
            borderColor="orange.400"
          >
            <HStack gap={3}>
              <Box p={2} bg="orange.400" borderRadius="md" color="white">
                <Mail size={20} />
              </Box>
              <Box flex={1}>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Email Address
                </Text>
                <Text fontWeight="medium">{UserData.email || "N/A"}</Text>
              </Box>
            </HStack>
          </Box>

          {/* Username */}
          <Box
            w="full"
            p={4}
            bg={colorMode === "dark" ? "gray.700" : "blue.50"}
            borderRadius="lg"
            borderLeft="4px solid"
            borderColor="blue.400"
          >
            <HStack gap={3}>
              <Box p={2} bg="blue.400" borderRadius="md" color="white">
                <User size={20} />
              </Box>
              <Box flex={1}>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Username
                </Text>
                <Text fontWeight="medium">{UserData.userName || "N/A"}</Text>
              </Box>
            </HStack>
          </Box>

          {/* Account Created */}
          <Box
            w="full"
            p={4}
            bg={colorMode === "dark" ? "gray.700" : "green.50"}
            borderRadius="lg"
            borderLeft="4px solid"
            borderColor="green.400"
          >
            <HStack gap={3}>
              <Box p={2} bg="green.400" borderRadius="md" color="white">
                <Calendar size={20} />
              </Box>
              <Box flex={1}>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Account Created
                </Text>
                <Text fontWeight="medium">{createdDate}</Text>
              </Box>
            </HStack>
          </Box>
        </VStack>

        {/* Actions */}
        <VStack gap={3}>
          <Button
            w="full"
            colorPalette="blue"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
          <Dialog
            onClick={handleLogout}
            value={
              <>
                <LogOut size={18} />
                Logout
              </>
            }
            title="Are you sure to logout!"
            description="if you logout, you must enter you email and password to access again!"
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default ProfilePage;
