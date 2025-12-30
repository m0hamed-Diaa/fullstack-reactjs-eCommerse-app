import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  Badge,
  Button,
  HStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { Truck, Clock, Shield, Phone, Star, ShoppingBag } from "lucide-react";
import { useColorMode } from "@/components/ui/color-mode";
import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const MotionIcon = motion.create(ShoppingBag);

const Section = ({ children }: { children: React.ReactNode }) => (
  <Box py={{ base: 10, md: 16 }}>{children}</Box>
);

export default function AboutPage() {
  const { colorMode } = useColorMode();

  const bgHero = colorMode === "light" ? "gray.50" : "gray.900";
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const muted = colorMode === "light" ? "gray.600" : "gray.300";

  return (
    <Box>
      {/* Hero */}
      <Box bg={bgHero} borderBottomWidth="1px">
        <Container maxW="7xl" py={{ base: 12, md: 20 }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} alignItems="center">
            <Stack gap={6}>
              <Badge
                colorScheme="green"
                w="fit-content"
                px={3}
                py={1}
                borderRadius="md"
              >
                Fast delivery & responsive support
              </Badge>
              <Heading size={{ base: "xl", md: "2xl" }} color={"orange.400"}>
                Perfossinal — Your trusted online store
              </Heading>
              <Text fontSize="lg" color={muted}>
                Curated products, fair prices, and fast delivery with real‑time
                order updates.
              </Text>

              <Wrap gap={4}>
                <WrapItem bg={"orange.400"} rounded={"xl"} color={bgHero}>
                  <FeatureBadge icon={Truck} label="Same‑day dispatch" />
                </WrapItem>
                <WrapItem bg={"orange.400"} rounded={"xl"} color={bgHero}>
                  <FeatureBadge icon={Clock} label="Delivery in 24–72h" />
                </WrapItem>
                <WrapItem bg={"orange.400"} rounded={"xl"} color={bgHero}>
                  <FeatureBadge icon={Shield} label="Secure payments" />
                </WrapItem>
                <WrapItem bg={"orange.400"} rounded={"xl"} color={bgHero}>
                  <FeatureBadge icon={Phone} label="Live support" />
                </WrapItem>
              </Wrap>

              <HStack gap={4} pt={2}>
                <Button colorScheme="teal" bg={"orange.400"}>
                  <MotionIcon
                    size={18}
                    style={{ marginRight: "8px" }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <Link to={"/products"}>Shop now</Link>
                </Button>
                <Button variant="ghost">
                  <Phone size={18} style={{ marginRight: "8px" }} />
                  Contact support
                </Button>
              </HStack>

              <HStack gap={3} pt={2} color={muted}>
                <Star color="gold" size={18} />
                <Text>4.8/5 average rating from customers</Text>
              </HStack>
            </Stack>

            <Box>
              <Image
                src="./fast-delivery-shipping-concept-3d-rendering_808337-9247.jpg"
                alt="Our team preparing fast deliveries"
                borderRadius="lg"
                shadow="xl"
                objectFit="cover"
                w="100%"
                h={{ base: "300px", md: "100%" }}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
      {/* Stats */}
      <Section>
        <Container maxW="6xl">
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderRadius="lg"
            p={{ base: 6, md: 8 }}
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <StatCard
                label="Orders delivered"
                value="120K+"
                help="Across the region"
              />
              <StatCard
                label="Avg delivery time"
                value="36h"
                help="Order to doorstep"
              />
              <StatCard
                label="Customer satisfaction"
                value="98%"
                help="Post‑delivery"
              />
            </SimpleGrid>
          </Box>
        </Container>
      </Section>
      {/* FAQ */}
      <Section>
        <Container maxW="6xl">
          <Heading size="lg" mb={4}>
            FAQs
          </Heading>
          <FAQItem
            value="faq1"
            q="How fast is delivery?"
            a="Most orders ship same day and arrive within 24–72 hours."
          />
          <FAQItem
            value="faq2"
            q="Which payment methods do you accept?"
            a="Cards, wallets, and cash on delivery in select areas."
          />
        </Container>
      </Section>
      <Box px={8} mb={8} maxW={{base: "full", md: "800px"}} mx="auto" borderRadius="md" overflow="hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4651.622198227308!2d31.361725400152427!3d30.557324602620113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sar!2seg!4v1767034052157!5m2!1sar!2seg"
          width="100%"
          height="450"
          style={{ border: 0, borderRadius: "8px" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Our Location Live"
        />
      </Box>
      {/* Footer */}
      <Box bg="gray.800" color="white" p={6} textAlign="center">
        <Box
          as={"div"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"2"}
        >
          © 2025{" "}
          <Text
            fontWeight={"bold"}
            color={"orange.400"}
            textDecoration={"underline"}
          >
            Mohamed Diaa
          </Text>{" "}
          Store. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
}

/* Subcomponents */

function FeatureBadge({
  icon: IconComp,
  label,
}: {
  icon: IconType;
  label: string;
}) {
  return (
    <HStack
      gap={2}
      borderWidth="1px"
      borderRadius="md"
      px={3}
      py={2}
      bg="whiteAlpha.600"
      backdropFilter="saturate(180%) blur(4px)"
    >
      <IconComp size={18} />
      <Text fontWeight="medium">{label}</Text>
    </HStack>
  );
}

function StatCard({
  label,
  value,
  help,
}: {
  label: string;
  value: string;
  help?: string;
}) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6}>
      <Text fontWeight="bold" fontSize="lg">
        {label}
      </Text>
      <Text fontSize="2xl">{value}</Text>
      {help && <Text color="gray.500">{help}</Text>}
    </Box>
  );
}

function FAQItem({ q, a, value }: { q: string; a: string; value: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} mb={2}>
      <Button
        variant="ghost"
        w="100%"
        textAlign="left"
        onClick={() => setOpen(!open)}
        value={value}
      >
        {q}
      </Button>
      {open && (
        <Box mt={2} color="gray.600">
          <Text>{a}</Text>
        </Box>
      )}
    </Box>
  );
}
