import { build } from "../../../../../build";
import { kdb } from "../../../../../db/db";
import { Server, server as fastifyServer } from "../../../../../server";

describe("POST /api/auth/login", () => {
  let server: Server;

  beforeAll(async () => {
    server = await build(fastifyServer);
    await server.ready();
  });

  afterAll(async () => {
    await server.close(() => kdb.destroy());
  });

  it("doit retourner une erreur 401 car l'utilisateur n'existe pas en base de donnée", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "jean.charles@edu.gouv.fr",
        password: "1234Orion!",
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
