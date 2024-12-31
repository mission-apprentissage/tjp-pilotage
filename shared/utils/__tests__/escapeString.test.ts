import { describe, expect, it } from "vitest";

import { escapeString } from "../escapeString";

describe("escapeString", () => {
  describe("Étant donné une chaîne contenant des caractères spéciaux HTML", () => {
    it("devrait encoder les caractères spéciaux HTML", () => {
      // Given
      const input = "<p>Test & exemple</p>";

      // When
      const result = escapeString(input);

      // Then
      expect(result).toBe("&#x3C;p&#x3E;Test &#x26; exemple&#x3C;/p&#x3E;");
    });

    it("devrait encoder les caractères accentués", () => {
      // Given
      const input = "été à la plage";

      // When
      const result = escapeString(input);

      // Then
      expect(result).toBe("&#xE9;t&#xE9; &#xE0; la plage");
    });
  });

  describe("Étant donné une chaîne sans caractères spéciaux", () => {
    it("devrait retourner la chaîne inchangée", () => {
      // Given
      const input = "Test simple";

      // When
      const result = escapeString(input);

      // Then
      expect(result).toBe("Test simple");
    });
  });

  describe("Étant donné une valeur undefined", () => {
    it("devrait retourner undefined", () => {
      // Given
      const input = undefined;

      // When
      const result = escapeString(input);

      // Then
      expect(result).toBeUndefined();
    });
  });
});
