import { usePg } from "@tests/utils/pg.test.utils";
import type { ChangementStatut } from "@tests/utils/schema/changementStatut.spec.utils";
import { buildChangementStatut } from "@tests/utils/schema/changementStatut.spec.utils";
import type { Demande } from "@tests/utils/schema/demande.spec.utils";
import { clearDemandes, createDemandeBuilder } from "@tests/utils/schema/demande.spec.utils";
import { createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import {RoleEnum} from 'shared';
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { IResError } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { shootChangementStatutEmail } from "@/modules/demandes/usecases/submitChangementStatut/deps/shootChangementStatutEmail.dep";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

type Response = z.infer<
  (typeof ROUTES)["[POST]/demande/statut/submit"]["schema"]["response"]["200"]
>;

usePg();

describe("[POST]/demande/statut/submit", () => {
  let app: Server;
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  beforeEach(() => {
    fixture = fixtureBuilder(app);
    vi.mock("@/modules/demandes/usecases/submitChangementStatut/deps/shootChangementStatutEmail.dep", () => ({
      shootChangementStatutEmail: vi.fn(),
    }));
  });

  afterEach(async () => {
    await clearDemandes();
    vi.clearAllMocks();
  });

  describe("errors", () => {
    it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
      fixture.given.utilisateurAnonyme();
      await fixture.given.demandeExistante();
      fixture.given.changementStatut();

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseNonAutorise();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'a pas les permissions nécessaires", async () => {
      await fixture.given.utilisateurNonAuthorise();
      await fixture.given.demandeExistante();
      fixture.given.changementStatut();

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseInterdite();
    });

    it("doit retourner une erreur 404 si la demande n'existe pas", async () => {
      await fixture.given.utilisateurAutorise();
      await fixture.given.demandeExistante();
      fixture.given.changementStatut({ demandeNumero: "1234567890" });

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseNonTrouvee();
    });

    it("doit retourner une erreur 403 si l'utilisateur n'est pas de la même région que la demande", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "11" });
      await fixture.given.demandeExistante({ codeRegion: "76" });
      fixture.given.changementStatut();

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseInterdite();
    });
  });

  describe("success", () => {
    it("doit créer un changement de statut pour une demande de sa région", async () => {
      await fixture.given.utilisateurAutorise({ codeRegion: "76" });
      await fixture.given.demandeExistante({ codeRegion: "76" });
      fixture.given.changementStatut({
        statutPrecedent: DemandeStatutEnum.brouillon,
        statut: DemandeStatutEnum.proposition,
      });

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementStatutCree();
      await fixture.then.verifierDemandeMiseAJour();
      fixture.then.verifierEmailEnvoye();
    });

    it("doit pouvoir créer un changement de statut pour n'importe quelle demande en tant qu'utilisateur national", async () => {
      await fixture.given.utilisateurNational();
      await fixture.given.demandeExistante();
      fixture.given.changementStatut({
        statutPrecedent: DemandeStatutEnum.brouillon,
        statut: DemandeStatutEnum.proposition,
      });

      await fixture.when.soumettreChangementStatut();

      fixture.then.verifierReponseSucces();
      await fixture.then.verifierChangementStatutCree();
      await fixture.then.verifierDemandeMiseAJour();
      fixture.then.verifierEmailEnvoye();
    });
  });

  const fixtureBuilder = (app: Server) => {
    let demandeOwner: RequestUser | undefined = undefined;
    let user: RequestUser | undefined = undefined;
    let demande: Demande | undefined = undefined;
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
        demandeExistante: async (data: Partial<Demande> = {}) => {
          demandeOwner = await createUserBuilder().withRole(RoleEnum["perdir"]).create();
          demande = (
            await (
              await createDemandeBuilder(demandeOwner, data).withCurrentCampagneId()
            ).injectInDB()
          ).build();
        },
        demandeInexistante: async () => {
          demande = undefined;
        },
        changementStatut: (data: Partial<ChangementStatut> = {}) => {
          if (demande) {
            changementStatut = buildChangementStatut(user, {
              demandeNumero: demande.numero,
              ...data,
            }).build();
          }
        },
      },
      when: {
        soumettreChangementStatut: async () => {
          const response = await app.inject({
            method: "POST",
            url: "/api/demande/statut/submit",
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
          if (!changementStatut?.demandeNumero) {
            throw Error("Un changement de statut doit être créé");
          }

          const changementsStatut = await getKbdClient()
            .selectFrom("changementStatut")
            .selectAll()
            .where("changementStatut.demandeNumero", "=", demande!.numero)
            .execute();

          expect(changementsStatut).toHaveLength(1);

          const changementDeStatut = changementsStatut[0];

          expect(changementDeStatut).toBeDefined();
          expect(changementDeStatut?.createdBy).toBe(user?.id);
          expect(changementDeStatut?.statut).toBe(changementStatut.statut);
          expect(changementDeStatut?.statutPrecedent).toBe(changementStatut.statutPrecedent);
        },
        verifierDemandeMiseAJour: async () => {
          if (!demande?.numero) {
            throw Error("Une demande doit être créée");
          }
          const updatedDemande = await findOneDemandeQuery(demande.numero);
          expect(updatedDemande?.statut).toBe(changementStatut?.statut);
        },
        verifierEmailEnvoye: () => {
          expect(shootChangementStatutEmail).toHaveBeenCalledWith(
            changementStatut?.statutPrecedent,
            changementStatut?.statut,
            expect.objectContaining({ numero: demande?.numero })
          );
        },
      },
    };
  };
});
