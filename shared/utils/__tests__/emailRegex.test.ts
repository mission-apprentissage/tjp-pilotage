import { describe, expect, it } from "vitest";

import { emailRegex } from "../emailRegex";

describe("emailRegex", () => {
  describe("Étant donné des adresses email valides", () => {
    const validEmails = [
      "test@example.com",
      "test.test@example.com",
      "test+test@example.com",
      "test@sub.example.com",
      "test@example.co.uk",
      "test123@example.com",
      "TEST@EXAMPLE.COM",
      "test-test@example.com",
      "test_test@example.com",
      "tpe@example.com",
      "t@example.com",
    ];

    validEmails.forEach((email) => {
      it(`devrait valider l'email ${email}`, () => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });
  });

  describe("Étant donné des adresses email invalides", () => {
    const invalidEmails = [
      "test@example",
      "@example.com",
      "test@.com",
      "test@example.",
      "test@ex ample.com",
      "test@example..com",
      ".test@example.com",
      "test.@example.com",
      "te..st@example.com",
      "test@-example.com",
      "test@example-.com",
      ".@example.com",
    ];

    invalidEmails.forEach((email) => {
      it(`ne devrait pas valider l'email ${email}`, () => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });
});
