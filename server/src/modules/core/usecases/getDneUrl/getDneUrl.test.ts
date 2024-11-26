import { describe, expect, it, vi } from "vitest";

import { getDneUrlFactory } from "./getDneUrl.usecase";

describe("getDneUrl usecase", () => {
  it("should return an url and a token", async () => {
    const getDneUrl = getDneUrlFactory({
      getDneClient: vi.fn().mockResolvedValue({
        authorizationUrl: vi.fn(() => "http://authoriztion-url.com"),
      }),
      signJwt: vi.fn().mockReturnValue("token"),
    });

    const result = await getDneUrl();
    expect(result).toMatchObject({
      url: "http://authoriztion-url.com",
      codeVerifierJwt: "token",
    });
  });
});
