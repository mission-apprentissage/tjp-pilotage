import { usePg } from "@tests/utils/pg.test.utils";
import { beforeAll, describe, expect, it } from "vitest";

import type { Server } from "@/server/server.js";
import createServer from "@/server/server.js";

usePg();

describe("GET /api/corrections", () => {
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  it("doit renvoyer une 401 si je ne suis pas connecté avec un utilisateur", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/corrections",
    });

    expect(response.statusCode).toBe(401);
  });
});
