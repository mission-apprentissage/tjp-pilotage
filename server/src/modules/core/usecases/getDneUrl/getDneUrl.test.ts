import { getDneUrlFactory } from "./getDneUrl.usecase";

describe("getDneUrl usecase", () => {
  it("should return an url and a token", async () => {
    const getDneUrl = getDneUrlFactory({
      getDneClient: jest.fn().mockResolvedValue({
        authorizationUrl: jest.fn(() => "http://authoriztion-url.com"),
      }),
      signJwt: jest.fn().mockReturnValue("token"),
    });

    const result = await getDneUrl();
    expect(result).toMatchObject({
      url: "http://authoriztion-url.com",
      codeVerifierJwt: "token",
    });
  });
});
