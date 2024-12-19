import { describe, expect, test } from "vitest";

import { isEmoji } from "@/utils/isEmoji";

describe("isEmoji", () => {
  test("doit retourner true si l'emoji est un emoji", () => {
    expect(isEmoji("👍")).toBe(true);
  });
  test("doit retourner false si la valeur n'est pas un emoji", () => {
    expect(isEmoji("test")).toBe(false);
  });
});
