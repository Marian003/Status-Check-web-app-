import { z } from "zod";

// Shared auth schemas — reused by client forms and server actions/authorize.

// Trim + lowercase before validating the email format.
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Некоректний email"));

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Вкажіть ім'я").max(100, "Занадто довге ім'я"),
  email: emailField,
  password: z
    .string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .max(100, "Занадто довгий пароль"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Введіть пароль"),
});

export type LoginInput = z.infer<typeof loginSchema>;
