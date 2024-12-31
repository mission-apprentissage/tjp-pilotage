import { describe, expect, it } from "vitest";

import { isValidUrl } from "../isValidUrl";

describe("isValidUrl", () => {
  describe("Étant donné des URLs valides", () => {
    const validUrls = [
      "https://orion.inserjeunes.beta.gouv.fr/",
      "https://orion.inserjeunes.beta.gouv.fr/glossaire",
      "https://example.com",
      "http://example.com",
      "https://sub.example.com",
      "https://example.com/path",
      "https://example.com/path?param=value",
      "https://example.com:8080",
      "https://example.com/path#section",
      "http://localhost",
      "http://localhost:3000",
      "https://example.com/path/to/resource.html",
      "https://example.com/path-with-dashes",
      "https://example.com/path_with_underscores",
      "ftp://ftp.example.com",
    ];

    validUrls.forEach((url) => {
      it(`devrait valider l'URL ${url}`, () => {
        // When
        const result = isValidUrl(url);

        // Then
        expect(result).toBe(true);
      });
    });
  });

  describe("Étant donné des URLs invalides", () => {
    const invalidUrls = [
      "not-a-url",
      "http://",
      "https://",
      "://example.com",
      "http:/example.com",
      "http//example.com",
      "example.com",
      "http:example.com",
      "http://.com",
      "",
      " ",
      "https://example.com with spaces",
      "javascript:alert(1)",
      "file:///etc/passwd",
    ];

    invalidUrls.forEach((url) => {
      it(`ne devrait pas valider l'URL ${url}`, () => {
        // When
        const result = isValidUrl(url);

        // Then
        expect(result).toBe(false);
      });
    });
  });

  describe("Étant donné des cas limites", () => {
    it("devrait gérer une URL avec des caractères spéciaux encodés", () => {
      // Given
      const url = "https://example.com/path%20with%20spaces";

      // When
      const result = isValidUrl(url);

      // Then
      expect(result).toBe(true);
    });

    it("devrait gérer une URL avec des paramètres multiples", () => {
      // Given
      const url = "https://example.com/path?param1=value1&param2=value2";

      // When
      const result = isValidUrl(url);

      // Then
      expect(result).toBe(true);
    });

    it("devrait rejeter undefined", () => {
      // When
      const result = isValidUrl(undefined as unknown as string);

      // Then
      expect(result).toBe(false);
    });

    it("devrait rejeter null", () => {
      // When
      const result = isValidUrl(null as unknown as string);

      // Then
      expect(result).toBe(false);
    });
  });
});
