import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  VStack,
  Portal,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  Avatar,
  type BoxProps,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import {
  Home,
  ShoppingBasket,
  ChartBarStacked,
  Menu,
  Bell,
  ChevronDown,
  X,
  Moon,
  Sun,
} from "lucide-react";

type LucideIcon = typeof Home;
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import CookieService from "@/services/CookieService";
import toast from "react-hot-toast";
import Modal from "../Dialog";

interface LinkItemProps {
  name: string;
  icon: LucideIcon;
  base: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: Home, base: "/admin/dashboard" },
  { name: "Products", icon: ShoppingBasket, base: "/admin/dashboard/products" },
  {
    name: "Categories",
    icon: ChartBarStacked,
    base: "/admin/dashboard/categories",
  },
];

export default function DasboradSidebarWithHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode } = useColorMode();

  // Dynamic colors based on color mode
  const bgColor = colorMode === "dark" ? "gray.900" : "gray.100";
  const sidebarBg = colorMode === "dark" ? "gray.900" : "white";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";
  const navBg = colorMode === "dark" ? "gray.900" : "white";

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Box minH="100vh" bg={bgColor}>
        {/* Desktop Sidebar */}
        <SidebarContent
          onClose={() => setIsOpen(false)}
          onLinkClick={handleLinkClick}
          display={{ base: "none", md: "block" }}
          sidebarBg={sidebarBg}
          borderColor={borderColor}
        />

        {/* Mobile Drawer */}
        {isOpen && (
          <>
            <Portal>
              <Box
                position="fixed"
                inset="0"
                bg="blackAlpha.600"
                zIndex="overlay"
                onClick={() => setIsOpen(false)}
                animation="fadeIn 0.3s ease"
                css={{
                  "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
                }}
              />
            </Portal>
            <Portal>
              <Box
                position="fixed"
                left="0"
                top="0"
                bottom="0"
                w="full"
                maxW="240px"
                bg={sidebarBg}
                zIndex="modal"
                transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
                transition="transform 0.3s ease"
              >
                <SidebarContent
                  onClose={() => setIsOpen(false)}
                  onLinkClick={handleLinkClick}
                  sidebarBg={sidebarBg}
                  borderColor={borderColor}
                />
              </Box>
            </Portal>
          </>
        )}

        {/* Mobile Nav */}
        <MobileNav
          onOpen={() => setIsOpen(true)}
          navBg={navBg}
          borderColor={borderColor}
        />

        {/* Main Content */}
        <Box ml={{ base: 0, md: 60 }} p="4">
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  onLinkClick: () => void;
  sidebarBg: string;
  borderColor: string;
}

const SidebarContent = ({
  onClose,
  onLinkClick,
  display,
  sidebarBg,
  borderColor,
  ...rest
}: SidebarProps) => {
  const AdminInfo = CookieService.get("AdminInfo");
  return (
    <Box
      transition="0.3s ease"
      bg={sidebarBg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      display={display}
      {...rest}
      borderColor={borderColor}
      borderWidth={"1px"}
      borderStyle={"solid"}
    >
      <Flex h="20" alignItems="center" mx="5" justifyContent="space-between">
        <Text fontSize="xl" fontFamily="monospace" fontWeight="bold">
          {AdminInfo.userName ? AdminInfo.userName.toUpperCase() : <>Admin</>}
        </Text>
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          aria-label="close menu"
          variant="ghost"
        >
          <X size={20} />
        </IconButton>
      </Flex>
      {LinkItems.map((link) => {
        const { name, icon, base } = link;
        return (
          <NavItem key={name} icon={icon} base={base} onClick={onLinkClick}>
            {name}
          </NavItem>
        );
      })}
    </Box>
  );
};

interface NavItemProps {
  icon: LucideIcon;
  children: string;
  base: string;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, children, base, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === base;

  return (
    <Link style={{ textDecoration: "none" }} to={`${base}`} onClick={onClick}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? "orange.400" : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={{
          bg: "orange.400",
          color: "white",
        }}
        mb={"2"}
      >
        <Box as={Icon} fontSize={16} mr="4" />
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps {
  onOpen: () => void;
  navBg: string;
  borderColor: string;
}

const MobileNav = ({ onOpen, navBg, borderColor }: MobileProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const AdminInfo = CookieService.get("AdminInfo");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_jwt_expires_at");
    CookieService.remove("AdminInfo", { path: "/" });
    toast.success("You logged out, Please sign in again to access again!", {
      duration: 6000,
    });
    navigate("/admin/login", { replace: true });
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={navBg}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent={{ base: "space-between", md: "flex-end" }}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      >
        <Menu size={20} />
      </IconButton>

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="lg"
        fontWeight="bold"
      >
        {AdminInfo.userName ? AdminInfo.userName.split(" ").slice(0, 1) : <>Admin</>}{" "}
        Dashboard
      </Text>

      <HStack gap={{ base: "0", md: "6" }}>
        {/* Dark Mode Toggle Button */}
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="toggle dark mode"
        >
          {colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </IconButton>

        <IconButton size="lg" variant="ghost" aria-label="notifications">
          <Bell size={20} />
        </IconButton>

        <MenuRoot positioning={{ placement: "bottom-end", gutter: 8 }}>
          <MenuTrigger asChild>
            <Flex
              as="button"
              py={2}
              cursor="pointer"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar.Root size="sm">
                  <Avatar.Fallback>
                    {AdminInfo.userName
                      ? AdminInfo.userName.charAt(0).toUpperCase()
                      : null}
                  </Avatar.Fallback>
                </Avatar.Root>
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  gap="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{AdminInfo.userName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <ChevronDown size={16} />
                </Box>
              </HStack>
            </Flex>
          </MenuTrigger>
          <MenuContent
            bg={navBg}
            borderColor={borderColor}
            position={"absolute"}
            top={"80px"}
            right={"20px"}
          >
            <MenuItem value="profile" cursor={"pointer"}>
              <Link to={"/admin/dashboard/profile"}>Profile</Link>
            </MenuItem>
            <MenuItem value="settings" cursor={"pointer"}>
              Settings
            </MenuItem>
            <MenuItem value="billing" cursor={"pointer"}>
              Billing
            </MenuItem>
            <MenuSeparator />
            <Modal
              onClick={handleLogout}
              value={"Sign out"}
              title="Are you sure to sign out from admin page"
              description="If you sign out from admin page, you will enter your email and password to access!"
            />
          </MenuContent>
        </MenuRoot>
      </HStack>
    </Flex>
  );
};
