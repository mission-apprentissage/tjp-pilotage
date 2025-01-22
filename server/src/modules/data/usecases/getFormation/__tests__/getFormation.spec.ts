import { usePg } from "@tests/utils/pg.test.utils";
import type { getFormationCfdSchema } from "shared/routes/schemas/get.formation.cfd.schema";
import { beforeAll, describe, expect, it } from "vitest";
import type { z } from "zod";

import type { Server } from "@/server/server.js";
import createServer from "@/server/server.js";

usePg();

type Response = z.infer<(typeof getFormationCfdSchema.response)[200]>;

describe("GET /api/formation/:cfd", () => {
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  it("doit retourner une erreur 404 si le cfd n'existe pas", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/formation/1234567890",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "La formation avec le cfd 1234567890 est inconnue",
      name: "Not Found",
      statusCode: 404,
    });
  });

  it("doit retourner les informations d'une formation", async () => {
    const cfdBTS = "32024111";
    const response = await app.inject({
      method: "GET",
      url: `/api/formation/${cfdBTS}`,
    });

    expect(response.statusCode).toBe(200);
    const result = await response.json<Response>();
    expect(result.cfd).toBe(cfdBTS);
    expect(result.libelle).toBe("BTS - Innovation textile option a structures");
    expect(result.isBTS).toBe(true);
  });

  it("doit retourner l'information que le BTS - Innovation textile option a structures est un BTS", async () => {
    const cfdBTS = "32024111";
    const response = await app.inject({
      method: "GET",
      url: `/api/formation/${cfdBTS}`,
    });

    expect(response.statusCode).toBe(200);
    const result = await response.json<Response>();
    expect(result.cfd).toBe(cfdBTS);
    expect(result.libelle).toBe("BTS - Innovation textile option a structures");
    expect(result.isBTS).toBe(true);
  });

  it("doit retourner qu'un CFD n'est pas enseigné dans une région", async () => {
    const cfdNotInScope = "32322112";
    const response = await app.inject({
      method: "GET",
      url: `/api/formation/${cfdNotInScope}`,
    });

    expect(response.statusCode).toBe(200);
    const result = await response.json<Response>();
    expect(result.cfd).toBe(cfdNotInScope);
    expect(result.libelle).toBe("BTSA - Sciences et technologies des aliments spe produits laitiers");
    expect(result.isInScope).toBe(false);
  });
});
