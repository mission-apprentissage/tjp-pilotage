import { usePg } from "@tests/pg.test.utils";
import { beforeAll, describe, expect, it } from "vitest";

import type { Server } from "@/server/server.js";
import createServer from "@/server/server.js";

usePg();

describe("GET /api/etablissement/:uai", () => {
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  it("doit retrouver les données de l'établissement Jules Verne", async () => {
    const response = await app.inject({
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
    const response = await app.inject({
      method: "GET",
      url: "/api/etablissement/12345678",
    });

    expect(response.statusCode).toBe(404);
  });
});
