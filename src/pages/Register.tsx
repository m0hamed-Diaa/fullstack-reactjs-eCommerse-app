import { useForm, type SubmitHandler } from "react-hook-form";
import { registerSchema } from "../validation/index";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import type { IErrorResponse } from "../interfaces";
import {
  Box,
  Button,
  Field,
  FieldErrorText,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; // قيمة التحقق من الباسورد
}

const RegisterPage = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const { username, email, password } = data;
      const { status } = await axiosInstance.post("/auth/local/register", {
        username,
        email,
        password,
      });

      if (status === 200) {
        toast.success("Register successfully!", { duration: 1500 });
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(
        `${errorObj.response?.data.error.message || "Failed register"}`,
        {
          duration: 1500,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      w={"95%"}
      bg={colorMode === "dark" ? "gray.900" : "gray.100"}
      color={colorMode === "dark" ? "white" : "black"}
      my={"200px"}
      p={"40px"}
      style={{ borderTopRightRadius: "80px", borderBottomLeftRadius: "80px" }}
    >
      <Heading textAlign="center" mb={3}>
        Sign up to Accsses!
      </Heading>

      <Box as={"form"} onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}
        <Field.Root invalid={!!errors.username}>
          <Field.Label>Username</Field.Label>
          <Input
            placeholder="Enter Username"
            type="text"
            autoComplete="current-username"
            {...register("username")}
          />
          <FieldErrorText>{errors.username?.message}</FieldErrorText>
        </Field.Root>
        {/* Email */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="Enter email"
            type="email"
            autoComplete="current-email"
            {...register("email")}
          />
          <FieldErrorText>{errors.email?.message}</FieldErrorText>
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

        {/* Confirmed Password */}
        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label>Confirmed Password</Field.Label>
          <Input
            type="password"
            placeholder="Confirmed Password"
            autoComplete="current-password"
            {...register("confirmPassword")}
          />
          <FieldErrorText>{errors.confirmPassword?.message}</FieldErrorText>
        </Field.Root>

        <Button
          type="submit"
          mt={3}
          width={"100%"}
          loading={isLoading}
          loadingText="register in..."
          style={{
            backgroundColor: "orange",
            color: "white",
          }}
        >
          Sign up
        </Button>
      </Box>

      <Text mt={"8px"} textAlign={"center"}>
        have a account?{" "}
        <Link
          to={"/login"}
          style={{
            color: "orange",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          Sign in
        </Link>{" "}
      </Text>
    </Box>
  );
};

export default RegisterPage;
