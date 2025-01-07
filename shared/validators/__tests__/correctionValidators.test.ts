/* eslint-disable max-len */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { generateMock } from "@anatine/zod-mock";
import { describe, expect,it } from "vitest";

import { RaisonCorrectionEnum } from "../../enum/raisonCorrectionEnum";
import { ROUTES } from "../../routes/routes";
import { correctionValidators } from "../correctionValidators";

describe("shared > validators > correctionValidators", () => {
  const { correction: validCorrection } = generateMock(ROUTES["[POST]/correction/submit"]["schema"].body);

  const { demande: validDemande } = generateMock(ROUTES["[POST]/demande/submit"]["schema"].body);

  it("Doit valider la raison", () => {
    const result = correctionValidators.raison({ ...validCorrection, raison: "" });
    expect(result).toBe("Le champ 'raison' est obligatoire");

    const result2 = correctionValidators.raison({ ...validCorrection, raison: RaisonCorrectionEnum.annulation });
    expect(result2).toBeUndefined();
  });

  it("Doit valider le motif", () => {
    const result = correctionValidators.motif({ ...validCorrection, motif: "" });
    expect(result).toBe("Le champ 'motif' est obligatoire");

    const result2 = correctionValidators.motif({ ...validCorrection, motif: "oui" });
    expect(result2).toBeUndefined();
  });

  it("Doit valider l'autre motif", () => {
    const result = correctionValidators.autreMotif({ ...validCorrection, motif: "autre", autreMotif: "" });
    expect(result).toBe("Le champ 'autre motif' est obligatoire");

    const result2 = correctionValidators.autreMotif({ ...validCorrection, motif: "autre", autreMotif: "test" });
    expect(result2).toBeUndefined();
  });

  it("Doit valider la capacité scolaire", () => {
    const result = correctionValidators.capaciteScolaire({ ...validCorrection, capaciteScolaire: -1 });
    expect(result).toBe("La capacité scolaire doit être un nombre entier positif");

    const result2 = correctionValidators.capaciteScolaire({ ...validCorrection, capaciteScolaire: 1 });
    expect(result2).toBeUndefined();
  });

  it("Doit valider la capacité scolaire colorée", () => {
    const result = correctionValidators.capaciteScolaireColoree({ ...validCorrection, capaciteScolaireColoree: -1 });
    expect(result).toBe("La capacité scolaire colorée doit être un nombre entier positif");

    const result2 = correctionValidators.capaciteScolaireColoree({ ...validCorrection, capaciteScolaireColoree: 1 });
    expect(result2).toBeUndefined();
  });

  it("Doit valider la capacité en apprentissage", () => {
    const result = correctionValidators.capaciteApprentissage({ ...validCorrection, capaciteApprentissage: -1 });
    expect(result).toBe("La capacité en apprentissage doit être un nombre entier positif");

    const result2 = correctionValidators.capaciteApprentissage({ ...validCorrection, capaciteApprentissage: 1 });
    expect(result2).toBeUndefined();
  });

  it("Doit valider la capacité en apprentissage colorée", () => {
    const result = correctionValidators.capaciteApprentissageColoree({ ...validCorrection, capaciteApprentissageColoree: -1 });
    expect(result).toBe("La capacité en apprentissage colorée doit être un nombre entier positif");

    const result2 = correctionValidators.capaciteApprentissageColoree({ ...validCorrection, capaciteApprentissageColoree: 1 });
    expect(result2).toBeUndefined();
  });

  it("Doit valider la somme des capacités", () => {
    const capacitesA2 = {
      capaciteApprentissageColoree: 2,
      capaciteScolaireColoree: 2,
      capaciteApprentissage: 2,
      capaciteScolaire: 2,
    };

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

  it("Doit valider la somme des capacités colorées actuelles", () => {
    const result = correctionValidators.sommeCapaciteColoreeActuelle({
      ...validCorrection,
      capaciteApprentissageColoreeActuelle: 5,
      capaciteScolaireColoreeActuelle: 6,
      capaciteApprentissageActuelle: 5,
      capaciteScolaireActuelle: 5,
    });
    expect(result).toBe("La somme des capacités colorées actuelles doit être inférieure ou égale à la somme des capacités actuelles");

    const result2 = correctionValidators.capaciteApprentissage({
      ...validCorrection,
      capaciteApprentissageColoreeActuelle: 5,
      capaciteScolaireColoreeActuelle: 5,
      capaciteApprentissageActuelle: 5,
      capaciteScolaireActuelle: 5,
    });
    expect(result2).toBeUndefined();
  });

  it("Doit valider la somme des futures capacités colorées", () => {
    const result = correctionValidators.sommeCapaciteColoree({
      ...validCorrection,
      capaciteApprentissageColoree: 5,
      capaciteScolaireColoree: 6,
      capaciteApprentissage: 5,
      capaciteScolaire: 5,
    });
    expect(result).toBe("La somme des futures capacités colorées doit être inférieure ou égale à la somme des futures capacités");

    const result2 = correctionValidators.sommeCapaciteColoree({
      ...validCorrection,
      capaciteApprentissageColoree: 5,
      capaciteScolaireColoree: 5,
      capaciteApprentissage: 5,
      capaciteScolaire: 5,
    });
    expect(result2).toBeUndefined();
  });
});
