import { usePg } from "@tests/utils/pg.test.utils";
import type { Demande } from "@tests/utils/schema/demande.spec.utils";
import { clearDemandes, createDemandeBuilder } from "@tests/utils/schema/demande.spec.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import {RoleEnum} from 'shared';
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { IResError } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

type Response = z.infer<
  (typeof ROUTES)["[POST]/demandes/statut/submit"]["schema"]["response"]["200"]
>;

usePg();

describe("[POST]/demandes/statut/submit", () => {
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
    vi.clearAllMocks();
  });

  describe("errors", () => {
    it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
      fixture.given.utilisateurAnonyme();
      fixture.given.statutProjetDeDemande();
      fixture.given.demandesAChangerExistantes();
      await fixture.given.demandesExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseNonAutorise();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'a pas les permissions nécessaires", async () => {
      await fixture.given.utilisateurNonAuthorise();
      fixture.given.statutProjetDeDemande();
      fixture.given.demandesAChangerExistantes();
      await fixture.given.demandesExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseInterdite();
    });

    it("doit retourner une erreur 404 si les demandes n'existent pas", async () => {
      await fixture.given.utilisateurAutorise({codeRegion: "76"});
      fixture.given.statutProjetDeDemande();
      fixture.given.demandesAChangerInexistantes();
      await fixture.given.demandesExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseNonTrouvee();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'est pas de la même région que les demandes", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "11" });
      fixture.given.statutProjetDeDemande();
      fixture.given.demandesAChangerExistantes();
      await fixture.given.demandesExistantes({ codeRegion: "76" });

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseInterdite();
    });
  });

  describe("success", () => {
    it("doit créer des changements de statut pour des demandes de sa région", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "76" });
      fixture.given.statutProjetDeDemande();
      fixture.given.demandesAChangerExistantes();
      await fixture.given.demandesExistantes({ codeRegion: "76" });

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementsStatutCrees();
      await fixture.then.verifierDemandesMiseAJour();
    });

    it("doit créer des changements de statut pour n'importe quelles demandes en tant qu'utilisateur national", async () => {
      await fixture.given.utilisateurNational();
      fixture.given.statutProjetDeDemande();
      fixture.given.demandesAChangerExistantes();
      await fixture.given.demandesExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementsStatutCrees();
      await fixture.then.verifierDemandesMiseAJour();
    });
  });

  const fixtureBuilder = (app: Server) => {
    const numeroDemandeExistants: string[] = [
      "test1",
      "test2",
      "test3",
      "test4",
    ];

    let demandeOwner: RequestUser | undefined = undefined;
    let user: RequestUser | undefined = undefined;
    let demandesAChanger: Array<{
      numero: string;
      isDemande?: boolean;
    }> | undefined = undefined;
    let demandes: Array<Demande | undefined> | undefined = undefined;
    let statut: DemandeStatutType | undefined = undefined;
    let responseBody: Response | IResError;
    let responseCode: number;

    return {
      given: {
        utilisateurAnonyme: () => {
          user = undefined;
        },
        utilisateurNonAuthorise: async () => {
          user = await createUserBuilder().withRole(RoleEnum["invite"]).create();
        },
        utilisateurAutorise: async (data: Partial<RequestUser> = {}) => {
          user = await createUserBuilder(data)
            .withRole(RoleEnum["pilote_region"])
            .create();
        },
        utilisateurNational: async () => {
          user = await createUserBuilder().withRole(RoleEnum["admin"]).create();
        },
        demandesAChangerExistantes: () => {
          demandesAChanger = [
            { numero: numeroDemandeExistants[0] },
            { numero: numeroDemandeExistants[1] },
          ];
        },
        demandesAChangerInexistantes: () => {
          demandesAChanger = [
            { numero: numeroDemandeExistants[0] },
            { numero: "NOTFOUND" },
          ];
        },
        demandesEtDemandeAChangerExistantes: () => {
          demandesAChanger = [
            { numero: numeroDemandeExistants[0] },
            { numero: numeroDemandeExistants[1], isDemande: false },
          ];
        },
        demandesExistantes: async (data: Partial<Demande> = {}) => {
          demandeOwner = await createUserBuilder().withRole(RoleEnum["perdir"]).create();
          demandes = [
            (
              await (
                await createDemandeBuilder(demandeOwner, data)
                  .withStatut(DemandeStatutEnum["proposition"])
                  .withNumero(numeroDemandeExistants[0])
                  .withCurrentCampagneId()
              ).injectInDB()
            ).build(),
            (
              await (
                await createDemandeBuilder(demandeOwner, data)
                  .withStatut(DemandeStatutEnum["proposition"])
                  .withNumero(numeroDemandeExistants[1])
                  .withCurrentCampagneId()
              ).injectInDB()
            ).build(),
          ];
        },
        demandesInexistantes: async () => {
          demandes = [
            undefined,
            undefined
          ];
        },
        statutProjetDeDemande: () => {
          statut = DemandeStatutEnum["projet de demande"];
        },
      },
      when: {
        soumettreChangementsStatut: async () => {
          const response = await app.inject({
            method: "POST",
            url: "/api/demandes/statut/submit",
            body: {
              demandes: demandesAChanger,
              statut,
            },
            cookies: user ? generateAuthCookie(user) : undefined,
          });
          responseCode = response.statusCode;
          responseBody = response.json();

          console.dir(responseBody, { depth: Infinity });
        },
      },
      then: {
        verifierReponseBadRquest: () => {
          expect(responseCode).toBe(400);
        },
        verifierReponseNonAutorise: () => {
          expect(responseCode).toBe(401);
        },
        verifierReponseInterdite: () => {
          expect(responseCode).toBe(403);
        },
        verifierReponseNonTrouvee: () => {
          expect(responseCode).toBe(404);
        },
        verifierReponseSucces: () => {
          expect(responseCode).toBe(200);
        },
        verifierChangementsStatutCrees: async () => {
          if (!demandesAChanger) {
            throw Error("Des demandes doivent être créées");
          }

          const changementDeStatuts = await getKbdClient()
            .selectFrom("changementStatut")
            .selectAll()
            .where("changementStatut.demandeNumero", "in", demandesAChanger.map((demande) => demande.numero))
            .execute();

          if (!changementDeStatuts) {
            throw Error("Des changements de statuts doivent être créés");
          }

          expect(changementDeStatuts).toHaveLength(demandesAChanger.length);

          changementDeStatuts.map((changementDeStatut) => {
            const demande = demandes?.find((demande) => demande?.numero === changementDeStatut.demandeNumero);

            if (!demande) {
              throw Error("Une demande doit exister pour chaque changement de statut");
            }

            expect(changementDeStatut).toBeDefined();
            expect(changementDeStatut?.createdBy).toBe(user?.id);
            expect(changementDeStatut?.statut).toBe(statut);
            expect(changementDeStatut?.statutPrecedent).toBe(demande?.statut);
          });
        },
        verifierDemandesMiseAJour: async () => {
          if (!demandes) {
            throw Error("Des demandes doivent être créées");
          } else {
            await Promise.all(
              demandes.map(async (demande) => {
                if(!demande) {
                  throw Error("Une demande doit être créée");
                }
                const updatedDemande = await findOneDemandeQuery(demande.numero);
                expect(updatedDemande?.statut).toBe(statut);
              })
            );
          }
        },
      },
    };
  };
});
