import { describe, expect, it } from "vitest";

import { formatBoolean } from "@/utils/formatUtils";

describe("formatBoolean", () => {
  it("doit retourner 'Oui' si la valeur est true", () => {
    expect(formatBoolean(true)).toBe("Oui");
  });
  it("doit retourner 'Non' si la valeur est false", () => {
    expect(formatBoolean(false)).toBe("Non");
  });
  it("doit retourner 'Non' si la valeur est undefined", () => {
    expect(formatBoolean(undefined)).toBe("Non");
  });
});
