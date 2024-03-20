import { submitDemandeFactory } from "./submitDemande.usecase";

type Deps = Parameters<typeof submitDemandeFactory>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AwaitedResult<V extends (...args: any[]) => Promise<any>> = Awaited<
  ReturnType<V>
>;

const valideDeps = {
  createDemandeQuery: jest.fn((data) => Promise.resolve(data)),
  findOneDataEtablissement: () =>
    Promise.resolve({ codeRegion: "75", codeAcademie: "06" } as AwaitedResult<
      Deps["findOneDataEtablissement"]
    >),
  findOneDataFormation: async () =>
    Promise.resolve({ cfd: "cfd" } as AwaitedResult<
      Deps["findOneDataFormation"]
    >),
  findOneDemande: async () =>
    Promise.resolve({
      id: "demande-id",
      codeRegion: "codeRegion",
      createurId: "user-id",
    } as AwaitedResult<Deps["findOneDemande"]>),
  findOneSimilarDemande: () => Promise.resolve(),
} as Deps;

const demande = {
  id: "demande-id",
  uai: "demande-uai",
  cfd: "demande-cfd",
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
  commentaire: "mon commentaire",
  motifRefus: undefined,
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

    const submitDemande = submitDemandeFactory(deps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          statut: "submitted",
        },
      })
    ).rejects.toThrowError("Code uai non valide");
  });

  it("should throw an exception if the cfd is not found", async () => {
    const submitDemande = submitDemandeFactory({
      ...valideDeps,
      findOneDataFormation: () => Promise.resolve(undefined),
    });

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          statut: "submitted",
        },
      })
    ).rejects.toThrowError("Code diplome non valide");
  });

  it("should throw an exception if the user tries to refuse without specifying motifRefus", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          statut: "refused",
          motifRefus: undefined,
        },
      })
    ).rejects.toThrowError("Donnée incorrectes");
  });

  it("should throw an exception if the user has right in his region but codeRegion is different from the etablissement's codeRegion", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: {
          codeRegion: "other",
          id: "user-id",
          role: "pilote_region",
        },
        demande: {
          ...demande,
          mixte: true,
          capaciteApprentissage: undefined,
          statut: "submitted",
        },
      })
    ).rejects.toThrowError("Forbidden");
  });

  it("should create a new demande if data is valid and sent demand does not contain an id", async () => {
    const deps = {
      ...valideDeps,
      findOneDemande: () => Promise.resolve(undefined),
      createDemandeQuery: jest.fn((data) => Promise.resolve(data)),
    };

    const submitDemande = submitDemandeFactory(deps);

    await submitDemande({
      user: gestionnaire,
      demande: {
        ...demande,
        statut: "draft",
        id: undefined,
      },
    });
    expect(deps.createDemandeQuery).toBeCalledWith(
      expect.objectContaining({
        ...demande,
        codeRegion: "75",
        codeAcademie: "06",
        createurId: "user-id",
        statut: "draft",
        id: expect.stringMatching(".+"),
      })
    );
  });

  it("should update a demande if data is valid and sent demand contains an id", async () => {
    const deps = {
      ...valideDeps,
      createDemandeQuery: jest.fn((data) => Promise.resolve(data)),
    };

    const submitDemande = submitDemandeFactory(deps);

    await submitDemande({
      user: gestionnaire,
      demande: {
        ...demande,
        statut: "submitted",
      },
    });
    expect(deps.createDemandeQuery).toBeCalledWith(
      expect.objectContaining({
        ...demande,
        codeRegion: "75",
        codeAcademie: "06",
        createurId: "user-id",
        statut: "submitted",
      })
    );
  });
});
