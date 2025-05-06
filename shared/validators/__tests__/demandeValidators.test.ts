/* eslint-disable max-len */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { generateMock } from "@anatine/zod-mock";
import { describe, expect,it } from "vitest";

import { DemandeStatutEnum } from "../../enum/demandeStatutEnum";
import { DemandeTypeEnum } from "../../enum/demandeTypeEnum";
import { ROUTES } from "../../routes/routes";
import { demandeValidators } from "../demandeValidators";

const { demande } = generateMock(ROUTES["[POST]/demande/submit"]["schema"].body);
type Demande = typeof demande;

describe("shared > validators > demandeValidators", () => {
  const createDemande = (overrides: Partial<Demande>) => ({
    ...demande,
    ...overrides,
  });

  describe("Validation du 'motif'", () => {
    it("Doit remonter une erreur si le 'motif' n'est pas renseigné", () => {
      const demande = createDemande({ typeDemande: DemandeTypeEnum.augmentation_nette, motif: [] });
      expect(demandeValidators.motif(demande)).toBe("Le champ 'motif' est obligatoire");
    });

    it("Ne doit pas remonter d'erreur si le 'motif' est renseigné", () => {
      const demandeWithMotif = createDemande({ typeDemande: DemandeTypeEnum.augmentation_nette, motif: ["test"] });
      expect(demandeValidators.motif(demandeWithMotif)).toBeUndefined();
    });
  });

  describe("Validation du 'autreMotif'", () => {
    describe("Si le motif est 'autre'", () => {
      it("Doit remonter une erreur si le 'autreMotif' n'est pas renseigné", () => {
        const demande = createDemande({ motif: ["autre"], autreMotif: "" });
        expect(demandeValidators.autreMotif(demande)).toBe("Le champ 'autre motif' est obligatoire");

      });

      it("Ne doit pas remonter d'erreur si 'autreMotif' est renseigné", () => {
        const demandeWithoutAutreMotif = createDemande({ motif: ["autre"], autreMotif: "test" });
        expect(
          demandeValidators.autreMotif(demandeWithoutAutreMotif)
        ).toBeUndefined();
      });
    });

    describe("Si le motif n'est pas autre", () => {
      it("Ne doit pas remonter d'erreur si 'autreMotif' est renseigné", () => {
        const demandeWithoutAutreMotif = createDemande({ motif: ["autre"], autreMotif: "test" });
        expect(
          demandeValidators.autreMotif(demandeWithoutAutreMotif)
        ).toBeUndefined();
      });

      it("Ne doit pas remonter d'erreur si 'autreMotif' n'est pas renseigné", () => {
        const demandeWithoutAutreMotif = createDemande({ motif: [DemandeTypeEnum.augmentation_nette] });
        expect(
          demandeValidators.autreMotif(demandeWithoutAutreMotif)
        ).toBeUndefined();
      });
    });
  });

  describe("Validation du 'libelleColoration'", () => {
    describe("Si la 'coloration' a true", () => {
      it("Doit remonter une erreur si le 'libelleColoration' n'est pas renseigné", () => {
        const demande = createDemande({ coloration: true, libelleColoration: undefined });
        expect(demandeValidators.libelleColoration(demande)).toBe("Le champ 'libellé coloration' est obligatoire");
      });

      it("Ne doit pas remonter d'erreur si le 'libelleColoration' est renseigné", () => {
        const demandeWithLibelleColoration = createDemande({ coloration: true, libelleColoration: "test" });
        expect(
          demandeValidators.libelleColoration(demandeWithLibelleColoration)
        ).toBeUndefined();
      });
    });

    describe("Si la 'coloration' à false", () => {
      it("Doit remonter une erreur si le 'libelleColoration' est renseigné", () => {
        const demande = createDemande({ coloration: false, libelleColoration: "test" });
        expect(demandeValidators.libelleColoration(demande)).toBe("Le champ 'libellé coloration' doit être vide");
      });

      it("Ne doit pas remonter d'erreur si le 'libelleColoration' n'est pas renseigné", () => {
        const demande = createDemande({ coloration: false, libelleColoration: undefined });
        expect(demandeValidators.libelleColoration(demande)).toBeUndefined();
      });
    });
  });

  describe("Validation du 'capaciteScolaireActuelle'", () => {
    it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est négative", () => {
      const demande = createDemande({ capaciteScolaireActuelle: -1 });
      const result = demandeValidators.capaciteScolaireActuelle(demande);
      expect(result).toBe("La capacité scolaire actuelle doit être un nombre entier positif");
    });

    it("Ne doit pas remonter d'erreur si la 'capaciteScolaireActuelle' est un nombre entier positif", () => {
      const demande = createDemande({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: 1 });
      const result = demandeValidators.capaciteScolaireActuelle(demande);
      expect(result).toBeUndefined();
    });

    describe("Si le 'typeDemande' est 'ouverture_nette' ou 'ouverture_compensation'", () => {
      describe.each`
      typeDemande                 | text
      ${DemandeTypeEnum.ouverture_nette}        | ${DemandeTypeEnum.ouverture_nette}
      ${DemandeTypeEnum.ouverture_compensation} | ${DemandeTypeEnum.ouverture_compensation}
        `(`Pour $text`, ({ typeDemande }) => {
        it("Doit remonter une erreur si la 'capaciteScolaireActuelle' différent de 0", () => {
          const demande = createDemande({ typeDemande, capaciteScolaireActuelle: 1 });
          const result = demandeValidators.capaciteScolaireActuelle(demande);
          expect(result).toBe("La capacité scolaire actuelle devrait être à 0 dans le cas d'une ouverture");
        });

        it("Ne doit pas remonter d'erreur si la 'capaciteScolaireActuelle' est à 0", () => {
          const demande = createDemande({ typeDemande, capaciteScolaireActuelle: 0 });
          const result = demandeValidators.capaciteScolaireActuelle(demande);
          expect(result).toBeUndefined();
        });
      });
    });
  });

  describe("Validation de la 'capaciteScolaire'", () => {
    it("Doit remonter une erreur si la 'capaciteScolaire' est négative", () => {
      const demande = createDemande({ capaciteScolaire: -1 });
      const result = demandeValidators.capaciteScolaire(demande);
      expect(result).toBe("La capacité scolaire doit être un nombre entier positif");
    });

    describe("Si 'typeDemande' est 'fermeture'", () => {
      it("Doit remonter une erreur si 'capaciteScolaire' est différent de 0", () => {
        const demande = createDemande({ typeDemande: "fermeture", capaciteScolaire: 1 });
        const result = demandeValidators.capaciteScolaire(demande);
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
            const demande = createDemande({ typeDemande, capaciteScolaire: 1, capaciteScolaireActuelle: 2 });
            const result = demandeValidators.capaciteScolaire(demande);
            expect(result).toBe("La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation");
          });
          it("Ne doit pas remonter d'erreur si la 'capaciteScolaire' est supérieure à la 'capaciteScolaireActuelle'", () => {
            const demande = createDemande({ typeDemande, capaciteScolaire: 2, capaciteScolaireActuelle: 1 });
            const result = demandeValidators.capaciteScolaire(demande);
            expect(result).toBeUndefined();
          });
        });
      });
    });

    describe("Si 'typeDemande' est 'diminution'", () => {
      describe("Si la 'capaciteScolaireActuelle' est un nombre positif", () => {
        it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est inférieure à la 'capaciteScolaire'", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.diminution, capaciteScolaire: 2, capaciteScolaireActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe("La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'une diminution");
        });
        it("Ne doit pas remonter d'erreur si la 'capaciteScolaire' est inférieure à la 'capaciteScolaireActuelle'", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.diminution, capaciteScolaire: 1, capaciteScolaireActuelle: 2 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBeUndefined();
        });
      });
    });

    describe("Si 'typeDemande' est 'transfert'", () => {
      describe("Ne fonctionne qu'avec des nombres positifs", () => {
        it("Doit remonter une erreur si la 'capaciteScolaire' est inférieure à 0", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: -1, capaciteScolaireActuelle: 1, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe("La capacité scolaire doit être un nombre entier positif");
        });
        it("Doit remonter une erreur si la 'capaciteScolaireActuelle' est inférieure à 0", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: -1, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
        it("Doit remonter une erreur si la 'capaciteApprentissage' est inférieure à 0", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: 1, capaciteApprentissage: -1, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
        it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' est inférieure à 0", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: 1, capaciteApprentissage: 1, capaciteApprentissageActuelle: -1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
        it("Ne doit pas remonter cette erreur si les capacités sont des nombres positifs", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 1, capaciteScolaireActuelle: 1, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).not.toBe("Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire");
        });
      });

      describe("Vérification des cas de transferts", () => {
        it("Doit remonter une erreur s'il y a une augmentation des places scolaires et apprentissage", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 2, capaciteScolaireActuelle: 1, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe("Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.");
        });

        it("Doit remonter une erreur s'il y a une diminution des places scolaires et apprentissage", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 0, capaciteScolaireActuelle: 1, capaciteApprentissage: 0, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe("Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.");
        });

        it("Ne doit pas remonter d'erreur lorsqu'il y a une diminution des places en scolaire et une augmentation en apprentissage", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 0, capaciteScolaireActuelle: 1, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe(undefined);
        });

        it("Ne doit pas remonter d'erreur lorsqu'il y a une augmentation des places en scolaire et une diminution en apprentissage", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteScolaire: 2, capaciteScolaireActuelle: 1, capaciteApprentissage: 0, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteScolaire(demande);
          expect(result).toBe(undefined);
        });
      });
    });

    describe("Si 'typeDemande' est 'ajustement'", () => {
      it("Doit remonter une erreur si la 'capaciteScolaire' est inférieure à 'capaciteScolaireActuelle'", () => {
        const demande = createDemande({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 2, capaciteScolaire: 1 });
        const result = demandeValidators.capaciteScolaire(demande);
        expect(result).toBe("La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée");
      });

      it("Ne doit pas remonter une erreur si la 'capaciteScolaire' est supérieure à 'capaciteScolaireActuelle'", () => {
        const demande = createDemande({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 1, capaciteScolaire: 2 });
        const result = demandeValidators.capaciteScolaire(demande);
        expect(result).toBe(undefined);
      });
    });
  });

  describe("Validation de la 'capaciteScolaireColoreeActuelle'", () => {
    it("Doit remonter une erreur si la 'capaciteScolaireColoreeActuelle' est négative", () => {
      const demande = createDemande({ capaciteScolaireColoreeActuelle: -1 });
      const result = demandeValidators.capaciteScolaireColoreeActuelle(demande);
      expect(result).toBe("La capacité scolaire colorée actuelle doit être un nombre entier positif");
    });

    describe("Si 'coloration' est à 'true'", () => {
      it("Ne doit pas remonter une erreur si la 'capaciteScolaireColoreeActuelle' est une coloration", () => {
        const demande = createDemande({ capaciteScolaireColoreeActuelle: 1, typeDemande: DemandeTypeEnum.ajustement, coloration: true });
        const result = demandeValidators.capaciteScolaireColoreeActuelle(demande);
        expect(result).toBe(undefined);
      });
    });

    describe("Si 'coloration' est à 'false'", () => {
      it("Doit remonter une erreur si la 'capaciteScolaireColoreeActuelle' n'est pas à 0", () => {
        const demande = createDemande({ capaciteScolaireColoreeActuelle: 1, typeDemande: DemandeTypeEnum.ajustement, coloration: false });
        const result = demandeValidators.capaciteScolaireColoreeActuelle(demande);
        expect(result).toBe("La capacité scolaire colorée actuelle doit être à 0 quand on ne se trouve pas dans une situation de coloration");
      });

      it("Ne doit pas remonter une erreur si la 'capaciteScolaireColoreeActuelle' est à 0", () => {
        const demande = createDemande({ capaciteScolaireColoreeActuelle: 0, typeDemande: DemandeTypeEnum.ajustement, coloration: false });
        const result = demandeValidators.capaciteScolaireColoreeActuelle(demande);
        expect(result).toBe(undefined);
      });
    });

    describe("Si 'typeDemande' est 'ouverture'", () => {
      it("Doit remonter une erreur si la 'capaciteScolaireColoreeActuelle' est différent de 0", () => {
        const demande = createDemande({ capaciteScolaireColoreeActuelle: 1, typeDemande: DemandeTypeEnum.ouverture_compensation, coloration: true });
        const result = demandeValidators.capaciteScolaireColoreeActuelle(demande);
        expect(result).toBe("La capacité scolaire colorée actuelle doit être à 0 dans le cas d'une ouverture");
      });

      it("Ne doit pas remonter d'erreur si la 'capaciteScolaireColoreeActuelle' est à 0", () => {
        const demande = createDemande({ capaciteScolaireColoreeActuelle: 0, typeDemande: DemandeTypeEnum.ouverture_compensation, coloration: true });
        const result = demandeValidators.capaciteScolaireColoreeActuelle(demande);
        expect(result).toBe(undefined);
      });
    });
  });

  describe("Validation de la 'capaciteApprentissageActuelle'", () => {
    it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' est négative", () => {
      const demande = createDemande({ capaciteApprentissageActuelle: -1 });
      const result = demandeValidators.capaciteApprentissageActuelle(demande);
      expect(result).toBe("La capacité en apprentissage actuelle doit être un nombre entier positif");
    });

    describe("Si 'typeDemande' est 'ouverture_compensation' ou 'ouverture_nette'", () => {
      describe.each`
      typeDemande                 | text
      ${DemandeTypeEnum.ouverture_nette}        | ${DemandeTypeEnum.ouverture_nette}
      ${DemandeTypeEnum.ouverture_compensation} | ${DemandeTypeEnum.ouverture_compensation}
        `(`Pour $text`, ({ typeDemande }) => {
        it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' différent de 0", () => {
          const demande = createDemande({ typeDemande, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteApprentissageActuelle(demande);
          expect(result).toBe("La capacité en apprentissage actuelle devrait être à 0 dans le cas d'une ouverture");
        });

        it("Ne doit pas remonter d'erreur si la 'capaciteApprentissageActuelle' est à 0", () => {
          const demande = createDemande({ typeDemande, capaciteApprentissageActuelle: 0 });
          const result = demandeValidators.capaciteApprentissageActuelle(demande);
          expect(result).toBe(undefined);
        });
      });
    });

    it("Ne doit pas remonter d'erreur si la 'capaciteApprentissageActuelle' est positive et le type de demande n'est pas une 'ouverture_nette' ou une 'ouverture_compensation'", () => {
      const demande = createDemande({ typeDemande: DemandeTypeEnum.coloration, capaciteApprentissageActuelle: 1 });
      const result = demandeValidators.capaciteApprentissageActuelle(demande);
      expect(result).toBe(undefined);
    });
  });


  describe("Validation de la 'capaciteApprentissage'", () => {
    it("Doit remonter une erreur si la 'capaciteApprentissage' est négative", () => {
      const demande = createDemande({ capaciteApprentissage: -1 });
      const result = demandeValidators.capaciteApprentissage(demande);
      expect(result).toBe("La future capacité en apprentissage doit être un nombre entier positif");
    });

    describe("Si 'typeDemande' est 'fermeture'", () => {
      it("Doit remonter une erreur si 'capaciteApprentissage' est différent de 0", () => {
        const demande = createDemande({ typeDemande: "fermeture", capaciteApprentissage: 1 });
        const result = demandeValidators.capaciteApprentissage(demande);
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
            const demande = createDemande({ typeDemande, capaciteApprentissage: 1, capaciteApprentissageActuelle: 2 });
            const result = demandeValidators.capaciteApprentissage(demande);
            expect(result).toBe("La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation");
          });
          it("Ne doit pas remonter d'erreur si la 'capaciteApprentissage' est supérieure à la 'capaciteApprentissageActuelle'", () => {
            const demande = createDemande({ typeDemande, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
            const result = demandeValidators.capaciteApprentissage(demande);
            expect(result).toBeUndefined();
          });
        });
      });
    });

    describe("Si 'typeDemande' est 'diminution'", () => {
      describe("Si la 'capaciteApprentissageActuelle' est un nombre positif", () => {
        it("Doit remonter une erreur si la 'capaciteApprentissageActuelle' est inférieure à la 'capaciteApprentissage'", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.diminution, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1 });
          const result = demandeValidators.capaciteApprentissage(demande);
          expect(result).toBe("La future capacité en apprentissage devrait être inférieure ou égale à la capacité actuelle dans le cas d'une diminution");
        });
        it("Ne doit pas remonter d'erreur si la 'capaciteApprentissage' est inférieure à la 'capaciteApprentissageActuelle'", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.diminution, capaciteApprentissage: 1, capaciteApprentissageActuelle: 2 });
          const result = demandeValidators.capaciteApprentissage(demande);
          expect(result).toBeUndefined();
        });
      });
    });

    describe("Si 'typeDemande' est 'transfert'", () => {
      describe("Ne fonctionne qu'avec des nombres positifs", () => {
        it("Doit remonter une erreur si la 'capaciteApprentissage' est inférieure à 0", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: -1, capaciteApprentissageActuelle: 1, capaciteScolaire: 1, capaciteScolaireActuelle: 1 });
          const result = demandeValidators.capaciteApprentissage(demande);
          expect(result).toBe("La future capacité en apprentissage doit être un nombre entier positif");

          const demande2 = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 0, capaciteApprentissageActuelle: 1, capaciteScolaire: 1, capaciteScolaireActuelle: 1 });
          const result2 = demandeValidators.capaciteApprentissage(demande2);
          expect(result2).toBe("La future capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage");
        });

        it("Ne doit pas remonter d'erreur si la capaciteApprentissage est un nombre positif", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 1, capaciteApprentissageActuelle: 1, capaciteScolaire: 1, capaciteScolaireActuelle: 1 });
          const result = demandeValidators.capaciteApprentissage(demande);
          expect(result).not.toBe("La future capacité en apprentissage doit être un nombre entier positif");
        });
      });

      describe("Vérification des cas de transferts", () => {
        it("Doit remonter une erreur s'il y a une diminution des places en apprentissage", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 1, capaciteApprentissageActuelle: 2, capaciteScolaire: 0, capaciteScolaireActuelle: 1 });
          const result = demandeValidators.capaciteApprentissage(demande);
          expect(result).toBe("La future capacité en apprentissage devrait être supérieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage");
        });

        it("Ne doit pas remonter d'erreur lorsqu'il y a une augmentation des places en apprentissage", () => {
          const demande = createDemande({ typeDemande: DemandeTypeEnum.transfert, capaciteApprentissage: 2, capaciteApprentissageActuelle: 1, capaciteScolaire: 2, capaciteScolaireActuelle: 1 });
          const result = demandeValidators.capaciteApprentissage(demande);
          expect(result).toBe(undefined);
        });
      });
    });

    describe("Si 'typeDemande' est 'ajustement'", () => {
      it("Doit remonter une erreur si la 'capaciteApprentissage' est inférieure à 'capaciteApprentissageActuelle'", () => {
        const demande = createDemande({ typeDemande: DemandeTypeEnum.ajustement, capaciteApprentissageActuelle: 2, capaciteApprentissage: 1 });
        const result = demandeValidators.capaciteApprentissage(demande);
        expect(result).toBe("La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée");
      });

      it("Ne doit pas remonter une erreur si la 'capaciteApprentissage' est supérieure à 'capaciteApprentissageActuelle'", () => {
        const demande = createDemande({ typeDemande: DemandeTypeEnum.ajustement, capaciteApprentissageActuelle: 1, capaciteApprentissage: 2 });
        const result = demandeValidators.capaciteApprentissage(demande);
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
        const demande = createDemande({ typeDemande });
        const result = demandeValidators.sommeCapaciteActuelle(demande);
        expect(result).toBe(undefined);
      });
    });

    it("Doit remonter une erreur si la somme des 'capaciteScolaireActuelle' et 'capaciteApprentissageActuelle' est à 0", () => {
      expect(
        demandeValidators.sommeCapaciteActuelle(
          createDemande({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: 0, capaciteApprentissageActuelle: 0 })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');

      expect(
        demandeValidators.sommeCapaciteActuelle(
          createDemande({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: undefined, capaciteApprentissageActuelle: 0 })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');

      expect(
        demandeValidators.sommeCapaciteActuelle(
          createDemande({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: 0, capaciteApprentissageActuelle: undefined })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');

      expect(
        demandeValidators.sommeCapaciteActuelle(
          createDemande({ typeDemande: DemandeTypeEnum.fermeture, capaciteScolaireActuelle: undefined, capaciteApprentissageActuelle: undefined })
        )
      ).toBe('La somme des capacités actuelles doit être supérieure à 0');
    });

    it("Ne doit pas remonter une erreur si la somme des 'capaciteScolaireActuelle' et 'capaciteApprentissageActuelle' est supérieure à 0", () => {
      expect(
        demandeValidators.sommeCapaciteActuelle(
          createDemande({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 1, capaciteApprentissageActuelle: 0 })
        )
      ).toBe(undefined);

      expect(
        demandeValidators.sommeCapaciteActuelle(
          createDemande({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 0, capaciteApprentissageActuelle: 1 })
        )
      ).toBe(undefined);

      expect(
        demandeValidators.sommeCapaciteActuelle(
          createDemande({ typeDemande: DemandeTypeEnum.ajustement, capaciteScolaireActuelle: 1, capaciteApprentissageActuelle: 1 })
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
        expect(demandeValidators.sommeCapacite({
          ...demande,
          typeDemande
        })).toBe(undefined);
      });
    });

    describe("Pour les autres 'typeDemande'", () => {
      it("Doit remonter une erreur si 'capaciteApprentissage' et 'capaciteScolaire' ne sont pas rensiegnées", () => {
        expect(demandeValidators.sommeCapacite({
          ...demande,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteApprentissage: undefined,
          capaciteScolaire: undefined
        })).toBe('La somme des futures capacités doit être supérieure à 0');
      });

      it("Ne doit pas remonter une erreur si l'une des capacités ('capaciteApprentissage', 'capaciteScolaire', 'capaciteApprentissageActuelle', 'capaciteScolaireActuelle') est négative", () => {
        expect(demandeValidators.sommeCapacite({
          ...demande,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteScolaire: -1,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: 1,
          capaciteScolaireActuelle: 1
        })).toBe(undefined);

        expect(demandeValidators.sommeCapacite({
          ...demande,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteScolaire: 1,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: 1,
          capaciteScolaireActuelle: -1
        })).toBe(undefined);

        expect(demandeValidators.sommeCapacite({
          ...demande,
          typeDemande: DemandeTypeEnum.augmentation_nette,
          capaciteScolaire: 1,
          capaciteApprentissage: 1,
          capaciteApprentissageActuelle: -1,
          capaciteScolaireActuelle: 1
        })).toBe(undefined);

        expect(demandeValidators.sommeCapacite({
          ...demande,
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
            expect(demandeValidators.sommeCapacite({
              ...demande,
              typeDemande,
              capaciteScolaire: 1,
              capaciteApprentissage: 1,
              capaciteApprentissageActuelle: 2,
              capaciteScolaireActuelle: 1
            })).toBe("La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation");
          });

          it("Ne doit pas remonter une erreur si la somme des capacités est supérieure à la somme des capacités actuelles", () => {
            expect(demandeValidators.sommeCapacite({
              ...demande,
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
            expect(demandeValidators.sommeCapacite({
              ...demande,
              typeDemande: DemandeTypeEnum.ajustement,
              capaciteScolaire: 1,
              capaciteApprentissage: 1,
              capaciteApprentissageActuelle: 2,
              capaciteScolaireActuelle: 1
            })).toBe("La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'un ajustement de rentrée");
          });

          it("Ne doit pas remonter une erreur si la somme des capacités est supérieure à la somme des capacités actuelles", () => {
            expect(demandeValidators.sommeCapacite({
              ...demande,
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
            expect(demandeValidators.sommeCapacite({
              ...demande,
              typeDemande: DemandeTypeEnum.diminution,
              capaciteScolaire: 1,
              capaciteApprentissage: 2,
              capaciteApprentissageActuelle: 1,
              capaciteScolaireActuelle: 1
            })).toBe("La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution");
          });

          it("Ne doit pas remonter une erreur si la somme des capacités est inférieure à la somme des capacités actuelles", () => {
            expect(demandeValidators.sommeCapacite({
              ...demande,
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
      const demandeRefuseeWithMotifRefusUndefined = createDemande({ statut: DemandeStatutEnum["refusée"], motifRefus: undefined });
      expect(demandeValidators.motifRefus(demandeRefuseeWithMotifRefusUndefined)).toBe("Le champ 'motif refus' est obligatoire");

      const demandeRefuseeWithMotifRefusStringVide = createDemande({ statut: DemandeStatutEnum["refusée"], motifRefus: [] });
      expect(demandeValidators.motifRefus(demandeRefuseeWithMotifRefusStringVide)).toBe("Le champ 'motif refus' est obligatoire");
    });

    it("Ne doit pas remonter d'erreur si le 'statut' est à 'refusée' et que le champ motifRefus est renseigné", () => {
      const demandeRefuseeWithMotifRefusStringVide = createDemande({ statut: DemandeStatutEnum["refusée"], motifRefus: ["test"] });
      expect(demandeValidators.motifRefus(demandeRefuseeWithMotifRefusStringVide)).toBe(undefined);
    });
  });

  describe("Validation du champ 'autreMotifRefus'", () => {
    it("Doit remonter une erreur si 'motifRefus' est à 'autre' mais que 'autreMotifRefus' est vide", () => {
      const demandeAutreMotifRefusStringVide = createDemande({ motifRefus: ["autre"], autreMotifRefus: "" });
      expect(
        demandeValidators.autreMotifRefus(demandeAutreMotifRefusStringVide)
      ).toBe("Le champ 'autre motif refus' est obligatoire");

      const demandeAutreMotifRefusUndefined = createDemande({ motifRefus: ["autre"], autreMotifRefus: undefined });
      expect(
        demandeValidators.autreMotifRefus(demandeAutreMotifRefusUndefined)
      ).toBe("Le champ 'autre motif refus' est obligatoire");
    });

    it("Ne doit pas remonter d'erreur si 'motifRefus' est à 'autre' mais que 'autreMotifRefus' est renseigné", () => {
      const demandeAutreMotifRefusUndefined = createDemande({ motifRefus: ["autre"], autreMotifRefus: "test" });
      expect(
        demandeValidators.autreMotifRefus(demandeAutreMotifRefusUndefined)
      ).toBe(undefined);
    });
  });
});
