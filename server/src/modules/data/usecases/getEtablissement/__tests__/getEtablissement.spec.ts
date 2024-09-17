import { build } from "../../../../../build";
import { kdb } from "../../../../../db/db";
import { Server, server as fastifyServer } from "../../../../../server";

describe("GET /api/etablissement/:uai", () => {
  let server: Server;

  beforeAll(async () => {
    server = await build(fastifyServer);
    await server.ready();
  });

  afterAll(async () => {
    await server.close(() => kdb.destroy());
  });

  it("doit retrouver les données de l'établissement Jules Verne", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/etablissement/0021939X",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body).toEqual({
      value: "0021939X",
      label:
        "Lycée polyvalent Jules Verne - Lycée des métiers des sciences et technologies pour un développement durable - Château-Thierry",
      commune: "Château-Thierry",
    });
  });

  it("doit renvoyer une 404 pour un code établissement qui n'existe pas", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/etablissement/12345678",
    });

    expect(response.statusCode).toBe(404);
  });
});
