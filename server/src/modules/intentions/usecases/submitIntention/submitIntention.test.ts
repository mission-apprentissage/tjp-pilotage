import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { describe, expect, it, vi } from "vitest";

import { submitIntentionFactory } from "./submitIntention.usecase";

type Deps = Parameters<typeof submitIntentionFactory>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AwaitedResult<V extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<V>>;

const valideDeps = {
  createIntentionQuery: vi.fn(async (data) => Promise.resolve(data)),
  createChangementStatutQuery: vi.fn(async (data) => Promise.resolve(data)),
  findOneDataEtablissement: async () =>
    Promise.resolve({ codeRegion: "75", codeAcademie: "06" } as AwaitedResult<Deps["findOneDataEtablissement"]>),
  findOneDataFormation: async () => Promise.resolve({ cfd: "cfd" } as AwaitedResult<Deps["findOneDataFormation"]>),
  findOneIntention: async () =>
    Promise.resolve({
      numero: "numero-id",
      codeRegion: "codeRegion",
      createdBy: "user-id",
    } as AwaitedResult<Deps["findOneIntention"]>),
  findOneSimilarIntention: async () => Promise.resolve(),
} as Deps;

const intention = {
  id: "intention-id",
  numero: "numero-id",
  uai: "intention-uai",
  cfd: "intention-cfd",
  createdBy: "user-id",
  codeDispositif: "codeDispositif",
  rentreeScolaire: 2025,
  typeDemande: "augmentation",
  motif: ["autre"],
  autreMotif: "autre motif",
  poursuitePedagogique: false,
  mixte: true,
  amiCma: false,
  coloration: true,
  libelleColoration: "libelleColoration",
  capaciteScolaire: 10,
  capaciteScolaireActuelle: 6,
  capaciteScolaireColoree: 1,
  capaciteApprentissage: 20,
  capaciteApprentissageActuelle: 15,
  capaciteApprentissageColoree: 2,
  //RH
  recrutementRH: false,
  nbRecrutementRH: 1,
  discipline1RecrutementRH: "discipline1RecrutementRH",
  discipline2RecrutementRH: "discipline2RecrutementRH",
  reconversionRH: false,
  professeurAssocieRH: false,
  formationRH: false,
  // Travaux et équipements
  travauxAmenagement: false,
  achatEquipement: false,
  // Internat et restauration
  augmentationCapaciteAccueilHebergement: false,
  augmentationCapaciteAccueilRestauration: false,
  commentaire: "mon commentaire",
  motifRefus: undefined,
  campagneId: "campagne-id",
};

const gestionnaire = {
  codeRegion: "75",
  id: "user-id",
  role: "gestionnaire_region",
} as const;

describe("submitDemande usecase", () => {
  it("should throw an exception if the uai is not found", async () => {
    const deps = {
      ...valideDeps,
      findOneDataEtablissement: async () => Promise.resolve(undefined),
    };

    const submitDemande = submitIntentionFactory(deps);

    await expect(async () =>
      submitDemande({
        user: gestionnaire,
        intention: {
          ...intention,
          statut: DemandeStatutEnum["demande validée"],
        },
      }),
    ).rejects.toThrow("Code uai non valide");
  });

  it("should throw an exception if the cfd is not found", async () => {
    const submitDemande = submitIntentionFactory({
      ...valideDeps,
      findOneDataFormation: async () => Promise.resolve(undefined),
    });

    await expect(async () =>
      submitDemande({
        user: gestionnaire,
        intention: {
          ...intention,
          statut: DemandeStatutEnum["demande validée"],
        },
      }),
    ).rejects.toThrow("Code diplome non valide");
  });

  it("should throw an exception if the user tries to refuse without specifying motifRefus", async () => {
    const submitDemande = submitIntentionFactory(valideDeps);

    await expect(async () =>
      submitDemande({
        user: gestionnaire,
        intention: {
          ...intention,
          statut: DemandeStatutEnum["refusée"],
          motifRefus: undefined,
        },
      }),
    ).rejects.toThrow("Donnée incorrectes");
  });

  it("should throw an exception if the user has right in his region but codeRegion is different from the etablissement's codeRegion", async () => {
    const submitDemande = submitIntentionFactory(valideDeps);

    await expect(async () =>
      submitDemande({
        user: {
          codeRegion: "other",
          id: "user-id",
          role: "pilote_region",
        },
        intention: {
          ...intention,
          mixte: true,
          capaciteApprentissage: undefined,
          statut: DemandeStatutEnum["demande validée"],
        },
      }),
    ).rejects.toThrow("Forbidden");
  });

  it("should create a new intention if data is valid and sent demand does not contain a numero", async () => {
    const deps = {
      ...valideDeps,
      createIntentionQuery: vi.fn(async (data) => Promise.resolve(data)),
    };

    const submitDemande = submitIntentionFactory(deps);

    await submitDemande({
      user: gestionnaire,
      intention: {
        ...intention,
        statut: DemandeStatutEnum["proposition"],
        numero: undefined,
      },
    });
    expect(deps.createIntentionQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...intention,
        statut: DemandeStatutEnum["proposition"],
        id: expect.stringMatching(".+"),
        numero: expect.stringMatching(".+"),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it("should update a intention if data is valid and sent demand contains a numero", async () => {
    const deps = {
      ...valideDeps,
      createIntentionQuery: vi.fn(async (data) => Promise.resolve(data)),
    };

    const submitDemande = submitIntentionFactory(deps);

    await submitDemande({
      user: gestionnaire,
      intention: {
        ...intention,
        statut: DemandeStatutEnum["demande validée"],
        numero: "numero-id",
      },
    });
    expect(deps.createIntentionQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...intention,
        statut: DemandeStatutEnum["demande validée"],
        numero: "numero-id",
        id: expect.stringMatching(".+"),
        updatedAt: expect.any(Date),
      }),
    );
  });
});
