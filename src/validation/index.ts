import * as yup from "yup";
export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required")
      .min(5, "Username should be at least 5 charachters"),
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Invalid email address."),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password should be at least 6 charachters."),
    confirmPassword: yup
      .string()
      .required("Confirmed Password is required")
      .oneOf([yup.ref("password")], "Password must match")
  })
  .required();
export const loginSchema = yup
  .object({
    identifier: yup
      .string()
      .required("Email is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Invalid email address."),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password should be at least 6 charachters."),
  })
  .required();

export const adminLoginSchema = yup.object({
  identifier: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});