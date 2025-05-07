import { usePg } from "@tests/utils/pg.test.utils";
import { clearDemandes, createDemandeBuilder } from "@tests/utils/schema/demande.spec.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import type { DemandeStatutType, DemandeStatutTypeWithoutSupprimee } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import {RoleEnum} from 'shared/enum/roleEnum';
import type { IResError } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { createSuiviQuery } from "@/modules/demandes/usecases/submitSuivi/submitSuivi.query";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

type Response = z.infer<
  (typeof ROUTES)["[GET]/demandes/count"]["schema"]["response"]["200"]
>;

type Filters = z.infer<(typeof ROUTES)["[GET]/demandes/count"]["schema"]["querystring"]>;

describe("[GET]/demandes/count", () => {
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
    await clearDemandes();
  });

  describe("errors", () => {
    it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
      fixture.given.utilisateurAnonyme();

      await fixture.when.getNombreDemandes();

      fixture.then.verifierReponseNonAutorise();
    });
  });

  describe("success", () => {
    it("doit compter les demandes pour l'année de campagne en cours", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.demandesExistantes({ nombre: 3 });

      await fixture.when.getNombreDemandes();

      fixture.then.verifierReponseSucces();
      fixture.then.verifierNombreTotal(3);
    });

    it("doit compter les demandes par statut", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.demandesExistantes({
        nombre: 2,
        statut: DemandeStatutEnum["brouillon"]
      });
      await fixture.given.demandesExistantes({
        nombre: 3,
        statut: DemandeStatutEnum["projet de demande"]
      });
      await fixture.given.demandesExistantes({
        nombre: 1,
        statut: DemandeStatutEnum["supprimée"]
      });

      await fixture.when.getNombreDemandes();

      fixture.then.verifierNombreParStatut(DemandeStatutEnum["brouillon"], 2);
      fixture.then.verifierNombreParStatut(DemandeStatutEnum["projet de demande"], 3);
    });

    it("doit compter les demandes suivies par l'utilisateur", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.demandesExistantes({
        nombre: 2,
        suiviParUtilisateur: true
      });
      await fixture.given.demandesExistantes({ nombre: 1 });

      await fixture.when.getNombreDemandes();

      fixture.then.verifierNombreDemandesSuivies(2);
    });

    it("doit compter les demandes qui sont filtrées par recherche textuelle", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.demandesExistantes({
        nombre: 3,
        cfd: "32031309"
      });
      await fixture.given.demandesExistantes({
        nombre: 2,
        cfd: "40022106"
      });
      fixture.given.filtres({ search: "cuisine" });

      await fixture.when.getNombreDemandes();

      fixture.then.verifierNombreTotal(2);
    });

    it("doit compter les demandes qui sont filtrées par codeNiveauDiplome", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.demandesExistantes({
        nombre: 3,
        cfd: "32031309"
      });
      await fixture.given.demandesExistantes({
        nombre: 2,
        cfd: "40022106",
      });
      await fixture.given.demandesExistantes({
        nombre: 1,
        cfd: "50025136",
      });
      await fixture.given.demandesExistantes({
        nombre: 1,
        cfd: "40022106",
        statut: DemandeStatutEnum["supprimée"]

      });

      fixture.given.filtres({ codeNiveauDiplome: ["400", "500"] });

      await fixture.when.getNombreDemandes();

      fixture.then.verifierNombreTotal(3);
    });
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
          user = await createUserBuilder().withRole(RoleEnum["invite"]).create();
        },
        utilisateurAutorise: async () => {
          user = await createUserBuilder()
            .withRole(RoleEnum["pilote_region"])
            .create();
        },
        demandesExistantes: async (data: {
          nombre: number;
          statut?: DemandeStatutType;
          anneeCampagne?: string;
          suiviParUtilisateur?: boolean;
          libelleFormation?: string;
          cfd?: string;
        }) => {
          if (!user) return;

          for (let i = 0; i < data.nombre; i++) {
            const demande = (await (await createDemandeBuilder(user, {
              statut: data.statut ?? DemandeStatutEnum.proposition,
              cfd: data.cfd ?? "32031309"
            }).withCurrentCampagneId())
              .injectInDB())
              .build();

            if (data.suiviParUtilisateur) {
              await createSuiviQuery({
                demandeNumero: demande.numero,
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
        getNombreDemandes: async () => {
          const response = await app.inject({
            method: "GET",
            url: "/api/demandes/count",
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
        verifierNombreParStatut: (statut: DemandeStatutTypeWithoutSupprimee, nombre: number) => {
          expect((responseBody as Response)[statut]).toBe(nombre);
        },
        verifierNombreTotal: (nombre: number) => {
          expect((responseBody as Response).total).toBe(nombre);
        },
        verifierNombreDemandesSuivies: (nombre: number) => {
          expect((responseBody as Response).suivies).toBe(nombre);
        },
      },
    };
  };
});
