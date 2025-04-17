import { usePg } from "@tests/utils/pg.test.utils";
import type { Demande } from "@tests/utils/schema/demande.spec.utils";
import {
  clearDemandes,
  createDemandeBuilder,
} from "@tests/utils/schema/demande.spec.utils";
import {
  clearUsers,
  createUserBuilder,
  generateAuthCookie,
} from "@tests/utils/schema/users.spec.utils";
import {RoleEnum} from 'shared';
import type {DemandeStatutType} from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum  } from "shared/enum/demandeStatutEnum";
import {DemandeTypeEnum} from 'shared/enum/demandeTypeEnum';
import type { IResErrorJson } from "shared/models/errors";
import type { ROUTES } from "shared/routes/routes";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import type { Server } from "@/server/server";
import createServer from "@/server/server.js";

usePg();

type Response = z.infer<
  (typeof ROUTES)["[POST]/demande/submit"]["schema"]["response"]["200"]
>;

describe("[POST]/demande/submit", () => {
  let app: Server;
  let adminUser: RequestUser;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  beforeEach(async () => {
    adminUser = await createUserBuilder().withRole(RoleEnum["admin"]).create();
  });

  afterEach(async () => {
    await clearDemandes();
    await clearUsers();
  });

  it("doit retourner une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
    const demande = createDemandeBuilder(adminUser).build();

    const response = await submitDemande(app, demande);

    expect(response.statusCode).toBe(401);
  });

  it("doit retourner une erreur 403 si l'utilisateur n'a pas un rôle lui permettant de soumettre une demande", async () => {
    const user = await createUserBuilder().withRole(RoleEnum["invite"]).create();

    const demande = await createDemandeBuilder(user).build();

    const response = await submitDemande(app, demande, user);

    expect(response.statusCode).toBe(403);
  });

  it("doit retourner une erreur 400 dans le cas ou le code uai n'est pas valide", async () => {
    const demande = createDemandeBuilder(adminUser)
      .withUai("1234567890")
      .build();

    const response = await submitDemande(app, demande, adminUser);

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "Code uai non valide",
      name: "Bad Request",
      statusCode: 400,
    });
  });

  it("doit retourner une erreur 403 si l'utilisateur saisie une demande sur un établissement autre que celui qui lui est associé", async () => {
    const perdir = await createUserBuilder()
      .withRole(RoleEnum["perdir"])
      .withUais(["0820917B"])
      .create();
    const demande = await (
      await createDemandeBuilder(perdir)
        .withUai("0340061G")
        .withCurrentCampagneId()
    ).injectInDB();

    const response = await submitDemande(app, demande.build(), perdir);

    expect(response.statusCode).toBe(403);
  });

  it("doit retourner une erreur 400 si une demande similaire existe déjà", async () => {
    const demande = (
      await (
        await createDemandeBuilder(adminUser).withCurrentCampagneId()
      ).injectInDB()
    ).build();

    const sameDemandeAsExisting = createDemandeBuilder(adminUser, demande)
      .withId()
      .withNumero()
      .build();
    const response = await submitDemande(
      app,
      sameDemandeAsExisting,
      adminUser
    );

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toEqual("Demande similaire existante");
  });

  it("doit créer une nouvelle demande avec succès", async () => {
    const demande = (
      await createDemandeBuilder(adminUser).withCurrentCampagneId()
    ).build();

    const response = await submitDemande(app, demande, adminUser);

    expectResponseToBeOk(response.statusCode);

    const result = response.json() as Response;
    expect(result.id).toBeTypeOf("string");
    expect(result.numero).toBeTypeOf("string");
    expect(result.statut).toEqual(demande.statut);
  });

  it("doit mettre à jour une demande existante", async () => {
    const demande = (
      await (
        await createDemandeBuilder(adminUser).withCurrentCampagneId()
      ).injectInDB()
    ).build();
    const demandeWithStatutProposition = createDemandeBuilder(
      adminUser,
      demande
    )
      .withStatut(DemandeStatutEnum["proposition"])
      .build();

    const response = await submitDemande(
      app,
      demandeWithStatutProposition,
      adminUser
    );

    expectResponseToBeOk(response.statusCode);

    const result = response.json() as Response;
    expect(result.id).toBeTypeOf("string");
    expect(result.statut).toEqual(DemandeStatutEnum["proposition"]);
    expect(result.numero).toEqual(demande.numero);
  });

  it("doit créer un changement de statut lors de la mise à jour du statut", async () => {
    const demande = (
      await (
        await createDemandeBuilder(adminUser).withCurrentCampagneId()
      ).injectInDB()
    ).build();
    const demandeWithStatutProposition = createDemandeBuilder(
      adminUser,
      demande
    )
      .withStatut(DemandeStatutEnum["proposition"])
      .build();

    const response = await submitDemande(
      app,
      demandeWithStatutProposition,
      adminUser
    );

    expectResponseToBeOk(response.statusCode);

    await expectChangementDeStatutExisting(
      demande.numero,
      demandeWithStatutProposition.statut as DemandeStatutType
    );
  });

  describe("ouverture_nette", () => {
    it("doit retourner une erreur si le nombre de places ouvertes est égale de zero", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          capaciteScolaire: 0,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        sommeCapacite:
          "La somme des futures capacités doit être supérieure à 0",
      });
    });

    it("doit être valide si le nombre de places ouvertes est supérieur à 0", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          capaciteScolaire: 1,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });
  });

  describe("fermeture", () => {
    it("doit retourner une erreur si la capacité scolaire est supérieure à 0", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum[DemandeTypeEnum["fermeture"]],
          capaciteScolaire: 1,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteScolaire:
          "La capacité scolaire devrait être à 0 dans le cas d'une fermeture",
        sommeCapaciteActuelle:
          "La somme des capacités actuelles doit être supérieure à 0",
      });
    });

    it("doit retourner une erreur si la capacité en apprentissage est supérieur à zéro", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["fermeture"],
          capaciteScolaire: 0,
          capaciteApprentissage: 1,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteApprentissage:
          "La future capacité en apprentissage devrait être à 0 dans le cas d'une fermeture",
        sommeCapaciteActuelle:
          "La somme des capacités actuelles doit être supérieure à 0",
      });
    });

    it("doit retourner une erreur si la capacité scolaire colorée est supérieur à zéro", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["fermeture"],
          capaciteScolaire: 0,
          capaciteApprentissage: 0,
          capaciteScolaireColoree: 1,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteScolaireColoree:
          "La future capacité scolaire colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration",
        sommeCapaciteActuelle:
          "La somme des capacités actuelles doit être supérieure à 0",
        sommeCapaciteColoree:
          "La somme des futures capacités colorées doit être inférieure ou égale à la somme des futures capacités",
      });
    });

    it("doit retourner une erreur si la capacité en apprentissage colorée est supérieur à zéro", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["fermeture"],
          capaciteScolaire: 0,
          capaciteApprentissage: 0,
          capaciteScolaireColoree: 0,
          capaciteApprentissageColoree: 1,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteApprentissageColoree:
          "La future capacité en apprentissage colorée doit être à 0 dans le cas d'une fermeture",
        sommeCapaciteActuelle:
          "La somme des capacités actuelles doit être supérieure à 0",
        sommeCapaciteColoree:
          "La somme des futures capacités colorées doit être inférieure ou égale à la somme des futures capacités",
      });
    });

    it("doit accepter une demande de fermeture valide", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["fermeture"],
          capaciteScolaire: 0,
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 3,
          capaciteApprentissage: 0,
          capaciteScolaireColoree: 0,
          capaciteApprentissageColoree: 0,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });
  });

  describe("augmentation_nette", () => {
    it("doit retourner une erreur si la capacité scolaire est inférieur à la capacité actuelle", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["augmentation_nette"],
          capaciteScolaireActuelle: 10,
          capaciteScolaire: 5,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteScolaire:
          "La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation",
        sommeCapacite:
          "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation",
      });
    });

    it("doit retourner une erreur si la somme des futures capacités est inférieur à la somme des capacités actuelles", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["augmentation_nette"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 10,
          capaciteApprentissage: 5,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        sommeCapacite:
          "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation",
      });
    });

    it("doit accepter une demande d'augmentation valide avec augmentation de la capacité scolaire", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["augmentation_nette"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 15, // Augmentation de 5
          capaciteApprentissage: 5, // Reste identique
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });

    it("doit accepter une demande d'augmentation valide avec augmentation de la capacité en apprentissage", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["augmentation_nette"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 10, // Reste identique
          capaciteApprentissage: 10, // Augmentation de 5
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });

    it("doit accepter une demande d'augmentation valide avec augmentation des deux capacités", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["augmentation_nette"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 15, // Augmentation de 5
          capaciteApprentissage: 10, // Augmentation de 5
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });
  });

  describe("diminution", () => {
    it("doit retourner une erreur si la capacité scolaire est supérieur à la capacité actuelle", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["diminution"],
          capaciteScolaireActuelle: 10,
          capaciteScolaire: 15,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteScolaire:
          "La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'une diminution",
        sommeCapacite:
          "La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution",
      });
    });

    it("doit retourner une erreur si la somme des futures capacités est supérieur à la somme des capacités actuelles", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["diminution"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 8,
          capaciteApprentissage: 8, // La somme finale (16) est supérieure à la somme initiale (15)
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteApprentissage:
          "La future capacité en apprentissage devrait être inférieure ou égale à la capacité actuelle dans le cas d'une diminution",
        sommeCapacite:
          "La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution",
      });
    });

    it("doit accepter une demande de diminution valide", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["diminution"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 5,
          capaciteApprentissage: 5,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });
  });

  describe("transfert", () => {
    it("doit avoir des capacités positives pour le scolaire et l'apprentissage", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["transfert"],
          capaciteScolaireActuelle: 0,
          capaciteApprentissageActuelle: 0,
          capaciteScolaire: 0,
          capaciteApprentissage: 0,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteApprentissage:
          "La future capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage",
        capaciteScolaire:
          "Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.",
        sommeCapacite:
          "La somme des futures capacités doit être supérieure à 0",
        sommeCapaciteActuelle:
          "La somme des capacités actuelles doit être supérieure à 0",
      });
    });

    it("doit avoir une variation inverse entre le scolaire et l'apprentissage", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["transfert"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 12,
          capaciteApprentissage: 7,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectValidationErrorMessageToBe(response.json(), {
        capaciteScolaire:
          "Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.",
      });
    });

    it("doit accepter un transfert du scolaire vers l'apprentissage", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["transfert"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 5,
          capaciteScolaire: 5, // Diminution de 5
          capaciteApprentissage: 10, // Augmentation de 5
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });

    it("doit accepter un transfert de l'apprentissage vers le scolaire", async () => {
      const demande = (
        await createDemandeBuilder(adminUser, {
          typeDemande: DemandeTypeEnum["transfert"],
          capaciteScolaireActuelle: 10,
          capaciteApprentissageActuelle: 10,
          capaciteScolaire: 5,
          capaciteApprentissage: 15,
        }).withCurrentCampagneId()
      ).build();

      const response = await submitDemande(app, demande, adminUser);

      expectResponseToBeOk(response.statusCode);
    });
  });
});

function submitDemande(
  app: Server,
  demande: Demande,
  user?: RequestUser
) {
  return app.inject({
    method: "POST",
    url: "/api/demande/submit",
    body: {
      demande,
    },
    cookies: user ? generateAuthCookie(user) : undefined,
  });
}

async function expectChangementDeStatutExisting(
  numero: string,
  statut: DemandeStatutType
) {
  const changementDeStatut = await getKbdClient()
    .selectFrom("changementStatut")
    .where("demandeNumero", "=", numero)
    .where("statut", "=", statut)
    .executeTakeFirst();

  expect(changementDeStatut).toBeDefined();
}

function expectValidationErrorMessageToBe(
  response: IResErrorJson,
  errors: object,
  code = 422
) {
  expect(response.statusCode).toBe(code);
  expect(response.data.errors).toEqual(errors);
}

function expectResponseToBeOk(code: number) {
  expect(code).toBe(200);
}
