import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FieldErrorText,
  Input,
  Button,
  VStack,
  Box,
  Heading,
  Field,
  Text,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminLoginSchema } from "@/validation";
import type { IErrorResponse } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { useColorMode } from "@/components/ui/color-mode";
import axiosInstance from "@/config/axios.config";

interface IAdminFormInput {
  identifier: string;
  password: string;
}

export default function AdminLoginPage() {
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IAdminFormInput>({
    resolver: yupResolver(adminLoginSchema),
  });

  const onSubmit: SubmitHandler<IAdminFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const { status, data: resData } = await axiosInstance.post(
        "auth/local",
        data
      );

      if (status === 200) {
        const dateNow = Date.now();
        const IN_DAYS = 30;
        const EXPIRES_AT_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS;
        const expiresDate = new Date(dateNow + EXPIRES_AT_DAYS);

        const option = { path: "/", expires: expiresDate };
        CookieService.set(
          "AdminInfo",
          {
            jwt: resData.jwt,
            email: resData.user.email,
            userName: resData.user.username,
            createdAt: resData.user.createdAt,
          },
          option
        );
        localStorage.setItem(
          "admin_jwt_expires_at",
          String(expiresDate.getTime())
        );

        toast.success("Admin login successfully!", { duration: 1500 });

        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 1500);
      }
    } catch (err) {
      const errorObj = err as AxiosError<IErrorResponse>;
      toast.error(
        errorObj.response?.data?.error?.message ||
          "Failed to login. Check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
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
          Admin Login
        </Heading>
        <Text textAlign="center" color="gray.400" mb={6}>
          Access the admin dashboard
        </Text>

        <VStack as={"form"} onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <Field.Root invalid={!!errors.identifier}>
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="Enter admin email"
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
              placeholder="Admin password"
              autoComplete="current-password"
              {...register("password")}
            />
            <FieldErrorText>{errors.password?.message}</FieldErrorText>
          </Field.Root>

          <Button
            type="submit"
            loadingText="Logging in..."
            loading={isLoading}
            width="100%"
            mt={3}
            style={{
              backgroundColor: "orange",
              color: "white",
            }}
          >
            Sign in as Admin
          </Button>
        </VStack>

        <Text textAlign="center" mt={4} fontSize="sm" color="gray.500">
          Admin credentials are stored securely
        </Text>
      </Box>
    </>
  );
}
