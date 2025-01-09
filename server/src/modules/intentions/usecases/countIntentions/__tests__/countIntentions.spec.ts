import { clearIntentions, createIntentionBuilder } from "@tests/intentions.spec.utils";
import { usePg } from "@tests/pg.test.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/users.spec.utils";
import type { DemandeStatutType, DemandeStatutTypeSansSupprimee } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { IResError } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { createSuiviQuery } from "@/modules/intentions/usecases/submitSuivi/submitSuivi.query";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

type Response = z.infer<
  (typeof ROUTES)["[GET]/intentions/count"]["schema"]["response"]["200"]
>;

type Filters = z.infer<(typeof ROUTES)["[GET]/intentions/count"]["schema"]["querystring"]>;

describe("[GET]/intentions/count", () => {
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

  afterEach(async () => {
    await clearIntentions();
  });

  describe("errors", () => {
    it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
      fixture.given.utilisateurAnonyme();

      await fixture.when.getNombreIntentions();

      fixture.then.verifierReponseNonAutorise();
    });
  });

  describe("success", () => {
    it("doit compter les intentions pour l'année de campagne en cours", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.intentionsExistantes({ nombre: 3 });

      await fixture.when.getNombreIntentions();

      fixture.then.verifierReponseSucces();
      fixture.then.verifierNombreTotal(3);
    });

    it("doit compter les intentions par statut", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.intentionsExistantes({
        nombre: 2,
        statut: DemandeStatutEnum["brouillon"]
      });
      await fixture.given.intentionsExistantes({
        nombre: 3,
        statut: DemandeStatutEnum["projet de demande"]
      });
      await fixture.given.intentionsExistantes({
        nombre: 1,
        statut: DemandeStatutEnum["supprimée"]
      });

      await fixture.when.getNombreIntentions();

      fixture.then.verifierNombreParStatut(DemandeStatutEnum["brouillon"], 2);
      fixture.then.verifierNombreParStatut(DemandeStatutEnum["projet de demande"], 3);
    });

    it("doit compter les intentions suivies par l'utilisateur", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.intentionsExistantes({
        nombre: 2,
        suiviParUtilisateur: true
      });
      await fixture.given.intentionsExistantes({ nombre: 1 });

      await fixture.when.getNombreIntentions();

      fixture.then.verifierNombreIntentionsSuivies(2);
    });

    it("doit compter les intentions qui sont filtré par recherche textuelle", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.intentionsExistantes({
        nombre: 3,
        cfd: "32031309"
      });
      await fixture.given.intentionsExistantes({
        nombre: 2,
        cfd: "40022106"
      });
      fixture.given.filtres({ search: "cuisine" });

      await fixture.when.getNombreIntentions();

      fixture.then.verifierNombreTotal(2);
    });

    // TODO: fixer le test

    // it("doit compter les intentions qui sont filtré par cfd", async () => {
    //   await fixture.given.utilisateurAutorise();
    //   await fixture.given.intentionsExistantes({
    //     nombre: 3,
    //     cfd: "32031309"
    //   });
    //   await fixture.given.intentionsExistantes({
    //     nombre: 2,
    //     cfd: "40022106",
    //   });
    //   await fixture.given.intentionsExistantes({
    //     nombre: 1,
    //     cfd: "40022106",
    //     statut: DemandeStatutEnum["supprimée"]

    //   });

    //   fixture.given.filtres({ codeNiveauDiplome: ["40022106", "40022105"] });

    //   await fixture.when.getNombreIntentions();

    //   fixture.then.verifierNombreTotal(2);
    // });
  });

  const fixtureBuilder = (app: Server) => {
    let user: RequestUser | undefined = undefined;
    let filtres: Filters = {};
    let responseCode: number;
    let responseBody: Response | IResError;

    return {
      given: {
        utilisateurAnonyme: () => {
          user = undefined;
        },
        utilisateurNonAuthorise: async () => {
          user = await createUserBuilder().withRole("invite").create();
        },
        utilisateurAutorise: async () => {
          user = await createUserBuilder()
            .withRole("pilote_region")
            .create();
        },
        intentionsExistantes: async (data: {
          nombre: number;
          statut?: DemandeStatutType;
          anneeCampagne?: string;
          suiviParUtilisateur?: boolean;
          libelleFormation?: string;
          cfd?: string;
        }) => {
          if (!user) return;

          for (let i = 0; i < data.nombre; i++) {
            const intention = (await (await createIntentionBuilder(user, {
              statut: data.statut ?? DemandeStatutEnum.proposition,
              cfd: data.cfd ?? "32031309"
            }).withCurrentCampagneId())
              .injectInDB())
              .toJSON();

            if (data.suiviParUtilisateur) {
              await createSuiviQuery({
                intentionNumero: intention.numero,
                userId: user.id,
              });
            }
          }
        },
        filtres: (data: Filters) => {
          filtres = data;
        },
      },
      when: {
        getNombreIntentions: async () => {
          const response = await app.inject({
            method: "GET",
            url: "/api/intentions/count",
            query: filtres,
            cookies: user ? generateAuthCookie(user) : undefined,
          });
          responseCode = response.statusCode;
          responseBody = response.json();
        },
      },
      then: {
        verifierReponseNonAutorise: () => {
          expect(responseCode).toBe(401);
        },
        verifierReponseSucces: () => {
          expect(responseCode).toBe(200);
        },
        verifierResultat: (result: Response) => {
          expect(responseBody).toEqual(result);
        },
        verifierNombreParStatut: (statut: DemandeStatutTypeSansSupprimee, nombre: number) => {
          expect((responseBody as Response)[statut]).toBe(nombre);
        },
        verifierNombreTotal: (nombre: number) => {
          expect((responseBody as Response).total).toBe(nombre);
        },
        verifierNombreIntentionsSuivies: (nombre: number) => {
          expect((responseBody as Response).suivies).toBe(nombre);
        },
      },
    };
  };
});
