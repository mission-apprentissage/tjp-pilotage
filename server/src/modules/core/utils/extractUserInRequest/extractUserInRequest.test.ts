import cookie from "cookie";
import type { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { extractUserInRequestFactory } from "./extractUserInRequest";

const jwtSecret = "jwtSecret";
const jwtToken = jwt.sign({ email: "test@test.fr" }, jwtSecret);

describe("extractUserInRequest usecase", () => {
  it("should not set user in request if the is no token in the header", async () => {
    const extractUserInRequest = extractUserInRequestFactory({
      jwtSecret,
      findUserQuery: async () => undefined,
    });

    const request = { headers: {} } as FastifyRequest;

    await extractUserInRequest(request);
    await expect(request.user).toBeUndefined();
  });

  it("should not set user in request if wrong token in the header", async () => {
    const extractUserInRequest = extractUserInRequestFactory({
      jwtSecret,
      findUserQuery: async () => undefined,
    });

    const request = {
      headers: { cookie: cookie.serialize("Authorization", "wrongToken") },
    } as FastifyRequest;

    await extractUserInRequest(request);
    await expect(request.user).toBeUndefined();
  });

  it("should not set user in request if the user is not enabled", async () => {
    const extractUserInRequest = extractUserInRequestFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        id: "",
        createdAt: new Date(),
        password: "",
        role: "",
        firstname: "firstname",
        lastname: "lastname",
        codeRegion: undefined,
        uais: undefined,
        enabled: false,
        sub: undefined,
        lastSeenAt: undefined,
      }),
    });

    const request = {
      headers: { cookie: cookie.serialize("Authorization", jwtToken) },
    } as FastifyRequest;

    await extractUserInRequest(request);
    await expect(request.user).toBeUndefined();
  });

  it("should set user in request if there is a correct token in the header", async () => {
    const extractUserInRequest = extractUserInRequestFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        id: "",
        createdAt: new Date(),
        password: "",
        role: "",
        firstname: "firstname",
        lastname: "lastname",
        codeRegion: undefined,
        uais: undefined,
        enabled: true,
        sub: undefined,
        lastSeenAt: undefined,
      }),
    });

    const request = {
      headers: { cookie: cookie.serialize("Authorization", jwtToken) },
    } as FastifyRequest;

    await extractUserInRequest(request);
    await expect(request.user).toMatchObject({ email: "test@test.fr" });
  });
});
