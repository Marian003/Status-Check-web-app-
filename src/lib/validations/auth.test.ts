import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    expect(
      registerSchema.safeParse({
        name: "Олена",
        email: "olena@example.com",
        password: "password123",
      }).success,
    ).toBe(true);
  });

  it("trims and lowercases the email", () => {
    const result = registerSchema.safeParse({
      name: "Олена",
      email: "  Olena@Example.COM ",
      password: "password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("olena@example.com");
    }
  });

  it("rejects an invalid email", () => {
    expect(
      registerSchema.safeParse({
        name: "X",
        email: "not-an-email",
        password: "password123",
      }).success,
    ).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(
      registerSchema.safeParse({
        name: "X",
        email: "x@y.com",
        password: "short",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty name", () => {
    expect(
      registerSchema.safeParse({
        name: "",
        email: "x@y.com",
        password: "password123",
      }).success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("normalizes the email and accepts any non-empty password", () => {
    const result = loginSchema.safeParse({ email: " A@B.com ", password: "x" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("a@b.com");
    }
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(
      false,
    );
  });
});
