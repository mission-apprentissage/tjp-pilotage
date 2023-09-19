import { submitDemandeFactory } from "./submitDemande.usecase";

type Deps = Parameters<typeof submitDemandeFactory>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AwaitedResult<V extends (...args: any[]) => Promise<any>> = Awaited<
  ReturnType<V>
>;

const valideDeps = {
  createDemandeQuery: jest.fn(() => Promise.resolve()),
  findOneDataEtablissement: () =>
    Promise.resolve({ codeRegion: "75" } as AwaitedResult<
      Deps["findOneDataEtablissement"]
    >),
  findOneDataFormation: async () =>
    Promise.resolve({ cfd: "cfd" } as AwaitedResult<
      Deps["findOneDataFormation"]
    >),
};

const demande = {
  id: "demande-id",
  uai: "demande-uai",
  cfd: "demande-cfd",
  dispositifId: "dispositifId",
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
};

const gestionnaire = {
  codeRegion: "75",
  id: "user-id",
  role: "gestionnaire",
} as const;

describe("submitDemande usecase", () => {
  it("should throw an exception if the uai is not found", async () => {
    const deps = {
      ...valideDeps,
      findOneDataEtablissement: () => Promise.resolve(undefined),
    };

    const submitDemande = submitDemandeFactory(deps);

    await expect(() =>
      submitDemande({ user: gestionnaire, demande: demande })
    ).rejects.toThrowError("Code uai non valide");
  });

  it("should throw an exception if the cfd is not found", async () => {
    const submitDemande = submitDemandeFactory({
      ...valideDeps,
      findOneDataFormation: () => Promise.resolve(undefined),
    });

    await expect(() =>
      submitDemande({ user: gestionnaire, demande: demande })
    ).rejects.toThrowError("Code diplome non valide");
  });

  it("should throw an exception if 'motifs' is empty", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({ user: gestionnaire, demande: { ...demande, motif: [] } })
    ).rejects.toThrowError("motifs manquant");
  });

  it("should throw an exception if 'autre_motif' is missing while 'motifs' includes 'autre_motif'", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: { ...demande, motif: ["autre_motif"], autreMotif: "" },
      })
    ).rejects.toThrowError("autreMotif manquant");
  });

  it("should throw an exception if 'libelleColoration' is missing while 'coloration' is true", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: { ...demande, coloration: true, libelleColoration: "" },
      })
    ).rejects.toThrowError("libelleColoration manquant");
  });

  it("should throw an exception if 'capactiteScolaireColoree' and 'capactiteApprentissageColoree' is missing while 'coloration' is true", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          coloration: true,
          capaciteApprentissageColoree: 0,
          capaciteScolaireColoree: 0,
        },
      })
    ).rejects.toThrowError("Capacité colorée manquante");
  });

  it("should throw an exception if 'capactiteApprentissage' is set while 'mixte' is false", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          mixte: true,
          capaciteApprentissage: undefined,
        },
      })
    ).rejects.toThrowError("Capacité apprentissage manquante");
  });

  it("should throw an exception if 'capactiteApprentissage' is missing while 'mixte' is true", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: gestionnaire,
        demande: {
          ...demande,
          mixte: true,
          capaciteApprentissage: undefined,
        },
      })
    ).rejects.toThrowError("Capacité apprentissage manquante");
  });

  it("should throw an exception if the user's codeRegion is different from the etablissement's codeRegion", async () => {
    const submitDemande = submitDemandeFactory(valideDeps);

    await expect(() =>
      submitDemande({
        user: { ...gestionnaire, codeRegion: "other" },
        demande: {
          ...demande,
          mixte: true,
          capaciteApprentissage: undefined,
        },
      })
    ).rejects.toThrowError("Forbidden");
  });

  it("should create the demande if data is valid", async () => {
    const deps = {
      createDemandeQuery: jest.fn(() => Promise.resolve()),
      findOneDataEtablissement: jest.fn(() =>
        Promise.resolve({ codeRegion: "75" } as AwaitedResult<
          Deps["findOneDataEtablissement"]
        >)
      ),
      findOneDataFormation: async () =>
        Promise.resolve({ cfd: "cfd" } as AwaitedResult<
          Deps["findOneDataFormation"]
        >),
    };

    const submitDemande = submitDemandeFactory(
      deps as Parameters<typeof submitDemandeFactory>[0]
    );

    await submitDemande({
      user: gestionnaire,
      demande: demande,
    });
    await expect(deps.createDemandeQuery).toBeCalledWith({
      demande: expect.objectContaining({
        ...demande,
        codeRegion: "75",
        createurId: "user-id",
      }),
    });
  });
});
