import { usePg } from "@tests/utils/pg.test.utils";
import type { Intention } from "@tests/utils/schema/intentions.spec.utils";
import { clearIntentions, createIntentionBuilder } from "@tests/utils/schema/intentions.spec.utils";
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
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

type Response = z.infer<
  (typeof ROUTES)["[POST]/intentions/statut/submit"]["schema"]["response"]["200"]
>;

usePg();

describe("[POST]/intentions/statut/submit", () => {
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
    vi.clearAllMocks();
  });

  describe("errors", () => {
    it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
      fixture.given.utilisateurAnonyme();
      fixture.given.statutProjetDeDemande();
      fixture.given.intentionsAChangerExistantes();
      await fixture.given.intentionsExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseNonAutorise();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'a pas les permissions nécessaires", async () => {
      await fixture.given.utilisateurNonAuthorise();
      fixture.given.statutProjetDeDemande();
      fixture.given.intentionsAChangerExistantes();
      await fixture.given.intentionsExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseInterdite();
    });

    it("doit retourner une erreur 404 si les intentions n'existent pas", async () => {
      await fixture.given.utilisateurAutorise();
      fixture.given.statutProjetDeDemande();
      fixture.given.intentionsAChangerInexistantes();
      await fixture.given.intentionsExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseNonTrouvee();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'est pas de la même région que les intentions", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "11" });
      fixture.given.statutProjetDeDemande();
      fixture.given.intentionsAChangerExistantes();
      await fixture.given.intentionsExistantes({ codeRegion: "76" });

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseInterdite();
    });
  });

  describe("success", () => {
    it("doit créer des changements de statut pour des intentions de sa région", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "76" });
      fixture.given.statutProjetDeDemande();
      fixture.given.intentionsAChangerExistantes();
      await fixture.given.intentionsExistantes({ codeRegion: "76" });

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementsStatutCrees();
      await fixture.then.verifierIntentionsMiseAJour();
    });

    it("doit créer des changements de statut pour n'importe quelles intentions en tant qu'utilisateur national", async () => {
      await fixture.given.utilisateurNational();
      fixture.given.statutProjetDeDemande();
      fixture.given.intentionsAChangerExistantes();
      await fixture.given.intentionsExistantes();

      await fixture.when.soumettreChangementsStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementsStatutCrees();
      await fixture.then.verifierIntentionsMiseAJour();
    });
  });

  const fixtureBuilder = (app: Server) => {
    const numeroIntentionExistants: string[] = [
      "test1",
      "test2",
      "test3",
      "test4",
    ];

    let intentionOwner: RequestUser | undefined = undefined;
    let user: RequestUser | undefined = undefined;
    let intentionsAChanger: Array<{
      numero: string;
    }> | undefined = undefined;
    let intentions: Array<Intention | undefined> | undefined = undefined;
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
        intentionsAChangerExistantes: () => {
          intentionsAChanger = [
            { numero: numeroIntentionExistants[0] },
            { numero: numeroIntentionExistants[1] },
          ];
        },
        intentionsAChangerInexistantes: () => {
          intentionsAChanger = [
            { numero: numeroIntentionExistants[0] },
            { numero: "NOTFOUND" },
          ];
        },
        intentionsExistantes: async (data: Partial<Intention> = {}) => {
          intentionOwner = await createUserBuilder().withRole(RoleEnum["perdir"]).create();
          intentions = [
            (
              await (
                await createIntentionBuilder(intentionOwner!, data)
                  .withStatut(DemandeStatutEnum["proposition"])
                  .withNumero(numeroIntentionExistants[0])
                  .withCurrentCampagneId()
              ).injectInDB()
            ).build(),
            (
              await (
                await createIntentionBuilder(intentionOwner!, data)
                  .withStatut(DemandeStatutEnum["proposition"])
                  .withNumero(numeroIntentionExistants[1])
                  .withCurrentCampagneId()
              ).injectInDB()
            ).build(),
          ];
        },
        intentionsInexistantes: async () => {
          intentions = [
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
            url: "/api/intentions/statut/submit",
            body: {
              intentions: intentionsAChanger,
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
          const changementDeStatuts = await getKbdClient()
            .selectFrom("changementStatut")
            .selectAll()
            .where("changementStatut.intentionNumero", "in", intentionsAChanger!.map((intention) => intention.numero))
            .execute();

          if (!changementDeStatuts) {
            throw Error("Des changements de statuts doivent être créés");
          }

          expect(changementDeStatuts).toHaveLength(intentionsAChanger!.length);

          changementDeStatuts.map((changementDeStatut) => {
            const intention = intentions?.find((intention) => intention?.numero === changementDeStatut.intentionNumero);

            if (!intention) {
              throw Error("Une intention doit exister pour chaque changement de statut");
            }

            expect(changementDeStatut).toBeDefined();
            expect(changementDeStatut?.createdBy).toBe(user?.id);
            expect(changementDeStatut?.statut).toBe(statut);
            expect(changementDeStatut?.statutPrecedent).toBe(intention?.statut);
          });
        },
        verifierIntentionsMiseAJour: async () => {
          if (!intentions) {
            throw Error("Des intentions doivent être créées");
          } else {
            await Promise.all(
              intentions.map(async (intention) => {
                if(!intention) {
                  throw Error("Une intention doit être créée");
                }
                const updatedIntention = await findOneIntention(intention.numero);
                expect(updatedIntention?.statut).toBe(statut);
              })
            );
          }
        },
      },
    };
  };
});
