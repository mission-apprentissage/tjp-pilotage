import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { submitDemandeExpeFactory } from "./submitDemandeExpe.usecase";

type Deps = Parameters<typeof submitDemandeExpeFactory>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AwaitedResult<V extends (...args: any[]) => Promise<any>> = Awaited<
  ReturnType<V>
>;

const valideDeps = {
  createDemandeExpeQuery: jest.fn((data) => Promise.resolve(data)),
  findOneDataEtablissement: () =>
    Promise.resolve({ codeRegion: "75", codeAcademie: "06" } as AwaitedResult<
      Deps["findOneDataEtablissement"]
    >),
  findOneDataFormation: async () =>
    Promise.resolve({ cfd: "cfd" } as AwaitedResult<
      Deps["findOneDataFormation"]
    >),
  findOneDemandeExpe: async () =>
    Promise.resolve({
      numero: "numero-id",
      codeRegion: "codeRegion",
      createurId: "user-id",
    } as AwaitedResult<Deps["findOneDemandeExpe"]>),
  findOneSimilarDemandeExpe: () => Promise.resolve(),
} as Deps;

const demandeExpe = {
  id: "demandeExpe-id",
  numero: "numero-id",
  uai: "demandeExpe-uai",
  cfd: "demandeExpe-cfd",
  createurId: "user-id",
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
  nbRecrutementRH: z.coerce.number().optional(),
  discipline1RecrutementRH: z.string().optional(),
  discipline2RecrutementRH: z.string().optional(),
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
      findOneDataEtablissement: () => Promise.resolve(undefined),
    };

    const submitDemande = submitDemandeExpeFactory(deps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demandeExpe: {
          ...demandeExpe,
          statut: DemandeStatutEnum.submitted,
        },
      })
    ).rejects.toThrow("Code uai non valide");
  });

  it("should throw an exception if the cfd is not found", async () => {
    const submitDemande = submitDemandeExpeFactory({
      ...valideDeps,
      findOneDataFormation: () => Promise.resolve(undefined),
    });

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demandeExpe: {
          ...demandeExpe,
          statut: DemandeStatutEnum.submitted,
        },
      })
    ).rejects.toThrow("Code diplome non valide");
  });

  it("should throw an exception if the user tries to refuse without specifying motifRefus", async () => {
    const submitDemande = submitDemandeExpeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demandeExpe: {
          ...demandeExpe,
          statut: DemandeStatutEnum.refused,
          motifRefus: undefined,
        },
      })
    ).rejects.toThrow("Donnée incorrectes");
  });

  it("should throw an exception if the user has right in his region but codeRegion is different from the etablissement's codeRegion", async () => {
    const submitDemande = submitDemandeExpeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: {
          codeRegion: "other",
          id: "user-id",
          role: "pilote_region",
        },
        demandeExpe: {
          ...demandeExpe,
          mixte: true,
          capaciteApprentissage: undefined,
          statut: DemandeStatutEnum.submitted,
        },
      })
    ).rejects.toThrow("Forbidden");
  });

  it("should create a new demandeExpe if data is valid and sent demand does not contain a numero", async () => {
    const deps = {
      ...valideDeps,
      createDemandeExpeQuery: jest.fn((data) => Promise.resolve(data)),
    };

    const submitDemande = submitDemandeExpeFactory(deps);

    await submitDemande({
      user: gestionnaire,
      demandeExpe: {
        ...demandeExpe,
        statut: DemandeStatutEnum.draft,
        numero: undefined,
      },
    });
    expect(deps.createDemandeExpeQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...demandeExpe,
        statut: DemandeStatutEnum.draft,
        id: expect.stringMatching(".+"),
        numero: expect.stringMatching(".+"),
        updatedAt: expect.any(Date),
      })
    );
  });

  it("should update a demandeExpe if data is valid and sent demand contains a numero", async () => {
    const deps = {
      ...valideDeps,
      createDemandeExpeQuery: jest.fn((data) => Promise.resolve(data)),
    };

    const submitDemande = submitDemandeExpeFactory(deps);

    await submitDemande({
      user: gestionnaire,
      demandeExpe: {
        ...demandeExpe,
        statut: DemandeStatutEnum.submitted,
        numero: "numero-id",
      },
    });
    expect(deps.createDemandeExpeQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...demandeExpe,
        statut: DemandeStatutEnum.submitted,
        numero: "numero-id",
        id: expect.stringMatching(".+"),
        updatedAt: expect.any(Date),
      })
    );
  });
});
