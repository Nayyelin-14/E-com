import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters"),
});

export const RegisterSchema = LoginSchema.extend({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
});

export const profileSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
});

export const PasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(7, "Password must be at least 7 characters long")
    .max(7, "Password must be less than 7 characters"),
  newPassword: z
    .string()
    .min(7, "Password must be at least 7 characters long")
    .max(7, "Password must be less than 7 characters"),
});
