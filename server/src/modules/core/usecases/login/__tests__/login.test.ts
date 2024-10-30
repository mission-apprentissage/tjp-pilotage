import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { Server } from "@/server/server.js";
import createServer from "@/server/server.js";

describe("POST /api/auth/login", () => {
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  beforeEach(async () => {
    //
  });

  it.skip("doit retourner une erreur 401 car l'utilisateur n'existe pas en base de donnée", async () => {
    // @ts-expect-error
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
