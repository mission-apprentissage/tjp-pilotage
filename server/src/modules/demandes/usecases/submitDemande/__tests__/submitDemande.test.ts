import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import {RoleEnum} from 'shared/enum/roleEnum';
import { describe, expect, it, vi } from "vitest";

import { submitDemandeFactory } from "@/modules/demandes/usecases/submitDemande/submitDemande.usecase";

type Deps = Parameters<typeof submitDemandeFactory>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AwaitedResult<V extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<V>>;

const valideDeps = {
  createDemandeQuery: vi.fn(async (data) => Promise.resolve(data)),
  createChangementStatutQuery: vi.fn(async (data) => Promise.resolve(data)),
  findOneDataEtablissementQuery: async () =>
    Promise.resolve({ codeRegion: "75", codeAcademie: "06" } as AwaitedResult<Deps["findOneDataEtablissementQuery"]>),
  findOneDataFormationQuery: async () => Promise.resolve({ cfd: "cfd" } as AwaitedResult<Deps["findOneDataFormationQuery"]>),
  findOneDemandeQuery: async () =>
    Promise.resolve({
      numero: "numero-id",
      codeRegion: "codeRegion",
      createdBy: "user-id",
    } as AwaitedResult<Deps["findOneDemandeQuery"]>),
  findOneCampagneQuery: async () =>
    Promise.resolve({
      id: "campagne-id",
      dateDebut: new Date("2023-01-01"),
      dateFin: new Date(new Date().getFullYear() + 1, 0, 1),
      statut: "en cours",
      annee: "2024"
    } as AwaitedResult<Deps["findOneCampagneQuery"]>),
  findOneSimilarDemandeQuery: async () => Promise.resolve(),
} as Deps;

const demande = {
  id: "demande-id",
  numero: "numero-id",
  uai: "demande-uai",
  cfd: "demande-cfd",
  createdBy: "user-id",
  codeDispositif: "codeDispositif",
  rentreeScolaire: 2025,
  typeDemande: DemandeTypeEnum["augmentation_nette"],
  motif: ["autre"],
  autreMotif: "autre motif",
  poursuitePedagogique: false,
  mixte: true,
  amiCma: false,
  coloration: true,
  libelleColoration1: "libelleColoration1",
  libelleColoration2: "libelleColoration2",
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
  role: RoleEnum["gestionnaire_region"],
  email: "gestionnaire@mail.fr"
} as const;

describe("submitDemande usecase", () => {
  it("should throw an exception if the uai is not found", async () => {
    const deps = {
      ...valideDeps,
      findOneDataEtablissementQuery: async () => Promise.resolve(undefined),
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
      findOneDataFormationQuery: async () => Promise.resolve(undefined),
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
          role: RoleEnum["pilote_region"],
          email: "pilote@mail.fr"
        },
        demande: {
          ...demande,
          mixte: true,
          capaciteApprentissage: undefined,
          statut: DemandeStatutEnum["demande validée"],
        },
      })
    ).rejects.toThrow("Demande soumise sur un établissement non autorisée");
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
        statut: DemandeStatutEnum["proposition"],
        numero: undefined,
      },
    });
    expect(deps.createDemandeQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...demande,
        statut: DemandeStatutEnum["proposition"],
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
