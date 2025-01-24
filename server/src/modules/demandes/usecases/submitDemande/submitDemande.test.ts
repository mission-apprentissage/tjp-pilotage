import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { describe, expect, it, vi } from "vitest";

import { submitDemandeFactory } from "./submitDemande.usecase";

type Deps = Parameters<typeof submitDemandeFactory>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AwaitedResult<V extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<V>>;

const valideDeps = {
  createDemandeQuery: vi.fn(async (data) => Promise.resolve(data)),
  findOneDataEtablissement: async () =>
    Promise.resolve({ codeRegion: "75", codeAcademie: "06" } as AwaitedResult<Deps["findOneDataEtablissement"]>),
  findOneDataFormation: async () => Promise.resolve({ cfd: "cfd" } as AwaitedResult<Deps["findOneDataFormation"]>),
  findOneDemandeQuery: async () =>
    Promise.resolve({
      numero: "numero-id",
      codeRegion: "codeRegion",
      createdBy: "user-id",
    } as AwaitedResult<Deps["findOneDemandeQuery"]>),
  findOneSimilarDemande: async () => Promise.resolve(),
} as Deps;

const demande = {
  id: "demande-id",
  numero: "numero-id",
  uai: "demande-uai",
  cfd: "demande-cfd",
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
  commentaire: "mon commentaire",
  motifRefus: undefined,
  campagneId: "campagne-id",
};

const gestionnaire = {
  codeRegion: "75",
  id: "user-id",
  role: "gestionnaire_region",
  email: "gestionnaire@mail.fr"
} as const;

describe("submitDemande usecase", () => {
  it("should throw an exception if the uai is not found", async () => {
    const deps = {
      ...valideDeps,
      findOneDataEtablissement: async () => Promise.resolve(undefined),
    };

    const submitDemande = submitDemandeFactory(deps);

    await expect(async () =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          statut: DemandeStatutEnum["demande validée"],
        },
      })
    ).rejects.toThrow("Code uai non valide");
  });

  it("should throw an exception if the cfd is not found", async () => {
    const submitDemande = submitDemandeFactory({
      ...valideDeps,
      findOneDataFormation: async () => Promise.resolve(undefined),
    });

    await expect(async () =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          statut: DemandeStatutEnum["demande validée"],
        },
      })
    ).rejects.toThrow("CFD non valide");
  });

  it("should throw an exception if the user tries to refuse without specifying motifRefus", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(async () =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          statut: DemandeStatutEnum["refusée"],
          motifRefus: undefined,
        },
      })
    ).rejects.toThrow("Donnée incorrectes");
  });

  it("should throw an exception if the user has right in his region but codeRegion is different from the etablissement's codeRegion", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(async () =>
      submitDemande({
        user: {
          codeRegion: "other",
          id: "user-id",
          role: "pilote_region",
          email: "pilote@mail.fr"
        },
        demande: {
          ...demande,
          mixte: true,
          capaciteApprentissage: undefined,
          statut: DemandeStatutEnum["demande validée"],
        },
      })
    ).rejects.toThrow("Forbidden");
  });

  it("should create a new demande if data is valid and sent demand does not contain a numero", async () => {
    const deps = {
      ...valideDeps,
      createDemandeQuery: vi.fn(async (data) => Promise.resolve(data)),
    };

    const submitDemande = submitDemandeFactory(deps);

    await submitDemande({
      user: gestionnaire,
      demande: {
        ...demande,
        statut: DemandeStatutEnum["projet de demande"],
        numero: undefined,
      },
    });
    expect(deps.createDemandeQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...demande,
        statut: DemandeStatutEnum["projet de demande"],
        id: expect.stringMatching(".+"),
        numero: expect.stringMatching(".+"),
        updatedAt: expect.any(Date),
      })
    );
  });

  it("should update a demande if data is valid and sent demand contains a numero", async () => {
    const deps = {
      ...valideDeps,
      createDemandeQuery: vi.fn(async (data) => Promise.resolve(data)),
    };

    const submitDemande = submitDemandeFactory(deps);

    await submitDemande({
      user: gestionnaire,
      demande: {
        ...demande,
        statut: DemandeStatutEnum["demande validée"],
        numero: "numero-id",
      },
    });
    expect(deps.createDemandeQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...demande,
        statut: DemandeStatutEnum["demande validée"],
        numero: "numero-id",
        id: expect.stringMatching(".+"),
        updatedAt: expect.any(Date),
      })
    );
  });
});
