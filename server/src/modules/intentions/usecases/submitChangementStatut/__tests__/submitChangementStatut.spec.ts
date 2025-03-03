import { usePg } from "@tests/utils/pg.test.utils";
import type { ChangementStatut } from "@tests/utils/schema/changementStatut.spec.utils";
import { buildChangementStatut } from "@tests/utils/schema/changementStatut.spec.utils";
import type { Intention } from "@tests/utils/schema/intentions.spec.utils";
import { clearIntentions, createIntentionBuilder } from "@tests/utils/schema/intentions.spec.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import {RoleEnum} from 'shared';
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { IResError } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import { shootChangementStatutEmail } from "@/modules/intentions/usecases/submitChangementStatut/deps/shootChangementStatutEmail.deps";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

type Response = z.infer<
  (typeof ROUTES)["[POST]/intention/statut/submit"]["schema"]["response"]["200"]
>;

usePg();

describe("[POST]/intention/statut/submit", () => {
  let app: Server;
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  beforeEach(() => {
    fixture = fixtureBuilder(app);
    vi.mock("@/modules/intentions/usecases/submitChangementStatut/deps/shootChangementStatutEmail.deps", () => ({
      shootChangementStatutEmail: vi.fn(),
    }));
  });

  afterEach(async () => {
    await clearIntentions();
    vi.clearAllMocks();
  });

  describe("errors", () => {
    it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
      fixture.given.utilisateurAnonyme();
      await fixture.given.intentionExistante();
      fixture.given.changementStatut();

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseNonAutorise();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'a pas les permissions nécessaires", async () => {
      await fixture.given.utilisateurNonAuthorise();
      await fixture.given.intentionExistante();
      fixture.given.changementStatut();

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseInterdite();
    });

    it("doit retourner une erreur 404 si l'intention n'existe pas", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.intentionExistante();
      fixture.given.changementStatut({ intentionNumero: "1234567890" });

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseNonTrouvee();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'est pas de la même région que l'intention", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "11" });
      await fixture.given.intentionExistante({ codeRegion: "76" });
      fixture.given.changementStatut();

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseInterdite();
    });
  });

  describe("success", () => {
    it("doit créer un changement de statut pour une intention de sa région", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "76" });
      await fixture.given.intentionExistante({ codeRegion: "76" });
      fixture.given.changementStatut({
        statutPrecedent: DemandeStatutEnum.brouillon,
        statut: DemandeStatutEnum.proposition,
      });

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementStatutCree();
      await fixture.then.verifierIntentionMiseAJour();
      fixture.then.verifierEmailEnvoye();
    });

    it("doit pouvoir créer un changement de statut pour n'importe quelle intention en tant qu'utilisateur national", async () => {
      await fixture.given.utilisateurNational();
      await fixture.given.intentionExistante();
      fixture.given.changementStatut({
        statutPrecedent: DemandeStatutEnum.brouillon,
        statut: DemandeStatutEnum.proposition,
      });

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementStatutCree();
      await fixture.then.verifierIntentionMiseAJour();
      fixture.then.verifierEmailEnvoye();
    });
  });

  const fixtureBuilder = (app: Server) => {
    let intentionOwner: RequestUser | undefined = undefined;
    let user: RequestUser | undefined = undefined;
    let intention: Intention | undefined = undefined;
    let changementStatut: ChangementStatut | undefined = undefined;
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
        intentionExistante: async (data: Partial<Intention> = {}) => {
          intentionOwner = await createUserBuilder().withRole(RoleEnum["perdir"]).create();
          intention = (
            await (
              await createIntentionBuilder(intentionOwner, data).withCurrentCampagneId()
            ).injectInDB()
          ).build();
        },
        intentionInexistante: async () => {
          intention = undefined;
        },
        changementStatut: (data: Partial<ChangementStatut> = {}) => {
          if (intention) {
            changementStatut = buildChangementStatut(user, {
              intentionNumero: intention.numero,
              ...data,
            }).build();
          }
        },
      },
      when: {
        soumettreChangementStatut: async () => {
          const response = await app.inject({
            method: "POST",
            url: "/api/intention/statut/submit",
            body: {
              changementStatut,
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
        verifierChangementStatutCree: async () => {
          if (!changementStatut?.intentionNumero) {
            throw Error("Un changement de statut doit être créé");
          }

          const changementDeStatuts = await getKbdClient()
            .selectFrom("changementStatut")
            .selectAll()
            .where("changementStatut.intentionNumero", "=", intention!.numero)
            .execute();

          expect(changementDeStatuts).toHaveLength(1);

          const changementDeStatut = changementDeStatuts[0];

          expect(changementDeStatut).toBeDefined();
          expect(changementDeStatut?.createdBy).toBe(user?.id);
          expect(changementDeStatut?.statut).toBe(changementStatut.statut);
          expect(changementDeStatut?.statutPrecedent).toBe(changementStatut.statutPrecedent);
        },
        verifierIntentionMiseAJour: async () => {
          if (!intention?.numero) {
            throw Error("Une intention doit être créée");
          }
          const updatedIntention = await findOneIntention(intention.numero);
          expect(updatedIntention?.statut).toBe(changementStatut?.statut);
        },
        verifierEmailEnvoye: () => {
          expect(shootChangementStatutEmail).toHaveBeenCalledWith(
            changementStatut?.statutPrecedent,
            changementStatut?.statut,
            expect.objectContaining({ numero: intention?.numero })
          );
        },
      },
    };
  };
});
