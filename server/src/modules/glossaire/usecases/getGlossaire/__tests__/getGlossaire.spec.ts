import { usePg } from "@tests/utils/pg.test.utils";
import type { ROUTES } from "shared/routes/routes";
import { beforeAll, describe, expect, it } from "vitest";
import type { z } from "zod";

import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

type Response = z.infer<
  (typeof ROUTES)["[GET]/glossaire"]["schema"]["response"]["200"]
>;

describe("[GET]/glossaire", () => {
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  it("Retourne la liste des entrées du glossaire", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/glossaire",
    });
    expect(response.statusCode).toBe(200);

    const entries = response.json() as Response;

    expect(entries).toBeDefined();
    expect(entries.length).toBeGreaterThan(0);

    expect(entries[0].slug).toBe("action-prioritaire");
    expect(entries[0].title).toBe("Action Prioritaire");
    expect(entries[0].type).toBe("Formation");
    expect(entries[0].createdBy).toBe("Oriana");
    expect(entries[0].status).toBe("validé");
    expect(entries[0].icon).toBe("ri:hand-heart-line");
  });
});
