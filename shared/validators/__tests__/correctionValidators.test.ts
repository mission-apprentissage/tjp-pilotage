/* eslint-disable-next-line import/no-extraneous-dependencies */
import { generateMock } from "@anatine/zod-mock";
import { describe, expect,it } from "vitest";

import type { RaisonCorrectionType } from "../../enum/raisonCorrectionEnum";
import { RaisonCorrectionEnum } from "../../enum/raisonCorrectionEnum";
import { ROUTES } from "../../routes/routes";
import { correctionValidators } from "../correctionValidators";

describe("shared > validators > correctionValidators", () => {
  const { correction: validCorrection } = generateMock(ROUTES["[POST]/correction/submit"]["schema"].body);

  const { demande: validDemande } = generateMock(ROUTES["[POST]/demande/submit"]["schema"].body);

  describe("Validation de la raison", () => {
    it("Doit remonter une erreur si le raison n'est pas renseigné", () => {
      const result = correctionValidators.raison({
        ...validCorrection,
        raison: undefined as unknown as RaisonCorrectionType
      });
      expect(result).toBe("Le champ 'raison' est obligatoire");
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.raison({ ...validCorrection, raison: RaisonCorrectionEnum.annulation });
      expect(result).toBeUndefined();
    });
  });

  describe("Validation du motif", () => {
    it("Doit remonter une erreur si le motif n'est pas renseigné", () => {
      const result = correctionValidators.motif({ ...validCorrection, motif: "" });
      expect(result).toBe("Le champ 'motif' est obligatoire");
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.motif({ ...validCorrection, motif: "oui" });
      expect(result).toBeUndefined();
    });
  });

  describe("Validation de l'autre motif", () => {
    it("Doit remonter une erreur si l'autreMotif n'est pas renseigné alors que le motif est 'autre'", () => {
      const result = correctionValidators.autreMotif({ ...validCorrection, motif: "autre", autreMotif: "" });
      expect(result).toBe("Le champ 'autre motif' est obligatoire");
    });

    it("Doit rien remonter si l'autreMotif est renseigné alors que le motif est 'autre'", () => {
      const result = correctionValidators.autreMotif({ ...validCorrection, motif: "autre", autreMotif: "test" });
      expect(result).toBeUndefined();
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.autreMotif({ ...validCorrection, motif: "test" });
      expect(result).toBeUndefined();
    });
  });

  describe("Validation de la capacité scolaire", () => {
    it("Doit remonter une erreur si la capacité scolaire est un nombre négatif", () => {
      const result = correctionValidators.capaciteScolaire({ ...validCorrection, capaciteScolaire: -1 });
      expect(result).toBe("La capacité scolaire doit être un nombre entier positif");
    });

    describe("Dans la cas d'une raison 'report' ou 'annulation'", () => {
      it("Doit remonter une erreur si la capacité scolaire n'est pas égale à la capacité actuelle", () => {
        const invalidCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteScolaire: 1,
          capaciteScolaireActuelle: 2
        };
        expect(
          correctionValidators.capaciteScolaire(invalidCorrectionAnnulation)
        ).toBe("La capacité scolaire doit être égale à la capacité scolaire actuelle dans le cas d'un report ou d'une annulation");

        const invalidCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteScolaire: 1,
          capaciteScolaireActuelle: 2
        };
        expect(
          correctionValidators.capaciteScolaire(invalidCorrectionReport)
        ).toBe("La capacité scolaire doit être égale à la capacité scolaire actuelle dans le cas d'un report ou d'une annulation");
      });

      it("Sinon ne doit pas remonter d'erreur", () => {
        const validCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteScolaire: 2,
          capaciteScolaireActuelle: 2
        };
        expect(
          correctionValidators.capaciteScolaire(validCorrectionAnnulation)
        ).toBeUndefined();

        const validCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteScolaire: 2,
          capaciteScolaireActuelle: 2
        };
        expect(
          correctionValidators.capaciteScolaire(validCorrectionReport)
        ).toBeUndefined();
      });
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.capaciteScolaire({
        ...validCorrection,
        raison: RaisonCorrectionEnum.modification_capacite,
        capaciteScolaire: 1 });
      expect(result).toBeUndefined();
    });
  });

  describe("Validation de la capacité scolaire colorée", () => {
    it("Doit remonter une erreur si la capacité scolaire colorée est un nombre négatif", () => {
      const result = correctionValidators.capaciteScolaireColoree({ ...validCorrection, capaciteScolaireColoree: -1 });
      expect(result).toBe("La capacité scolaire colorée doit être un nombre entier positif");
    });

    describe("Dans la cas d'une raison 'report' ou 'annulation'", () => {
      it("Doit remonter une erreur si la capacité scolaire colorée n'est pas égale à la capacité scolaire colorée actuelle", () => {
        const invalidCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteScolaireColoree: 1
        };
        expect(
          correctionValidators.capaciteScolaireColoree(invalidCorrectionAnnulation)
        ).toBe("La capacité scolaire colorée doit être égale à 0 dans le cas d'un report ou d'une annulation");

        const invalidCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteScolaireColoree: 1
        };
        expect(
          correctionValidators.capaciteScolaireColoree(invalidCorrectionReport)
        ).toBe("La capacité scolaire colorée doit être égale à 0 dans le cas d'un report ou d'une annulation");
      });

      it("Sinon ne doit pas remonter d'erreur", () => {
        const validCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteScolaireColoree: 0
        };
        expect(
          correctionValidators.capaciteScolaireColoree(validCorrectionAnnulation)
        ).toBeUndefined();

        const validCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteScolaireColoree: 0
        };
        expect(
          correctionValidators.capaciteScolaireColoree(validCorrectionReport)
        ).toBeUndefined();
      });
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.capaciteScolaireColoree({
        ...validCorrection,
        raison: RaisonCorrectionEnum.modification_capacite,
        capaciteScolaireColoree: 1
      });
      expect(result).toBeUndefined();
    });
  });

  describe("Validation de la capacité en apprentissage", () => {
    it("Doit remonter une erreur si la capacité en apprentissage est un nombre négatif", () => {
      const result = correctionValidators.capaciteApprentissage({ ...validCorrection, capaciteApprentissage: -1 });
      expect(result).toBe("La capacité en apprentissage doit être un nombre entier positif");
    });

    describe("Dans la cas d'une raison 'report' ou 'annulation'", () => {
      it("Doit remonter une erreur si la capacité en apprentissage n'est pas égale à la capacité actuelle", () => {
        const invalidCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: 2
        };
        expect(
          correctionValidators.capaciteApprentissage(invalidCorrectionAnnulation)
        ).toBe("La capacité en apprentissage doit être égale à la capacité en apprentissage actuelle dans le cas d'un report ou d'une annulation");

        const invalidCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: 2
        };
        expect(
          correctionValidators.capaciteApprentissage(invalidCorrectionReport)
        ).toBe("La capacité en apprentissage doit être égale à la capacité en apprentissage actuelle dans le cas d'un report ou d'une annulation");
      });

      it("Sinon ne doit pas remonter d'erreur", () => {
        const validCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteApprentissage: 2,
          capaciteApprentissageActuelle: 2
        };
        expect(
          correctionValidators.capaciteApprentissage(validCorrectionAnnulation)
        ).toBeUndefined();

        const validCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteApprentissage: 2,
          capaciteApprentissageActuelle: 2
        };
        expect(
          correctionValidators.capaciteApprentissage(validCorrectionReport)
        ).toBeUndefined();
      });
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.capaciteScolaire({
        ...validCorrection,
        raison: RaisonCorrectionEnum.modification_capacite,
        capaciteScolaire: 1
      });
      expect(result).toBeUndefined();
    });
  });


  describe("Validation de la capacité en apprentissage colorée", () => {
    it("Doit remonter une erreur si la capacité en apprentissage colorée est un nombre négatif", () => {
      const result = correctionValidators.capaciteApprentissageColoree({
        ...validCorrection,
        capaciteApprentissageColoree: -1
      });
      expect(result).toBe("La capacité en apprentissage colorée doit être un nombre entier positif");
    });

    describe("Dans la cas d'une raison 'report' ou 'annulation'", () => {
      it("Doit remonter une erreur si la capacité en apprentissage colorée n'est pas égale à la capacité en apprentissage colorée actuelle", () => {
        const invalidCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteApprentissageColoree: 1
        };
        expect(
          correctionValidators.capaciteApprentissageColoree(invalidCorrectionAnnulation)
        ).toBe("La capacité en apprentissage colorée doit être égale à 0 dans le cas d'un report ou d'une annulation");

        const invalidCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteApprentissageColoree: 1
        };
        expect(
          correctionValidators.capaciteApprentissageColoree(invalidCorrectionReport)
        ).toBe("La capacité en apprentissage colorée doit être égale à 0 dans le cas d'un report ou d'une annulation");
      });

      it("Sinon ne doit pas remonter d'erreur", () => {
        const validCorrectionAnnulation = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.annulation,
          capaciteApprentissageColoree: 0
        };
        expect(
          correctionValidators.capaciteApprentissageColoree(validCorrectionAnnulation)
        ).toBeUndefined();

        const validCorrectionReport = {
          ...validCorrection,
          raison: RaisonCorrectionEnum.report,
          capaciteApprentissageColoree: 0
        };
        expect(
          correctionValidators.capaciteApprentissageColoree(validCorrectionReport)
        ).toBeUndefined();
      });
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.capaciteApprentissageColoree({
        ...validCorrection,
        raison: RaisonCorrectionEnum.modification_capacite,
        capaciteApprentissageColoree: 1
      });
      expect(result).toBeUndefined();
    });
  });

  describe("Validation de la somme des capacités", () => {
    const capacitesA2 = {
      capaciteApprentissageColoree: 2,
      capaciteScolaireColoree: 2,
      capaciteApprentissage: 2,
      capaciteScolaire: 2,
    };

    describe("Pour une raison 'modification capacité'", () => {
      it("Doit remonter une erreur si les capacités corrigées sont identiques aux capacités actuelles", () => {
        const capaciteIdentiques = correctionValidators.sommeCapacite(
          {
            ...validCorrection,
            ...capacitesA2,
            raison: RaisonCorrectionEnum.modification_capacite
          },
          {
            ...validDemande,
            ...capacitesA2,
          }
        );
        expect(capaciteIdentiques).toBe("Les capacités corrigées doivent être différentes des capacités avant correction dans le cas d'une modification de capacité");
      });

      it("Ne doit pas remonter d'erreur si les capacités en apprentissage colorées ne sont pas identiques", () => {
        const capaciteApprentissageColoreesDiff = correctionValidators.sommeCapacite(
          {
            ...validCorrection,
            ...capacitesA2,
            capaciteApprentissageColoree: 1,
            raison: RaisonCorrectionEnum.modification_capacite
          },
          {
            ...validDemande,
            ...capacitesA2,
          }
        );
        expect(capaciteApprentissageColoreesDiff).toBeUndefined();
      });

      it("Ne doit pas remonter d'erreur si les capacités scolaires colorées ne sont pas identiques", () => {
        const capacitesScolaireDiff = correctionValidators.sommeCapacite(
          {
            ...validCorrection,
            ...capacitesA2,
            capaciteScolaireColoree: 1,
            raison: RaisonCorrectionEnum.modification_capacite
          },
          {
            ...validDemande,
            ...capacitesA2,
          }
        );
        expect(capacitesScolaireDiff).toBeUndefined();
      });

      it("Ne doit pas remonter d'erreur si les capacités en apprentissage ne sont pas identiques", () => {
        const capaciteApprentissageDiff = correctionValidators.sommeCapacite(
          {
            ...validCorrection,
            ...capacitesA2,
            capaciteApprentissage: 1,
            raison: RaisonCorrectionEnum.modification_capacite
          },
          {
            ...validDemande,
            ...capacitesA2
          }
        );
        expect(capaciteApprentissageDiff).toBeUndefined();
      });

      it("Ne doit pas remonter d'erreur si les capacités scolaires ne sont pas identiques", () => {
        const capaciteScolaireDiff = correctionValidators.sommeCapacite(
          {
            ...validCorrection,
            ...capacitesA2,
            capaciteScolaire: 1,
            raison: RaisonCorrectionEnum.modification_capacite
          },
          {
            ...validDemande,
            ...capacitesA2
          }
        );
        expect(capaciteScolaireDiff).toBeUndefined();
      });
    });

    it("Ne doit pas remonter d'erreur si la raison n'est pas une modification capacité", () => {
      const raisonDiff = correctionValidators.sommeCapacite(
        {
          ...validCorrection,
          ...capacitesA2,
          raison: RaisonCorrectionEnum.annulation
        },
        {
          ...validDemande,
          ...capacitesA2,
        }
      );
      expect(raisonDiff).toBeUndefined();
    });
  });

  describe("Validation de la somme des capacités colorées actuelles", () => {
    it("Doit remonter une errreur si la somme des capacités colorées actuelles est supérieure à celle des capacités actuelles", () => {
      const result = correctionValidators.sommeCapaciteColoreeActuelle({
        ...validCorrection,
        capaciteApprentissageColoreeActuelle: 5,
        capaciteScolaireColoreeActuelle: 6,
        capaciteApprentissageActuelle: 5,
        capaciteScolaireActuelle: 5,
      });
      expect(result).toBe("La somme des capacités colorées actuelles doit être inférieure ou égale à la somme des capacités actuelles");
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.sommeCapaciteColoreeActuelle({
        ...validCorrection,
        capaciteApprentissageColoreeActuelle: 5,
        capaciteScolaireColoreeActuelle: 5,
        capaciteApprentissageActuelle: 5,
        capaciteScolaireActuelle: 5,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteApprentissageColoreeActuelle' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoreeActuelle({
        ...validCorrection,
        capaciteApprentissageColoreeActuelle: -1,
        capaciteScolaireColoreeActuelle: 5,
        capaciteApprentissageActuelle: 0,
        capaciteScolaireActuelle: 0,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteScolaireColoreeActuelle' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoreeActuelle({
        ...validCorrection,
        capaciteApprentissageColoreeActuelle: 5,
        capaciteScolaireColoreeActuelle: -1,
        capaciteApprentissageActuelle: 5,
        capaciteScolaireActuelle: 5,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteApprentissageActuelle' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoreeActuelle({
        ...validCorrection,
        capaciteApprentissageColoreeActuelle: 5,
        capaciteScolaireColoreeActuelle: 5,
        capaciteApprentissageActuelle: -1,
        capaciteScolaireActuelle: 5,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteApprentissageActuelle' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoreeActuelle({
        ...validCorrection,
        capaciteApprentissageColoreeActuelle: 5,
        capaciteScolaireColoreeActuelle: 5,
        capaciteApprentissageActuelle: 5,
        capaciteScolaireActuelle: -1,
      });
      expect(result).toBeUndefined();
    });
  });


  describe("Validation de la somme des capacités colorées", () => {
    it("Doit remonter une errreur si la somme des capacités colorées est supérieure à celle des capacités", () => {
      const result = correctionValidators.sommeCapaciteColoree({
        ...validCorrection,
        capaciteApprentissageColoree: 5,
        capaciteScolaireColoree: 6,
        capaciteApprentissage: 5,
        capaciteScolaire: 5,
      });
      expect(result).toBe("La somme des futures capacités colorées doit être inférieure ou égale à la somme des futures capacités");
    });

    it("Sinon ne doit pas remonter d'erreur", () => {
      const result = correctionValidators.sommeCapaciteColoree({
        ...validCorrection,
        capaciteApprentissageColoree: 5,
        capaciteScolaireColoree: 5,
        capaciteApprentissage: 5,
        capaciteScolaire: 5,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteApprentissageColoree' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoree({
        ...validCorrection,
        capaciteApprentissageColoree: -1,
        capaciteScolaireColoree: 5,
        capaciteApprentissage: 0,
        capaciteScolaire: 0,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteScolaireColoree' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoree({
        ...validCorrection,
        capaciteApprentissageColoree: 5,
        capaciteScolaireColoree: -1,
        capaciteApprentissage: 5,
        capaciteScolaire: 5,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteApprentissage' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoree({
        ...validCorrection,
        capaciteApprentissageColoree: 5,
        capaciteScolaireColoree: 5,
        capaciteApprentissage: -1,
        capaciteScolaire: 5,
      });
      expect(result).toBeUndefined();
    });

    it("Ne doit pas remonter une erreur si la 'capaciteApprentissage' est négative", () => {
      const result = correctionValidators.sommeCapaciteColoree({
        ...validCorrection,
        capaciteApprentissageColoree: 5,
        capaciteScolaireColoree: 5,
        capaciteApprentissage: 5,
        capaciteScolaire: -1,
      });
      expect(result).toBeUndefined();
    });
  });
});
