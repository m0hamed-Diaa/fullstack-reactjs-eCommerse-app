import {
  Box,
  Flex,
  Button,
  HStack,
  Icon,
  Avatar,
  Menu,
  chakra,
  Stack,
  Center,
} from "@chakra-ui/react";
import { Sun, Moon, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Link, NavLink as RouterLink, useNavigate } from "react-router-dom";
import Modal from "./Dialog";
import CookieService from "@/services/CookieService";
import toast from "react-hot-toast";
import { CartDrawer } from "./CartDrawer";

const RouterChakraLink = chakra(RouterLink);

const Links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
];

const Navlink = ({ 
  name, 
  path, 
  onClick 
}: { 
  name: string; 
  path: string;
  onClick?: () => void;
}) => (
  <RouterChakraLink
    to={path}
    px={3}
    py={2}
    rounded="md"
    p={"4px"}
    _hover={{ bg: "orange.400", p: "4px", textDecoration: "none" }}
    _active={{
      bg: "orange.400",
    }}
    onClick={onClick}
  >
    {name}
  </RouterChakraLink>
);

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  
  const onLogout = () => {
    localStorage.removeItem("jwt_expires_at");
    CookieService.remove("userInfo", { path: "/" });
    toast.success("You Layout From App", {
      duration: 1500,
    });
    navigate("/login", { replace: true });
  };
  
  const handleLinkClick = () => {
    setIsOpen(false);
  };
  
  const UserData = CookieService.get("userInfo");
  
  return (
    <Box
      bg={colorMode === "light" ? "gray.100" : "gray.800"}
      px={4}
      width={"100%"}
      zIndex={"99999"}
      position={"sticky"}
      top={"0"}
      left={"0"}
      borderBottomWidth={"2px"}
      borderBottomStyle={"solid"}
      borderBottomColor={colorMode == "dark" ? "gray.700" : "gray.200"}
    >
      <Flex h={16} align="center" justify="space-between">
        {/* Mobile Hamburger */}
        <Button
          display={{ md: "none" }}
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
        >
          <Icon as={isOpen ? X : MenuIcon} />
        </Button>

        {/* Logo */}
        <Box fontWeight="bold">
          <RouterLink to={`/`}>
            <Avatar.Root size="2xl" w={"40px"} h={"40px"} objectFit={"cover"}>
              <img src="./E-commerce_logo_with.png" />
            </Avatar.Root>
          </RouterLink>
        </Box>

        {/* Desktop Links */}
        <HStack as="nav" gap={4} display={{ base: "none", md: "flex" }}>
          {Links.map((link) => (
            <Navlink key={link.name} name={link.name} path={link.path} />
          ))}
        </HStack>

        {/* Right Side */}
        <HStack gap={4}>
          {/* Dark Mode Toggle */}
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <Moon /> : <Sun />}
          </Button>
          {/* CartIcon Of Nav */}
          <CartDrawer />

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" p={0} rounded="full">
                <Avatar.Root size="sm">
                  <Avatar.Fallback>
                    {UserData
                      ? UserData.userName.slice(0, 1).toUpperCase()
                      : "U"}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Button>
            </Menu.Trigger>

            <Menu.Content
              alignItems={"center"}
              style={{
                marginTop: "279px",
                marginLeft: "43px",
                position: "absolute",
              }}
            >
              <br />
              <Center>
                <Avatar.Root size="sm" bg={"blue.800"}>
                  <Avatar.Fallback
                    color={colorMode === "dark" ? "dark" : "white"}
                  >
                    {UserData
                      ? UserData.userName.slice(0, 1).toUpperCase()
                      : "U"}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Center>
              <br />
              <Center>
                <p>{UserData ? UserData.userName : "Username"}</p>
              </Center>
              <br />
              <Menu.Item
                value="profile"
                style={{ cursor: "pointer", marginBottom: "4px" }}
              >
                <Link
                  to={"/profile"}
                  style={{ width: "100%", display: "block", border: "none" }}
                >
                  Profile
                </Link>
              </Menu.Item>

              <Modal
                onClick={onLogout}
                value="Logout"
                title="Logout From App"
                description="If You Click on Logout Button, you will layout from App and Will Sign in again to access!"
              />
            </Menu.Content>
          </Menu.Root>
        </HStack>
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" gap={4}>
            {Links.map((link) => (
              <Navlink 
                key={link.name} 
                name={link.name} 
                path={link.path}
                onClick={handleLinkClick}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}