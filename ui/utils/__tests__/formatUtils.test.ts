import { describe, expect, it } from "vitest";

import { formatBoolean, formatPercentageFixedDigits } from "@/utils/formatUtils";

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

describe("formatPercentageFixedDigits", () => {
  it("doit retourner 0 % si la valeur est undefined", () => {
    expect(formatPercentageFixedDigits(undefined)).toEqual("0 %");
  });

  it("doit retourner 2.20% si la valeur est 2.2", () => {
    expect(formatPercentageFixedDigits(0.022, 2)).toEqual("2,20\u00A0%");
  });

  it("doit retourner 2.22% si la valeur est 2.22123", () => {
    expect(formatPercentageFixedDigits(0.022123, 2)).toEqual("2,21\u00A0%");
  });

  it("doit retourner 2.22% si la valeur est 2.218", () => {
    expect(formatPercentageFixedDigits(0.02218, 2)).toEqual("2,22\u00A0%");
  });
});
