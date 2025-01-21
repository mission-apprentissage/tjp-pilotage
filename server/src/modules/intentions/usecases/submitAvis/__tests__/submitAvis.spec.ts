import { usePg } from "@tests/utils/pg.test.utils";
import type { Avis } from "@tests/utils/schema/avis.spec.utils";
import { buildAvis } from "@tests/utils/schema/avis.spec.utils";
import type { Intention } from "@tests/utils/schema/intentions.spec.utils";
import { createIntentionBuilder } from "@tests/utils/schema/intentions.spec.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import type { IResError } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

type Response = z.infer<
  (typeof ROUTES)["[POST]/intention/avis/submit"]["schema"]["response"]["200"]
>;

describe("[POST]/intention/avis/submit", () => {
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

  describe("errors", () => {
    it("l'utilisateur doit être authentifié pour soumettre un avis", async () => {
      fixture.given.utilisateurAnonyme();
      fixture.given.avis();

      await fixture.when.soumettreAvis();

      fixture.then.expectResponseToBeUnauthorized();
    });

    it("retourne une erreur 401 si l'utilisateur n'a pas les permissions nécessaires", async () => {
      await fixture.given.utilisateurNonAuthorise();
      fixture.given.avis();

      await fixture.when.soumettreAvis();

      fixture.then.expectResponseToBeForbidden();
    });

    it("retourne une erreur 404 si l'intention n'existe pas", async () => {
      await fixture.given.utilisateurRegion();
      fixture.given.avis({ intentionNumero: "INTENTION_INEXISTANTE" });

      await fixture.when.soumettreAvis();

      fixture.then.expectResponseToBeNotFound();
    });

    it("retourne une erreur 403 si l'utilisateur n'est pas de la même région que l'intention", async () => {
      await fixture.given.utilisateurRegion({ codeRegion: "11" });
      await fixture.given.intentionExistante({ codeRegion: "76" });
      fixture.given.avisAssocieAIntention();

      await fixture.when.soumettreAvis();

      fixture.then.expectResponseToBeForbidden();
    });
  });

  describe("success", () => {
    it("crée un nouvel avis avec succès pour un utilisateur autorisé", async () => {
      await fixture.given.utilisateurRegion();
      await fixture.given.intentionExistante();
      fixture.given.avisAssocieAIntention();

      await fixture.when.soumettreAvis();

      fixture.then.expectAvisToBeCreated();
    });

    it("crée un avis avec succès pour un utilisateur national", async () => {
      await fixture.given.utilisateurNational();
      await fixture.given.intentionExistante();
      fixture.given.avisAssocieAIntention();

      await fixture.when.soumettreAvis();

      fixture.then.expectAvisToBeCreated();
    });
  });

  const fixtureBuilder = (app: Server) => {
    let user: RequestUser | undefined = undefined;
    let avis: Avis | undefined = undefined;
    let intention: Intention | undefined = undefined;
    let responseBody: Response | IResError;
    let responseCode: number;

    return {
      given: {
        utilisateurAnonyme: () => {
          user = undefined;
        },
        utilisateurNonAuthorise: async () => {
          user = await createUserBuilder().withRole("invite").create();
        },
        avis: (input: Partial<Avis> = {}) => {
          avis = buildAvis(user, input).build();
        },
        avisAssocieAIntention: (input: Partial<Avis> = {}) => {
          avis = buildAvis(user, {
            ...input,
            intentionNumero: intention?.numero,
          }).build();
        },
        utilisateurRegion: async (data: Partial<RequestUser> = {}) => {
          user = await createUserBuilder(data).withRole("region").create();
        },
        utilisateurNational: async () => {
          user = await createUserBuilder().withRole("admin").create();
        },
        intentionExistante: async (data: Partial<Intention> = {}) => {
          if (user) {
            intention = (
              await (
                await createIntentionBuilder(user, data).withCurrentCampagneId()
              ).injectInDB()
            ).build();

            console.log(intention);
          }
        },
      },
      when: {
        soumettreAvis: async () => {
          const response = await app.inject({
            method: "POST",
            url: "/api/intention/avis/submit",
            body: {
              avis,
            },
            cookies: user ? generateAuthCookie(user) : undefined,
          });
          responseCode = response.statusCode;
          responseBody = response.json() as Response | IResError;

          console.dir(responseBody, { depth: Infinity });
        },
      },
      then: {
        expectResponseToBeUnauthorized: () => {
          expect(responseCode).toBe(401);
        },
        expectResponseToBeBadRequest: () => {
          expect(responseCode).toBe(400);
        },
        expectResponseToBeForbidden: () => {
          expect(responseCode).toBe(403);
        },
        expectResponseToBeNotFound: () => {
          expect(responseCode).toBe(404);
        },
        expectAvisToBeCreated: () => {
          expect(responseCode).toBe(200);
          const {
            intentionNumero,
            createdBy,
            statutAvis,
            isVisibleParTous,
            typeAvis,
          } = responseBody as Response;
          expect(intentionNumero).toBe(intention?.numero);
          expect(statutAvis).toBe(avis?.statutAvis);
          expect(isVisibleParTous).toBe(avis?.isVisibleParTous);
          expect(typeAvis).toBe(avis?.typeAvis);
          expect(createdBy).toBe(user?.id);
        },
      },
    };
  };
});
