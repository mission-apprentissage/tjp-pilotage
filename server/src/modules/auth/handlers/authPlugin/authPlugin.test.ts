import cookie from "cookie";
import { FastifyRequest } from "fastify";
import { sign } from "jsonwebtoken";

import { extractUserInRequestFactory } from "./authPlugin";

const jwtSecret = "jwtSecret";
const jwtToken = sign({ email: "test@test.fr" }, jwtSecret);

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
      }),
    });

    const request = {
      headers: { cookie: cookie.serialize("Authorization", jwtToken) },
    } as FastifyRequest;

    await extractUserInRequest(request);
    await expect(request.user).toMatchObject({ email: "test@test.fr" });
  });
});
