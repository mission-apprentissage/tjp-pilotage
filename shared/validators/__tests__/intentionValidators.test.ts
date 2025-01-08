/* eslint-disable-next-line import/no-extraneous-dependencies */
import { generateMock } from "@anatine/zod-mock";
import { describe, expect,it } from "vitest";

import { DemandeStatutEnum } from "../../enum/demandeStatutEnum";
import { ROUTES } from "../../routes/routes";
import { intentionValidators } from "../intentionValidators";

const { intention } = generateMock(ROUTES["[POST]/intention/submit"]["schema"].body);
type Intention = typeof intention;

describe("shared > validators > intentionValidators", () => {
  const createIntention = (overrides: Partial<Intention>) => ({
    ...intention,
    ...overrides,
  });

  describe("Validation du 'motif'", () => {
    it("Doit remonter une erreur si le 'motif' n'est pas renseigné", () => {
      const intention = createIntention({ typeDemande: "augmentation_nette", motif: [] });
      expect(intentionValidators.motif(intention)).toBe("Le champ 'motif' est obligatoire");
    });

    it("Ne doit pas remonter d'erreur si le 'motif' est renseigné", () => {
      const intentionWithMotif = createIntention({ typeDemande: "augmentation_nette", motif: ["test"] });
      expect(intentionValidators.motif(intentionWithMotif)).toBeUndefined();
    });
  });

  describe("Validation du 'autreMotif'", () => {
    describe("Si le motif est 'autre'", () => {
      it("Doit remonter une erreur si le 'autreMotif' n'est pas renseigné", () => {
        const intention = createIntention({ motif: ["autre"], autreMotif: "" });
        expect(intentionValidators.autreMotif(intention)).toBe("Le champ 'autre motif' est obligatoire");

      });

      it("Ne doit pas remonter d'erreur si 'autreMotif' est renseigné", () => {
        const intentionWithoutAutreMotif = createIntention({ motif: ["autre"], autreMotif: "test" });
        expect(
          intentionValidators.autreMotif(intentionWithoutAutreMotif)
        ).toBeUndefined();
      });
    });

    describe("Si le motif n'est pas autre", () => {
      it("Ne doit pas remonter d'erreur si 'autreMotif' est renseigné", () => {
        const intentionWithoutAutreMotif = createIntention({ motif: ["autre"], autreMotif: "test" });
        expect(
          intentionValidators.autreMotif(intentionWithoutAutreMotif)
        ).toBeUndefined();
      });

      it("Ne doit pas remonter d'erreur si 'autreMotif' n'est pas renseigné", () => {
        const intentionWithoutAutreMotif = createIntention({ motif: ["augmentation_nette"] });
        expect(
          intentionValidators.autreMotif(intentionWithoutAutreMotif)
        ).toBeUndefined();
      });
    });
  });

  describe("Validation du 'libelleColoration'", () => {
    describe("Si la 'coloration' a true", () => {
      it("Doit remonter une erreur si le 'libelleColoration' n'est pas renseigné", () => {
        const intention = createIntention({ coloration: true, libelleColoration: undefined });
        expect(intentionValidators.libelleColoration(intention)).toBe("Le champ 'libellé coloration' est obligatoire");
      });

      it("Ne doit pas remonter d'erreur si le 'libelleColoration' est renseigné", () => {
        const intentionWithLibelleColoration = createIntention({ coloration: true, libelleColoration: "test" });
        expect(
          intentionValidators.libelleColoration(intentionWithLibelleColoration)
        ).toBeUndefined();
      });
    });

    describe("Si la 'coloration' à false", () => {
      it("Doit remonter une erreur si le 'libelleColoration' est renseigné", () => {
        const intention = createIntention({ coloration: false, libelleColoration: "test" });
        expect(intentionValidators.libelleColoration(intention)).toBe("Le champ 'libellé coloration' doit être vide");
      });

      it("Ne doit pas remonter d'erreur si le 'libelleColoration' n'est pas renseigné", () => {
        const intention = createIntention({ coloration: false, libelleColoration: undefined });
        expect(intentionValidators.libelleColoration(intention)).toBeUndefined();
      });
    });
  });

  describe("Validation du 'capaciteScolaireActuelle'", () => {
    it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est négative", () => {
      const intention = createIntention({ capaciteScolaireActuelle: -1 });
      const result = intentionValidators.capaciteScolaireActuelle(intention);
      expect(result).toBe("La capacité scolaire actuelle doit être un nombre entier positif");
    });

    it("Ne doit pas remonter d'erreur si la 'capaciteScolaireActuelle' est un nombre entier positif", () => {
      const intention = createIntention({ typeDemande: 'fermeture', capaciteScolaireActuelle: 1 });
      const result = intentionValidators.capaciteScolaireActuelle(intention);
      expect(result).toBeUndefined();
    });

    describe("Si le 'typeDemande' est 'ouverture_nette' ou 'ouverture_compensation'", () => {
      describe.each`
      typeDemande                 | text
      ${'ouverture_nette'}        | ${'ouverture_nette'}
      ${'ouverture_compensation'} | ${'ouverture_compensation'}
        `(`Pour $text`, ({ typeDemande }) => {
        it("Doit remonter une erreur si la 'capaciteScolaireActuelle' différent de 0", () => {
          const intention = createIntention({ typeDemande, capaciteScolaireActuelle: 1 });
          const result = intentionValidators.capaciteScolaireActuelle(intention);
          expect(result).toBe("La capacité scolaire actuelle devrait être à 0 dans le cas d'une ouverture");
        });

        it("Ne doit pas remonter d'erreur si la 'capaciteScolaireActuelle' est à 0", () => {
          const intention = createIntention({ typeDemande, capaciteScolaireActuelle: 0 });
          const result = intentionValidators.capaciteScolaireActuelle(intention);
          expect(result).toBeUndefined();
        });
      });
    });
  });

  describe("Validation de la 'capaciteScolaire'", () => {
    it("Doit remonter une erreur si la 'capaciteScolaire' est négative", () => {
      const intention = createIntention({ capaciteScolaire: -1 });
      const result = intentionValidators.capaciteScolaire(intention);
      expect(result).toBe("La capacité scolaire doit être un nombre entier positif");
    });

    describe("Si 'typeDemande' est 'fermeture'", () => {
      it("Doit remonter une erreur si 'capaciteScolaire' est différent de 0", () => {
        const intention = createIntention({ typeDemande: "fermeture", capaciteScolaire: 1 });
        const result = intentionValidators.capaciteScolaire(intention);
        expect(result).toBe("La capacité scolaire devrait être à 0 dans le cas d'une fermeture");
      });
    });

    describe("Si 'typeDemande' est 'augmentation_compensation' ou 'augmentation_nette'", () => {
      describe.each`
      typeDemande                 | text
      ${'augmentation_compensation'} | ${'augmentation_compensation'}
      ${'augmentation_nette'}        | ${'augmentation_nette'}
        `(`Pour $text`, ({ typeDemande }) => {
        it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est supérieure à la 'capaciteScolaire'", () => {
          const intention = createIntention({ typeDemande, capaciteScolaire: 1, capaciteScolaireActuelle: 2 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation");
        });
        it("Ne doit pas remonter d'erreur si la 'capaciteScolaire' est un nombre entier positif", () => {
          const intention = createIntention({ typeDemande, capaciteScolaire: 2, capaciteScolaireActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBeUndefined();
        });
      });
    });
  });

  it("should validate capaciteApprentissageActuelle", () => {
    const intention = createIntention({ capaciteApprentissageActuelle: -1 });
    const result = intentionValidators.capaciteApprentissageActuelle(intention);
    expect(result).toBe("La capacité en apprentissage actuelle doit être un nombre entier positif");
  });

  it("should validate capaciteApprentissage", () => {
    const intention = createIntention({ typeDemande: "fermeture", capaciteApprentissage: 1 });
    const result = intentionValidators.capaciteApprentissage(intention);
    expect(result).toBe("La future capacité en apprentissage devrait être à 0 dans le cas d'une fermeture");
  });

  it("should validate sommeCapaciteActuelle", () => {
    const intention = createIntention({ typeDemande: "augmentation_nette", capaciteScolaireActuelle: 0, capaciteApprentissageActuelle: 0 });
    const result = intentionValidators.sommeCapaciteActuelle(intention);
    expect(result).toBe("La somme des capacités actuelles doit être supérieure à 0");
  });

  it("should validate sommeCapacite", () => {
    const intention = createIntention({ typeDemande: "augmentation_nette", capaciteScolaire: 0, capaciteApprentissage: 0 });
    const result = intentionValidators.sommeCapacite(intention);
    expect(result).toBe("La somme des futures capacités doit être supérieure à 0");
  });

  it("should validate motifRefus", () => {
    const intention = createIntention({ statut: DemandeStatutEnum["refusée"], motifRefus: undefined });
    const result = intentionValidators.motifRefus(intention);
    expect(result).toBe("Le champ 'motif refus' est obligatoire");
  });

  it("should validate autreMotifRefus", () => {
    const intention = createIntention({ motifRefus: ["autre"], autreMotifRefus: "" });
    const result = intentionValidators.autreMotifRefus(intention);
    expect(result).toBe("Le champ 'autre motif refus' est obligatoire");
  });
});
