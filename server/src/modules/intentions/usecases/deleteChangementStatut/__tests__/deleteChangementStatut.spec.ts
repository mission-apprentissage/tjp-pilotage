import { usePg } from "@tests/utils/pg.test.utils";
import type { ChangementStatut } from "@tests/utils/schema/changementStatut.spec.utils";
import { buildChangementStatut } from "@tests/utils/schema/changementStatut.spec.utils";
import type { Intention } from "@tests/utils/schema/intentions.spec.utils";
import { clearIntentions, createIntentionBuilder } from "@tests/utils/schema/intentions.spec.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import { RoleEnum } from "shared";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneChangementStatut } from "@/modules/intentions/repositories/findOneChangementStatut.query";
import { generateId } from "@/modules/utils/generateId";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

describe("[DELETE]/intention/changement-statut/:id", () => {
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
      await fixture.given.changementStatutExistant();

      await fixture.when.supprimerChangementStatut();

      fixture.then.verifierReponseNonAutorise();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'a pas les permissions nécessaires", async () => {
      await fixture.given.utilisateurNonAuthorise();
      await fixture.given.changementStatutExistant();

      await fixture.when.supprimerChangementStatut();

      fixture.then.verifierReponseInterdite();
    });

    it("doit retourner une erreur 404 si le changement de statut n'existe pas", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.changementStatutInexistant();

      await fixture.when.supprimerChangementStatut();

      fixture.then.verifierReponseNonTrouvee();
    });

    it("doit retourner une erreur 404 si l'intention liée au changement de statut n'existe pas", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.intentionInexistante();
      await fixture.given.changementStatutExistant();

      await fixture.when.supprimerChangementStatut();

      fixture.then.verifierReponseNonTrouvee();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'est pas de la même région que l'intention", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "11" });
      await fixture.given.intentionExistante({ codeRegion: "76" });
      await fixture.given.changementStatutExistant();

      await fixture.when.supprimerChangementStatut();

      fixture.then.verifierReponseInterdite();
    });
  });

  describe("success", () => {
    it("doit pouvoir supprimer un changement de statut de sa région", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.intentionExistante();
      await fixture.given.changementStatutExistant();

      await fixture.when.supprimerChangementStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementStatutSupprime();
    });

    it("doit pouvoir supprimer n'importe quel changement de statut en tant qu'utilisateur national", async () => {
      await fixture.given.utilisateurNational();
      await fixture.given.intentionExistante();
      await fixture.given.changementStatutExistant();

      await fixture.when.supprimerChangementStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementStatutSupprime();
    });
  });

  const fixtureBuilder = (app: Server) => {
    let user: RequestUser | undefined = undefined;
    let intention: Intention | undefined = undefined;
    let changementStatut: ChangementStatut | undefined = undefined;
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
        intentionExistante: async (data = {}) => {
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
        changementStatutExistant: async (input: Partial<ChangementStatut> = {}) => {
          if (user && intention) {
            changementStatut = (await buildChangementStatut(
              user,
              { intentionNumero: intention.numero, ...input }
            ).injectInDB()).build();
          }
        },
        changementStatutInexistant: () => {
          changementStatut = undefined;
        },
      },
      when: {
        supprimerChangementStatut: async () => {
          const response = await app.inject({
            method: "DELETE",
            url: `/api/intention/statut/${changementStatut?.id ?? generateId()}`,
            cookies: user ? generateAuthCookie(user) : undefined,
          });

          responseCode = response.statusCode;
        },
      },
      then: {
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
        verifierChangementStatutSupprime: async () => {
          if (!changementStatut) {
            throw Error("Un changement de statut doit être créé avant de pouvoir le supprimer");
          }
          const deletedChangementStatut = await findOneChangementStatut(changementStatut.id!);
          expect(deletedChangementStatut).toBeUndefined();
        },
      },
    };
  };
});
