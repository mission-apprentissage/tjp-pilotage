import { CURRENT_RENTREE } from 'shared';
import { describe, expect,it } from 'vitest';

import { extractCfdFromMefAndDuree, extractYearFromTags , isYearBetweenOuvertureAndFermeture } from '@/modules/import/usecases/importFormationEtablissement/utils';

describe('server > src > modules > import > usecases > importFormationEtablissement > utils.ts', () => {
  describe("extractCfdFromMefAndDuree doit parse un CFD et retourner un codeNiveauDiplome pour les offres en apprentissage", () => {
    describe("CFD commençant par 320", () => {
      it('Doit retourner 310 pour une durée de 1 an(s)', () => {
        expect(extractCfdFromMefAndDuree('320000', 1)).toBe(310);
      });

      it('Doit retourner 311 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('320000', 2)).toBe(311);
      });

      it('Doit retourner 312 pour une durée de 3 an(s)', () => {
        expect(extractCfdFromMefAndDuree('320000', 3)).toBe(312);
      });

      it("Doit retourner -1 sinon", () => {
        expect(extractCfdFromMefAndDuree('320000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('320000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 323", () => {
      it('Doit retourner 370 pour une durée de 1 an(s)', () => {
        expect(extractCfdFromMefAndDuree('323000', 1)).toBe(370);
      });

      it('Doit retourner -1 sinon', () => {
        expect(extractCfdFromMefAndDuree('323000', 2)).toBe(-1);
        expect(extractCfdFromMefAndDuree('323000', 3)).toBe(-1);
        expect(extractCfdFromMefAndDuree('323000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('323000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 363", () => {
      it("Doit retourner 372 peu importe la durée", () => {
        expect(extractCfdFromMefAndDuree('363000', 1)).toBe(372);
        expect(extractCfdFromMefAndDuree('363000', 2)).toBe(372);
        expect(extractCfdFromMefAndDuree('363000', 3)).toBe(372);
        expect(extractCfdFromMefAndDuree('363000', 4)).toBe(372);
        expect(extractCfdFromMefAndDuree('363000', 0)).toBe(372);
      });
    });

    describe("CFD commençant par 400", () => {
      it('Doit retourner 247 pour une durée de 1 an(s)', () => {
        expect(extractCfdFromMefAndDuree('400000', 1)).toBe(247);
      });

      it('Doit retourner 247 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('400000', 2)).toBe(247);
      });

      it('Doit retourner 247 pour une durée de 3 an(s)', () => {
        expect(extractCfdFromMefAndDuree('400000', 3)).toBe(247);
      });

      it("Doit retourner -1 sinon", () => {
        expect(extractCfdFromMefAndDuree('400000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('400000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 401", () => {
      it('Doit retourner 252 pour une durée de 3 an(s)', () => {
        expect(extractCfdFromMefAndDuree('401000', 3)).toBe(252);
      });

      it('Doit retourner -1 sinon', () => {
        expect(extractCfdFromMefAndDuree('401000', 1)).toBe(-1);
        expect(extractCfdFromMefAndDuree('401000', 2)).toBe(-1);
        expect(extractCfdFromMefAndDuree('401000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('401000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 403", () => {
      it('Doit retourner 273 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('403000', 2)).toBe(273);
      });
      it('Doit retourner -1 sinon', () => {
        expect(extractCfdFromMefAndDuree('403000', 1)).toBe(-1);
        expect(extractCfdFromMefAndDuree('403000', 3)).toBe(-1);
        expect(extractCfdFromMefAndDuree('403000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('403000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 450", () => {
      it('Doit retourner 890 pour une durée de 1 an(s)', () => {
        expect(extractCfdFromMefAndDuree('450000', 1)).toBe(890);
      });

      it('Doit retourner 890 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('450000', 2)).toBe(890);
      });

      it('Doit retourner 890 pour une durée de 3 an(s)', () => {
        expect(extractCfdFromMefAndDuree('450000', 3)).toBe(890);
      });

      it("Doit retourner -1 sinon", () => {
        expect(extractCfdFromMefAndDuree('450000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('450000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 453", () => {
      it('Doit retourner 275 pour une durée de 1 an(s)', () => {
        expect(extractCfdFromMefAndDuree('453000', 1)).toBe(275);
      });

      it('Doit retourner 281 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('453000', 2)).toBe(281);
      });

      it("Doit retourner -1 sinon", () => {
        expect(extractCfdFromMefAndDuree('453000', 3)).toBe(-1);
        expect(extractCfdFromMefAndDuree('453000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('453000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 460", () => {
      it('Doit retourner 390 pour une durée de 1 an(s)', () => {
        expect(extractCfdFromMefAndDuree('460000', 1)).toBe(390);
      });

      it('Doit retourner 291 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('460000', 2)).toBe(291);
      });

      it('Doit retourner 292 pour une durée de 3 an(s)', () => {
        expect(extractCfdFromMefAndDuree('460000', 3)).toBe(292);
      });

      it("Doit retourner -1 sinon", () => {
        expect(extractCfdFromMefAndDuree('460000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('460000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 461", () => {
      it('Doit retourner 258 peu importe la durée', () => {
        expect(extractCfdFromMefAndDuree('461000', 1)).toBe(258);
        expect(extractCfdFromMefAndDuree('461000', 2)).toBe(258);
        expect(extractCfdFromMefAndDuree('461000', 3)).toBe(258);
        expect(extractCfdFromMefAndDuree('461000', 4)).toBe(258);
        expect(extractCfdFromMefAndDuree('461000', 0)).toBe(258);
      });
    });

    describe("CFD commençant par 463", () => {
      it('Doit retourner 278 peu importe la durée', () => {
        expect(extractCfdFromMefAndDuree('463000', 1)).toBe(278);
        expect(extractCfdFromMefAndDuree('463000', 2)).toBe(278);
        expect(extractCfdFromMefAndDuree('463000', 3)).toBe(278);
        expect(extractCfdFromMefAndDuree('463000', 4)).toBe(278);
        expect(extractCfdFromMefAndDuree('463000', 0)).toBe(278);
      });
    });

    describe("CFD commençant par 500", () => {
      it('Doit retourner 240 pour une durée de 1 an(s)', () => {
        expect(extractCfdFromMefAndDuree('500000', 1)).toBe(240);
      });

      it('Doit retourner 241 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('500000', 2)).toBe(241);
      });

      it('Doit retourner 242 pour une durée de 3 an(s)', () => {
        expect(extractCfdFromMefAndDuree('500000', 3)).toBe(242);
      });

      it("Doit retourner -1 sinon", () => {
        expect(extractCfdFromMefAndDuree('500000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('500000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 503", () => {
      it('Doit retourner 270 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('503000', 1)).toBe(270);
      });
      it('Doit retourner -1 sinon', () => {
        expect(extractCfdFromMefAndDuree('503000', 2)).toBe(-1);
        expect(extractCfdFromMefAndDuree('503000', 3)).toBe(-1);
        expect(extractCfdFromMefAndDuree('503000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('503000', 0)).toBe(-1);
      });
    });

    describe("CFD commençant par 553", () => {
      it('Doit retourner 277 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('553000', 1)).toBe(277);
      });
      it('Doit retourner 282 pour une durée de 2 an(s)', () => {
        expect(extractCfdFromMefAndDuree('553000', 2)).toBe(282);
      });
      it('Doit retourner -1 sinon', () => {
        expect(extractCfdFromMefAndDuree('553000', 3)).toBe(-1);
        expect(extractCfdFromMefAndDuree('553000', 4)).toBe(-1);
        expect(extractCfdFromMefAndDuree('553000', 0)).toBe(-1);
      });
    });


    describe("CFD commençant par 560", () => {
      it('Doit retourner 293 peu importe la durée', () => {
        expect(extractCfdFromMefAndDuree('560000', 1)).toBe(293);
        expect(extractCfdFromMefAndDuree('560000', 2)).toBe(293);
        expect(extractCfdFromMefAndDuree('560000', 3)).toBe(293);
        expect(extractCfdFromMefAndDuree('560000', 4)).toBe(293);
        expect(extractCfdFromMefAndDuree('560000', 0)).toBe(293);
      });
    });

    describe("CFD commençant par 561", () => {
      it('Doit retourner 257 peu importe la durée', () => {
        expect(extractCfdFromMefAndDuree('561000', 1)).toBe(257);
        expect(extractCfdFromMefAndDuree('561000', 2)).toBe(257);
        expect(extractCfdFromMefAndDuree('561000', 3)).toBe(257);
        expect(extractCfdFromMefAndDuree('561000', 4)).toBe(257);
        expect(extractCfdFromMefAndDuree('561000', 0)).toBe(257);
      });
    });

    describe("CFD commençant par 563", () => {
      it('Doit retourner 279 peu importe la durée', () => {
        expect(extractCfdFromMefAndDuree('563000', 1)).toBe(279);
        expect(extractCfdFromMefAndDuree('563000', 2)).toBe(279);
        expect(extractCfdFromMefAndDuree('563000', 3)).toBe(279);
        expect(extractCfdFromMefAndDuree('563000', 4)).toBe(279);
        expect(extractCfdFromMefAndDuree('563000', 0)).toBe(279);
      });
    });

    it('Doit retourner -1 pour un CFD inconnu', () => {
      expect(extractCfdFromMefAndDuree('999000', 1)).toBe(-1);
    });
  });

  describe("extractYearFromTags doit extraire les années contenues dans les tags des offres en apprentissage", () => {
    it("Doit retourner un tableau vide si la chaine de caractères est vide", () => {
      expect(extractYearFromTags('')).toEqual([]);
    });

    describe("Gestion des années", () => {
      it("Doit retourner l'année contenue dans le tag et celle précédente si celle-ci est parsable", () => {
        expect(extractYearFromTags('2021')).toEqual(["2020","2021"]);
      });

      it("Doit retourner les années contenues dans le tag si celles-ci sont séparées par une virgule", () => {
        expect(extractYearFromTags('2021,2022')).toEqual(["2020", "2021", "2022"]);
      });

      it("Doit trim les années", () => {
        expect(extractYearFromTags('  2021 , 2022   ')).toEqual(["2020", "2021", "2022"]);
      });

      it("Doit limiter les années sélectionnées à l'année de référence", () => {
        expect(extractYearFromTags(`2021,2022,2023,${parseInt(CURRENT_RENTREE) + 1}`)).toEqual(["2020", "2021", "2022", "2023", "2024"]);
      });
    });

    it("Ne doit pas fonctionner avec un autre séparateur", () => {
      expect(extractYearFromTags('2021;2022')).toEqual([]);
    });
  });

  describe("isYearBetweenOuvertureAndFermeture doit révéler si une année est comprise entre la date d'ouverture et de fermeture d'une formation", () => {
    it("Doit retourner false si la date d'ouverture est nulle", () => {
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: null, dateFermeture: null })).toBe(false);
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: null, dateFermeture: new Date('2022-01-01') })).toBe(false);
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: null, dateFermeture: new Date('2020-01-01') })).toBe(false);
    });

    it("Doit retourner true si la date de fermeture est nulle et la date d'ouverture est avant l'année", () => {
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: new Date('2020-01-01'), dateFermeture: null })).toBe(true);
    });

    it("Doit retourner false si la date de fermeture est nulle et la date d'ouverture est après l'année", () => {
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: new Date('2022-01-01'), dateFermeture: null })).toBe(false);
    });

    it("Doit retourner true si l'année est entre la date d'ouverture et de fermeture", () => {
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: new Date('2020-01-01'), dateFermeture: new Date('2022-01-01') })).toBe(true);
    });

    it("Doit retourner false si l'année est avant la date d'ouverture", () => {
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: new Date('2022-01-01'), dateFermeture: new Date('2023-01-01') })).toBe(false);
    });

    it("Doit retourner false si l'année est après la date de fermeture", () => {
      expect(isYearBetweenOuvertureAndFermeture('2021', { dateOuverture: new Date('2019-01-01'), dateFermeture: new Date('2020-01-01') })).toBe(false);
    });
  });
});
