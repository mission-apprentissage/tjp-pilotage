import { usePg } from "@tests/utils/pg.test.utils";
import { beforeAll, describe, expect, it } from "vitest";

import type { Server } from "@/server/server.js";
import createServer from "@/server/server.js";

usePg();

describe("[GET]/region/:codeRegion", () => {
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  it("doit retrouver les données de la région Auvergne-Rhône-Alpes (84) pour un BTS (320)", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/region/84?codeNiveauDiplome[]=320",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      libelleRegion: "Auvergne-Rhône-Alpes",
      effectifEntree: 10165,
      effectifTotal: 18403,
      nbFormations: 96,
      tauxRemplissage: 0.79200970621371,
      tauxPoursuite: 0.476512025342837,
      tauxInsertion: 0.640178358149534,
      tauxDevenirFavorable: 0.811637697469885,
    });
  });
});
