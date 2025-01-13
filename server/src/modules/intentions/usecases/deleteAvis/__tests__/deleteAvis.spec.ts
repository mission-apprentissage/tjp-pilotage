import { usePg } from "@tests/utils/pg.test.utils";
import type { Avis } from "@tests/utils/schema/avis.spec.utils";
import { buildAvis, clearAvis } from "@tests/utils/schema/avis.spec.utils";
import type { Intention } from "@tests/utils/schema/intentions.spec.utils";
import { createIntentionBuilder } from "@tests/utils/schema/intentions.spec.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneAvisQuery } from "@/modules/intentions/usecases/deleteAvis/deps/findOneAvis.query";
import { generateId } from "@/modules/utils/generateId";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

describe("[DELETE]/intention/avis/:id", () => {
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
    await clearAvis();
  });

  describe("errors", () => {
    it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
      fixture.given.utilisateurAnonyme();
      await fixture.given.avisExistant();

      await fixture.when.supprimerAvis();

      fixture.then.expectResponseToBeUnauthorized();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'a pas les permissions nécessaires", async () => {
      await fixture.given.utilisateurNonAuthorise();
      await fixture.given.avisExistant();

      await fixture.when.supprimerAvis();

      fixture.then.expectResponseToBeForbidden();
    });

    it("doit retourner une erreur 404 si l'avis n'existe pas", async () => {
      await fixture.given.utilisateurPiloteRegion();
      await fixture.given.avisInexistant();

      await fixture.when.supprimerAvis();

      fixture.then.expectResponseToBeNotFound();
    });

    it("doit retourner une erreur 404 si l'intention liée à l'avis n'existe pas", async () => {
      await fixture.given.utilisateurPiloteRegion();
      await fixture.given.intentionInexistante();
      await fixture.given.avisExistant();

      await fixture.when.supprimerAvis();

      fixture.then.expectResponseToBeNotFound();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'est pas de la même région que l'intention", async () => {
      await fixture.given.utilisateurPiloteRegion({ codeRegion: "11" });
      await fixture.given.intentionExistante({ codeRegion: "76" });
      await fixture.given.avisExistant();

      await fixture.when.supprimerAvis();

      fixture.then.expectResponseToBeForbidden();
    });
  });

  describe("success", () => {
    it("doit pouvoir supprimer un avis de sa région", async () => {
      await fixture.given.utilisateurPiloteRegion();
      await fixture.given.intentionExistante();
      await fixture.given.avisExistant();

      await fixture.when.supprimerAvis();

      fixture.then.expectResponseToBeOK();
      await fixture.then.expectAvisToBeDeleted();
    });

    it("doit pouvoir supprimer n'importe quel avis", async () => {
      await fixture.given.utilisateurNational();
      await fixture.given.intentionExistante();
      await fixture.given.avisExistant();

      await fixture.when.supprimerAvis();

      fixture.then.expectResponseToBeOK();
      await fixture.then.expectAvisToBeDeleted();
    });
  });

  const fixtureBuilder = (app: Server) => {
    let user: RequestUser | undefined = undefined;
    let avis: Avis | undefined = undefined;
    let intention: Intention | undefined = undefined;
    let responseCode: number;

    return {
      given: {
        utilisateurAnonyme: () => {
          user = undefined;
        },
        utilisateurNonAuthorise: async () => {
          user = await createUserBuilder().withRole("invite").create();
        },
        utilisateurPiloteRegion: async (data: Partial<RequestUser> = {}) => {
          user = await createUserBuilder(data)
            .withRole("pilote_region")
            .create();
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
          }
        },
        intentionInexistante: async () => {
          intention = undefined;
        },
        avisExistant: async (input: Partial<Avis> = {}) => {
          if (user && intention) {
            avis = (
              await buildAvis(user, {
                ...input,
                intentionNumero: intention.numero,
              }).injectInDB()
            ).build();
          }
        },
        avisInexistant: () => {
          avis = undefined;
        },
      },
      when: {
        supprimerAvis: async () => {
          const response = await app.inject({
            method: "DELETE",
            url: `/api/intention/avis/${avis?.id ?? generateId()}`,
            cookies: user ? generateAuthCookie(user) : undefined,
          });
          responseCode = response.statusCode;
        },
      },
      then: {
        expectResponseToBeUnauthorized: () => {
          expect(responseCode).toBe(401);
        },
        expectResponseToBeForbidden: () => {
          expect(responseCode).toBe(403);
        },
        expectResponseToBeNotFound: () => {
          expect(responseCode).toBe(404);
        },
        expectResponseToBeOK: () => {
          expect(responseCode).toBe(200);
        },
        expectAvisToBeDeleted: async () => {
          if (!avis) {
            throw Error("Un avis doit être créé avant de pouvoir le supprimer");
          }
          const deletedAvis = await findOneAvisQuery(avis.id!);
          expect(deletedAvis).toBeUndefined();
        },
      },
    };
  };
});
