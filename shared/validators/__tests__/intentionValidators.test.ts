/* eslint-disable max-len */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { generateMock } from "@anatine/zod-mock";
import { describe, expect,it } from "vitest";

import { DemandeStatutEnum } from "../../enum/demandeStatutEnum";
import { DemandeTypeEnum } from "../../enum/demandeTypeEnum";
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
      const intention = createIntention({ typeDemande: DemandeTypeEnum.augmentation_nette, motif: [] });
      expect(intentionValidators.motif(intention)).toBe("Le champ 'motif' est obligatoire");
    });

    it("Ne doit pas remonter d'erreur si le 'motif' est renseigné", () => {
      const intentionWithMotif = createIntention({ typeDemande: DemandeTypeEnum.augmentation_nette, motif: ["test"] });
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
        const intentionWithoutAutreMotif = createIntention({ motif: [DemandeTypeEnum.augmentation_nette] });
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
      const intention = createIntention({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: 1 });
      const result = intentionValidators.capaciteScolaireActuelle(intention);
      expect(result).toBeUndefined();
    });

    describe("Si le 'typeDemande' est 'ouverture_nette' ou 'ouverture_compensation'", () => {
      describe.each`
      typeDemande                 | text
      ${DemandeTypeEnum.ouverture_nette}        | ${DemandeTypeEnum.ouverture_nette}
      ${DemandeTypeEnum.ouverture_compensation} | ${DemandeTypeEnum.ouverture_compensation}
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
      ${DemandeTypeEnum.augmentation_compensation} | ${DemandeTypeEnum.augmentation_compensation}
      ${DemandeTypeEnum.augmentation_nette}        | ${DemandeTypeEnum.augmentation_nette}
        `(`Pour $text`, ({ typeDemande }) => {
        describe("Si la 'capaciteScolaireActuelle' est un nombre positif", () => {
          it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est supérieure à la 'capaciteScolaire'", () => {
            const intention = createIntention({ typeDemande, capaciteScolaire: 1, capaciteScolaireActuelle: 2 });
            const result = intentionValidators.capaciteScolaire(intention);
            expect(result).toBe("La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation");
          });
          it("Ne doit pas remonter d'erreur si la 'capaciteScolaire' est supérieure à la 'capaciteScolaireActuelle'", () => {
            const intention = createIntention({ typeDemande, capaciteScolaire: 2, capaciteScolaireActuelle: 1 });
            const result = intentionValidators.capaciteScolaire(intention);
            expect(result).toBeUndefined();
          });
        });
      });
    });

    describe("Si 'typeDemande' est 'diminution'", () => {
      describe("Si la 'capaciteScolaireActuelle' est un nombre positif", () => {
        it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est inférieure à la 'capaciteScolaire'", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.diminution, capaciteScolaire: 2, capaciteScolaireActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'une diminution");
        });
        it("Ne doit pas remonter d'erreur si la 'capaciteScolaire' est inférieure à la 'capaciteScolaireActuelle'", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.diminution, capaciteScolaire: 1, capaciteScolaireActuelle: 2 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBeUndefined();
        });
      });
    });

    describe("Si 'typeDemande' est 'transfert'", () => {
      describe("Ne fonctionne qu'avec des nombres positifs", () => {
        it("Doit remonter une erreur si la 'capaciteScolaire' est inférieure à 0", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: -1, capaciteScolaireActuelle: 1, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("La capacité scolaire doit être un nombre entier positif");
        });
        it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est inférieure à 0", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: -1, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
        it("Doit remonter une erreur si la 'capaciteApprentissage' est inférieure à 0", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: 1, capaciteApprentissage: -1, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
        it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' est inférieure à 0", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: 1, capaciteApprentissage: 1, capaciteApprentissageActuelle: -1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
        it("Ne doit pas remonter cette erreur si les capacités sont des nombres positifs", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: 1, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).not.toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
      });

      describe("Vérification des cas de transferts", () => {
        it("Doit remonter une erreur s'il y a une augmentation des places scolaires et apprentissage", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 2, capaciteScolaireActuelle: 1, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.");
        });

        it("Doit remonter une erreur s'il y a une diminution des places scolaires et apprentissage", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 0, capaciteScolaireActuelle: 1, capaciteApprentissage: 0, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe("Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.");
        });

        it("Ne doit pas remonter d'erreur lorsqu'il y a une diminution des places en scolaire et une augmentation en apprentissage", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 0, capaciteScolaireActuelle: 1, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe(undefined);
        });

        it("Ne doit pas remonter d'erreur lorsqu'il y a une augmentation des places en scolaire et une diminution en apprentissage", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 2, capaciteScolaireActuelle: 1, capaciteApprentissage: 0, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteScolaire(intention);
          expect(result).toBe(undefined);
        });
      });
    });

    describe("Si 'typeDemande' est 'ajustement'", () => {
      it("Doit remonter une erreur si la 'capaciteScolaire' est inférieure à 'capaciteScolaireActuelle'", () => {
        const intention = createIntention({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 2, capaciteScolaire: 1 });
        const result = intentionValidators.capaciteScolaire(intention);
        expect(result).toBe("La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée");
      });

      it("Ne doit pas remonter une erreur si la 'capaciteScolaire' est supérieure à 'capaciteScolaireActuelle'", () => {
        const intention = createIntention({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 1, capaciteScolaire: 2 });
        const result = intentionValidators.capaciteScolaire(intention);
        expect(result).toBe(undefined);
      });
    });
  });

  describe("Validation de la 'capaciteScolaireColoreeActuelle'", () => {
    it("Doit remonter une erreur si la 'capaciteScolaireColoreeActuelle' est négative", () => {
      const intention = createIntention({ capaciteScolaireColoreeActuelle: -1 });
      const result = intentionValidators.capaciteScolaireColoreeActuelle(intention);
      expect(result).toBe("La capacité scolaire colorée actuelle doit être un nombre entier positif");
    });

    describe("Si 'coloration' est à 'true'", () => {
      it("Ne doit pas remonter une erreur si la 'capaciteScolaireColoreeActuelle' est une coloration", () => {
        const intention = createIntention({ capaciteScolaireColoreeActuelle: 1, typeDemande: DemandeTypeEnum.ajustement, coloration: true });
        const result = intentionValidators.capaciteScolaireColoreeActuelle(intention);
        expect(result).toBe(undefined);
      });
    });

    describe("Si 'coloration' est à 'false'", () => {
      it("Doit remonter une erreur si la 'capaciteScolaireColoreeActuelle' n'est pas à 0", () => {
        const intention = createIntention({ capaciteScolaireColoreeActuelle: 1, typeDemande: DemandeTypeEnum.ajustement, coloration: false });
        const result = intentionValidators.capaciteScolaireColoreeActuelle(intention);
        expect(result).toBe("La capacité scolaire colorée actuelle doit être à 0 quand on ne se trouve pas dans une situation de coloration");
      });

      it("Ne doit pas remonter une erreur si la 'capaciteScolaireColoreeActuelle' est à 0", () => {
        const intention = createIntention({ capaciteScolaireColoreeActuelle: 0, typeDemande: DemandeTypeEnum.ajustement, coloration: false });
        const result = intentionValidators.capaciteScolaireColoreeActuelle(intention);
        expect(result).toBe(undefined);
      });
    });

    describe("Si 'typeDemande' est 'ouverture'", () => {
      it("Doit remonter une erreur si la 'capaciteScolaireColoreeActuelle' est différent de 0", () => {
        const intention = createIntention({ capaciteScolaireColoreeActuelle: 1, typeDemande: DemandeTypeEnum.ouverture_compensation, coloration: true });
        const result = intentionValidators.capaciteScolaireColoreeActuelle(intention);
        expect(result).toBe("La capacité scolaire colorée actuelle doit être à 0 dans le cas d'une ouverture");
      });

      it("Ne doit pas remonter d'erreur si la 'capaciteScolaireColoreeActuelle' est à 0", () => {
        const intention = createIntention({ capaciteScolaireColoreeActuelle: 0, typeDemande: DemandeTypeEnum.ouverture_compensation, coloration: true });
        const result = intentionValidators.capaciteScolaireColoreeActuelle(intention);
        expect(result).toBe(undefined);
      });
    });
  });

  describe("Validation de la 'capaciteApprentissageActuelle'", () => {
    it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' est négative", () => {
      const intention = createIntention({ capaciteApprentissageActuelle: -1 });
      const result = intentionValidators.capaciteApprentissageActuelle(intention);
      expect(result).toBe("La capacité en apprentissage actuelle doit être un nombre entier positif");
    });

    describe("Si 'typeDemande' est 'ouverture_compensation' ou 'ouverture_nette'", () => {
      describe.each`
      typeDemande                 | text
      ${DemandeTypeEnum.ouverture_nette}        | ${DemandeTypeEnum.ouverture_nette}
      ${DemandeTypeEnum.ouverture_compensation} | ${DemandeTypeEnum.ouverture_compensation}
        `(`Pour $text`, ({ typeDemande }) => {
        it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' différent de 0", () => {
          const intention = createIntention({ typeDemande, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteApprentissageActuelle(intention);
          expect(result).toBe("La capacité en apprentissage actuelle devrait être à 0 dans le cas d'une ouverture");
        });

        it("Ne doit pas remonter d'erreur si la 'capaciteApprentissageActuelle' est à 0", () => {
          const intention = createIntention({ typeDemande, capaciteApprentissageActuelle: 0 });
          const result = intentionValidators.capaciteApprentissageActuelle(intention);
          expect(result).toBe(undefined);
        });
      });
    });

    it("Ne doit pas remonter d'erreur si la 'capaciteApprentissageActuelle' est positive et le type de demande n'est pas une 'ouverture_nette' ou une 'ouverture_compensation'", () => {
      const intention = createIntention({ typeDemande: DemandeTypeEnum.coloration, capaciteApprentissageActuelle: 1 });
      const result = intentionValidators.capaciteApprentissageActuelle(intention);
      expect(result).toBe(undefined);
    });
  });


  describe("Validation de la 'capaciteApprentissage'", () => {
    it("Doit remonter une erreur si la 'capaciteApprentissage' est négative", () => {
      const intention = createIntention({ capaciteApprentissage: -1 });
      const result = intentionValidators.capaciteApprentissage(intention);
      expect(result).toBe("La future capacité en apprentissage doit être un nombre entier positif");
    });

    describe("Si 'typeDemande' est 'fermeture'", () => {
      it("Doit remonter une erreur si 'capaciteApprentissage' est différent de 0", () => {
        const intention = createIntention({ typeDemande: "fermeture", capaciteApprentissage: 1 });
        const result = intentionValidators.capaciteApprentissage(intention);
        expect(result).toBe("La future capacité en apprentissage devrait être à 0 dans le cas d'une fermeture");
      });
    });

    describe("Si 'typeDemande' est 'augmentation_compensation' ou 'augmentation_nette'", () => {
      describe.each`
      typeDemande                 | text
      ${DemandeTypeEnum.augmentation_compensation} | ${DemandeTypeEnum.augmentation_compensation}
      ${DemandeTypeEnum.augmentation_nette}        | ${DemandeTypeEnum.augmentation_nette}
        `(`Pour $text`, ({ typeDemande }) => {
        describe("Si la 'capaciteApprentissageActuelle' est un nombre positif", () => {
          it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' est supérieure à la 'capaciteApprentissage'", () => {
            const intention = createIntention({ typeDemande, capaciteApprentissage: 1, capaciteApprentissageActuelle: 2 });
            const result = intentionValidators.capaciteApprentissage(intention);
            expect(result).toBe("La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation");
          });
          it("Ne doit pas remonter d'erreur si la 'capaciteApprentissage' est supérieure à la 'capaciteApprentissageActuelle'", () => {
            const intention = createIntention({ typeDemande, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
            const result = intentionValidators.capaciteApprentissage(intention);
            expect(result).toBeUndefined();
          });
        });
      });
    });

    describe("Si 'typeDemande' est 'diminution'", () => {
      describe("Si la 'capaciteApprentissageActuelle' est un nombre positif", () => {
        it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' est inférieure à la 'capaciteApprentissage'", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.diminution, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
          const result = intentionValidators.capaciteApprentissage(intention);
          expect(result).toBe("La future capacité en apprentissage devrait être inférieure ou égale à la capacité actuelle dans le cas d'une diminution");
        });
        it("Ne doit pas remonter d'erreur si la 'capaciteApprentissage' est inférieure à la 'capaciteApprentissageActuelle'", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.diminution, capaciteApprentissage: 1, capaciteApprentissageActuelle: 2 });
          const result = intentionValidators.capaciteApprentissage(intention);
          expect(result).toBeUndefined();
        });
      });
    });

    describe("Si 'typeDemande' est 'transfert'", () => {
      describe("Ne fonctionne qu'avec des nombres positifs", () => {
        it("Doit remonter une erreur si la 'capaciteApprentissage' est inférieure à 0", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: -1, capaciteApprentissageActuelle: 1, capaciteScolaire: 1, capaciteScolaireActuelle: 1 });
          const result = intentionValidators.capaciteApprentissage(intention);
          expect(result).toBe("La future capacité en apprentissage doit être un nombre entier positif");

          const intention2 = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 0, capaciteApprentissageActuelle: 1, capaciteScolaire: 1, capaciteScolaireActuelle: 1 });
          const result2 = intentionValidators.capaciteApprentissage(intention2);
          expect(result2).toBe("La future capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage");
        });

        it("Ne doit pas remonter d'erreur si la capaciteApprentissage est un nombre positif", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1, capaciteScolaire: 1, capaciteScolaireActuelle: 1 });
          const result = intentionValidators.capaciteApprentissage(intention);
          expect(result).not.toBe("La future capacité en apprentissage doit être un nombre entier positif");
        });
      });

      describe("Vérification des cas de transferts", () => {
        it("Doit remonter une erreur s'il y a une diminution des places en apprentissage", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 1, capaciteApprentissageActuelle: 2, capaciteScolaire: 0, capaciteScolaireActuelle: 1 });
          const result = intentionValidators.capaciteApprentissage(intention);
          expect(result).toBe("La future capacité en apprentissage devrait être supérieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage");
        });

        it("Ne doit pas remonter d'erreur lorsqu'il y a une augmentation des places en apprentissage", () => {
          const intention = createIntention({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1, capaciteScolaire: 2, capaciteScolaireActuelle: 1 });
          const result = intentionValidators.capaciteApprentissage(intention);
          expect(result).toBe(undefined);
        });
      });
    });

    describe("Si 'typeDemande' est 'ajustement'", () => {
      it("Doit remonter une erreur si la 'capaciteApprentissage' est inférieure à 'capaciteApprentissageActuelle'", () => {
        const intention = createIntention({ typeDemande: DemandeTypeEnum.ajustement, capaciteApprentissageActuelle: 2, capaciteApprentissage: 1 });
        const result = intentionValidators.capaciteApprentissage(intention);
        expect(result).toBe("La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée");
      });

      it("Ne doit pas remonter une erreur si la 'capaciteApprentissage' est supérieure à 'capaciteApprentissageActuelle'", () => {
        const intention = createIntention({ typeDemande: DemandeTypeEnum.ajustement, capaciteApprentissageActuelle: 1, capaciteApprentissage: 2 });
        const result = intentionValidators.capaciteApprentissage(intention);
        expect(result).toBe(undefined);
      });
    });
  });

  describe("Validation de la 'sommeCapaciteActuelle'", () => {
    describe.each`
    typeDemande                 | text
    ${DemandeTypeEnum.ouverture_compensation} | ${DemandeTypeEnum.ouverture_compensation}
    ${DemandeTypeEnum.ouverture_nette}        | ${DemandeTypeEnum.ouverture_nette}
    ${DemandeTypeEnum.ajustement}        | ${DemandeTypeEnum.ajustement}
      `(`Si 'typeDemande' est '$text'`, ({ typeDemande }) => {
      it("Ne doit pas remonter d'erreur", () => {
        const intention = createIntention({ typeDemande });
        const result = intentionValidators.sommeCapaciteActuelle(intention);
        expect(result).toBe(undefined);
      });
    });

    it("Doit remonter une erreur si la somme des 'capaciteScolaireActuelle' et 'capaciteApprentissageActuelle' est à 0", () => {
      expect(
        intentionValidators.sommeCapaciteActuelle(
          createIntention({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: 0, capaciteApprentissageActuelle: 0 })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');

      expect(
        intentionValidators.sommeCapaciteActuelle(
          createIntention({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: undefined, capaciteApprentissageActuelle: 0 })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');

      expect(
        intentionValidators.sommeCapaciteActuelle(
          createIntention({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: 0, capaciteApprentissageActuelle: undefined })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');

      expect(
        intentionValidators.sommeCapaciteActuelle(
          createIntention({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: undefined, capaciteApprentissageActuelle: undefined })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');
    });

    it("Ne doit pas remonter une erreur si la somme des 'capaciteScolaireActuelle' et 'capaciteApprentissageActuelle' est supérieure à 0", () => {
      expect(
        intentionValidators.sommeCapaciteActuelle(
          createIntention({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 1, capaciteApprentissageActuelle: 0 })
        )
      ).toBe(undefined);

      expect(
        intentionValidators.sommeCapaciteActuelle(
          createIntention({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 0, capaciteApprentissageActuelle: 1 })
        )
      ).toBe(undefined);

      expect(
        intentionValidators.sommeCapaciteActuelle(
          createIntention({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 1, capaciteApprentissageActuelle: 1 })
        )
      ).toBe(undefined);
    });
  });

  describe("Validation de la 'sommeCapacite'", () => {
    describe.each`
    typeDemande                 | text
    ${DemandeTypeEnum.fermeture} | ${DemandeTypeEnum.fermeture}
    ${DemandeTypeEnum.coloration} | ${DemandeTypeEnum.coloration}
      `(`Si 'typeDemande' est '$text'`, ({ typeDemande }) => {
      it("Ne doit pas remonter d'erreur", () => {
        expect(intentionValidators.sommeCapacite({
          ...intention,
          typeDemande
        })).toBe(undefined);
      });
    });

    describe("Pour les autres 'typeDemande'", () => {
      it("Doit remonter une erreur si 'capaciteApprentissage' et 'capaciteScolaire' ne sont pas rensiegnées", () => {
        expect(intentionValidators.sommeCapacite({
          ...intention,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteApprentissage: undefined,
          capaciteScolaire: undefined
        })).toBe('La somme des futures capacités doit être supérieure à 0');
      });

      it("Ne doit pas remonter une erreur si l'une des capacités ('capaciteApprentissage', 'capaciteScolaire', 'capaciteApprentissageActuelle', 'capaciteScolaireActuelle') est négative", () => {
        expect(intentionValidators.sommeCapacite({
          ...intention,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteScolaire: -1,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: 1,
          capaciteScolaireActuelle: 1
        })).toBe(undefined);

        expect(intentionValidators.sommeCapacite({
          ...intention,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteScolaire: 1,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: 1,
          capaciteScolaireActuelle: -1
        })).toBe(undefined);

        expect(intentionValidators.sommeCapacite({
          ...intention,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteScolaire: 1,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: -1,
          capaciteScolaireActuelle: 1
        })).toBe(undefined);

        expect(intentionValidators.sommeCapacite({
          ...intention,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteScolaire: 1,
          capaciteApprentissage: -1,
          capaciteApprentissageActuelle: 1,
          capaciteScolaireActuelle: 1
        })).toBe(undefined);
      });

      describe("Si toutes les capacités sont renseignées et positives ('capaciteApprentissage', 'capaciteScolaire', 'capaciteApprentissageActuelle', 'capaciteScolaireActuelle')", () =>  {
        describe.each`
        typeDemande                 | text
        ${DemandeTypeEnum.augmentation_compensation} | ${DemandeTypeEnum.augmentation_compensation}
        ${DemandeTypeEnum.augmentation_nette} | ${DemandeTypeEnum.augmentation_nette}
        `(`Si 'typeDemande' est '$text'`, ({ typeDemande }) => {
          it("Doit remonter une erreur si la somme des capacités est inférieure à la somme des capacités actuelles", () => {
            expect(intentionValidators.sommeCapacite({
              ...intention,
              typeDemande,
              capaciteScolaire: 1,
              capaciteApprentissage: 1,
              capaciteApprentissageActuelle: 2,
              capaciteScolaireActuelle: 1
            })).toBe("La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation");
          });

          it("Ne doit pas remonter une erreur si la somme des capacités est supérieure à la somme des capacités actuelles", () => {
            expect(intentionValidators.sommeCapacite({
              ...intention,
              typeDemande,
              capaciteScolaire: 1,
              capaciteApprentissage: 2,
              capaciteApprentissageActuelle: 1,
              capaciteScolaireActuelle: 1
            })).toBe(undefined);
          });
        });

        describe("Si 'typeDemande' est 'ajustement'", () => {
          it("Doit remonter une erreur si la somme des capacités est inférieure à la somme des capacités actuelles", () => {
            expect(intentionValidators.sommeCapacite({
              ...intention,
              typeDemande: DemandeTypeEnum.ajustement,
              capaciteScolaire: 1,
              capaciteApprentissage: 1,
              capaciteApprentissageActuelle: 2,
              capaciteScolaireActuelle: 1
            })).toBe("La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'un ajustement de rentrée");
          });

          it("Ne doit pas remonter une erreur si la somme des capacités est supérieure à la somme des capacités actuelles", () => {
            expect(intentionValidators.sommeCapacite({
              ...intention,
              typeDemande: DemandeTypeEnum.ajustement,
              capaciteScolaire: 1,
              capaciteApprentissage: 2,
              capaciteApprentissageActuelle: 1,
              capaciteScolaireActuelle: 1
            })).toBe(undefined);
          });
        });

        describe("Si 'typeDemande' est 'diminution'", () => {
          it("Doit remonter une erreur si la somme des capacités est supérieure à la somme des capacités actuelles", () => {
            expect(intentionValidators.sommeCapacite({
              ...intention,
              typeDemande: DemandeTypeEnum.diminution,
              capaciteScolaire: 1,
              capaciteApprentissage: 2,
              capaciteApprentissageActuelle: 1,
              capaciteScolaireActuelle: 1
            })).toBe("La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution");
          });

          it("Ne doit pas remonter une erreur si la somme des capacités est inférieure à la somme des capacités actuelles", () => {
            expect(intentionValidators.sommeCapacite({
              ...intention,
              typeDemande: DemandeTypeEnum.diminution,
              capaciteScolaire: 1,
              capaciteApprentissage: 1,
              capaciteApprentissageActuelle: 2,
              capaciteScolaireActuelle: 1
            })).toBe(undefined);
          });
        });
      });
    });
  });

  describe("Validation du champ 'motifRefus'", () => {
    it("Doit remonter une erreur si le 'statut' est à 'refusée' et que le champ motifRefus est vide", () => {
      const intentionRefuseeWithMotifRefusUndefined = createIntention({ statut: DemandeStatutEnum["refusée"], motifRefus: undefined });
      expect(intentionValidators.motifRefus(intentionRefuseeWithMotifRefusUndefined)).toBe("Le champ 'motif refus' est obligatoire");

      const intentionRefuseeWithMotifRefusStringVide = createIntention({ statut: DemandeStatutEnum["refusée"], motifRefus: [] });
      expect(intentionValidators.motifRefus(intentionRefuseeWithMotifRefusStringVide)).toBe("Le champ 'motif refus' est obligatoire");
    });

    it("Ne doit pas remonter d'erreur si le 'statut' est à 'refusée' et que le champ motifRefus est renseigné", () => {
      const intentionRefuseeWithMotifRefusStringVide = createIntention({ statut: DemandeStatutEnum["refusée"], motifRefus: ["test"] });
      expect(intentionValidators.motifRefus(intentionRefuseeWithMotifRefusStringVide)).toBe(undefined);
    });
  });

  describe("Validation du champ 'autreMotifRefus'", () => {
    it("Doit remonter une erreur si 'motifRefus' est à 'autre' mais que 'autreMotifRefus' est vide", () => {
      const intentionAutreMotifRefusStringVide = createIntention({ motifRefus: ["autre"], autreMotifRefus: "" });
      expect(
        intentionValidators.autreMotifRefus(intentionAutreMotifRefusStringVide)
      ).toBe("Le champ 'autre motif refus' est obligatoire");

      const intentionAutreMotifRefusUndefined = createIntention({ motifRefus: ["autre"], autreMotifRefus: undefined });
      expect(
        intentionValidators.autreMotifRefus(intentionAutreMotifRefusUndefined)
      ).toBe("Le champ 'autre motif refus' est obligatoire");
    });

    it("Ne doit pas remonter d'erreur si 'motifRefus' est à 'autre' mais que 'autreMotifRefus' est renseigné", () => {
      const intentionAutreMotifRefusUndefined = createIntention({ motifRefus: ["autre"], autreMotifRefus: "test" });
      expect(
        intentionValidators.autreMotifRefus(intentionAutreMotifRefusUndefined)
      ).toBe(undefined);
    });
  });
});
