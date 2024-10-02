import { build } from "../../../../../build";
import { kdb } from "../../../../../db/db";
import { Server, server as fastifyServer } from "../../../../../server";

describe("GET /api/corrections", () => {
  let server: Server;

  beforeAll(async () => {
    server = await build(fastifyServer);
    await server.ready();
  });

  afterAll(async () => {
    await server.close(() => kdb.destroy());
  });

  it("doit renvoyer une 401 si je ne suis pas connecté avec un utilisateur", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/corrections",
    });

    expect(response.statusCode).toBe(401);
  });
});
