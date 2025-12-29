import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";
import {
  FieldErrorText,
  Input,
  Button,
  VStack,
  Box,
  Heading,
  Field,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { IErrorResponse } from "../interfaces";
import { Link, useNavigate } from "react-router-dom";
import CookieService from "@/services/CookieService";
import { useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";

interface IFormInput {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );

      if (status === 200) {
        const dateNow = Date.now();
        const IN_DAYS = 3;
        const EXPIRES_AT_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS;
        const expiresDate = new Date(dateNow + EXPIRES_AT_DAYS);
        const option = { path: "/", expires: expiresDate };
        CookieService.set(
          "userInfo",
          {
            jwt: resData.jwt,
            email: resData.user.email,
            userName: resData.user.username,
            createdAt: resData.user.createdAt,
          },
          option
        );
        localStorage.setItem("jwt_expires_at", String(expiresDate.getTime()));
        toast.success("Login successfully!", { duration: 1500 });
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } catch (err) {
      const errorObj = err as AxiosError<IErrorResponse>;
      toast.error(errorObj.response?.data?.error?.message || "Failed login");
    } finally {
      setIsLoading(false);
    }
  };
  // login with google
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:1337/api/connect/google";
  };

  return (
    <>
      <Box
        w={"95%"}
        maxW={"md"}
        mx="auto"
        my={"200px"}
        p={"40px"}
        style={{ borderTopRightRadius: "80px", borderBottomLeftRadius: "80px" }}
        bg={colorMode === "dark" ? "gray.900" : "gray.100"}
        color={colorMode === "dark" ? "white" : "black"}
      >
        <Heading textAlign="center" mb={3}>
          Sign in to Accsses!
        </Heading>
        <VStack as={"form"} onSubmit={handleSubmit(onSubmit)}>
          {/* Identifier */}
          <Field.Root invalid={!!errors.identifier}>
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="Enter email"
              type="email"
              autoComplete="current-email"
              {...register("identifier")}
            />
            <FieldErrorText>{errors.identifier?.message}</FieldErrorText>
          </Field.Root>

          {/* Password */}
          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register("password")}
            />
            <FieldErrorText>{errors.password?.message}</FieldErrorText>
          </Field.Root>

          <Button
            type="submit"
            loadingText="Login in..."
            loading={isLoading}
            width="100%"
            mt={3}
            style={{
              backgroundColor: "orange",
              color: "white",
            }}
          >
            Sign in
          </Button>
        </VStack>
        <Box position="relative" w="100%" h="1px" bg="gray.300" my={6}>
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            px={2}
            fontWeight="bold"
            color="white"
            bg={"gray.900"}
          >
            OR
          </Text>
        </Box>

        <Button
          width="100%"
          style={{
            backgroundColor: "#DB4437",
            color: "white",
          }}
          _hover={{ bg: "#c23321" }}
          onClick={loginWithGoogle}
          loading={isLoading}
          loadingText="Signing in..."
          pointerEvents={"none"}
        >
          <Flex align="center" gap={"2"} justify="center" w="100%">
            <Image
              width={"28px"}
              height={"28px"}
              src="../../src/assets/Google logo icon wit.png"
              alt="iconGoogle"
            />
            <Text fontWeight="bold">Sign in with Google</Text>
          </Flex>
        </Button>

        <Text textAlign="center" mt={2}>
          No account?{" "}
          <Link
            to="/register"
            style={{
              color: "orange",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Sign up
          </Link>
        </Text>
      </Box>
    </>
  );
}
