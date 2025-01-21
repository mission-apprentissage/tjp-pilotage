import { usePg } from "@tests/utils/pg.test.utils";
import type { IResError } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { z } from "zod";

import type { Server } from "@/server/server.js";
import createServer from "@/server/server.js";

type Response = z.infer<
  (typeof ROUTES)["[GET]/region/:codeRegion"]["schema"]["response"]["200"]
>;

usePg();

describe("[GET]/region/:codeRegion", () => {
  let app: Server;
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  beforeEach(() => {
    fixture = fixtureBuilder(app);
  });

  it("doit retrouver les données de la région Auvergne-Rhône-Alpes (84) pour un BTS (320)", async () => {
    fixture.given.region("84");
    fixture.given.codeNiveauDiplome("320");

    await fixture.when.getRegion();

    fixture.then.verifierLabelRegion("Auvergne-Rhône-Alpes");
    fixture.then.verifierEffectifEntree(15962);
    fixture.then.verifierEffectifTotal(30068);
    fixture.then.verifierNbFormations(123);
    fixture.then.verifierTauxRemplissage(0.8822);
    fixture.then.verifierTauxPoursuite(0.4975);
    fixture.then.verifierTauxInsertion(0.6417);
    fixture.then.verifierTauxDevenirFavorable(0.82);
  });

  it("doit vérifier que des valeurs n'existes par pour des diplomes dans des régions", async () => {
    fixture.given.region("27");
    fixture.given.codeNiveauDiplome("561");

    await fixture.when.getRegion();

    fixture.then.verifierLabelRegion("Bourgogne-Franche-Comté");
    fixture.then.verifierNbFormations(4);
    fixture.then.verifierEffectifTotal(46);
    fixture.then.verifierEffectifEntree(46);
    fixture.then.verifierTauxRemplissage(undefined);
    fixture.then.verifierTauxPoursuite(undefined);
    fixture.then.verifierTauxInsertion(undefined);
    fixture.then.verifierTauxDevenirFavorable(undefined);
  });
});



const fixtureBuilder = (app: Server) => {
  let codeRegion: string;
  let codeNiveauDiplome: string;
  let responseCode: number;
  let responseBody: Response | IResError;

  const rounded = (value?: number, precision: number = 4) => {
    if (!value) return undefined;
    return Math.round(value * 10 ** precision) / 10 ** precision;
  };

  return {
    given: {
      region: (code: string) => {
        codeRegion = code;
      },
      codeNiveauDiplome: (code: string) => {
        codeNiveauDiplome = code;
      },
    },
    when: {
      getRegion: async () => {
        const response = await app.inject({
          method: "GET",
          url: `/api/region/${codeRegion}?codeNiveauDiplome[]=${codeNiveauDiplome}`,
        });
        responseCode = response.statusCode;
        responseBody = response.json();
      },
    },
    then: {
      verifierReponseSucces: () => {
        expect(responseCode).toBe(200);
      },
      verifierReponseErreur: () => {
        expect(responseCode).toBe(400);
      },
      verifierLabelRegion: (label: string) => {
        expect((responseBody as Response).libelleRegion).toBe(label);
      },
      verifierEffectifEntree: (effectif: number) => {
        expect((responseBody as Response).effectifEntree).toBe(effectif);
      },
      verifierEffectifTotal: (effectif: number) => {
        expect((responseBody as Response).effectifTotal).toBe(effectif);
      },
      verifierNbFormations: (nb: number) => {
        expect((responseBody as Response).nbFormations).toBe(nb);
      },
      verifierTauxRemplissage: (taux?: number) => {
        expect(rounded((responseBody as Response).tauxRemplissage)).toBe(taux);
      },
      verifierTauxPoursuite: (taux?: number) => {
        expect(rounded((responseBody as Response).tauxPoursuite)).toBe(taux);
      },
      verifierTauxInsertion: (taux?: number) => {
        expect(rounded((responseBody as Response).tauxInsertion)).toBe(taux);
      },
      verifierTauxDevenirFavorable: (taux?: number) => {
        expect(rounded((responseBody as Response).tauxDevenirFavorable)).toBe(taux);
      },
    },
  };
};

