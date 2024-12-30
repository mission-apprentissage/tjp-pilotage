import { describe, expect, it } from "vitest";

import {
  getDateRentreeScolaire,
  getRentreeScolaire,
  getRentreeScolairePrecedente,
  getRentreeScolaireSuivante,
} from "../getRentreeScolaire";

describe("getRentreeScolaire", () => {
  describe("getRentreeScolairePrecedente", () => {
    it("Should work for any millesime between 2020 and 2050", () => {
      for (let i = 2020; i < 2050; i++) {
        const rentreeScolaire = `${i}`;
        const rentreeScolairePrecedente = getRentreeScolairePrecedente(rentreeScolaire);
        expect(rentreeScolairePrecedente).toEqual(`${i - 1}`);
      }
    });
  });

  describe("getRentreeScolaireSuivante", () => {
    it("Should work for any rentree scolaire between 2020 and 2050", () => {
      for (let i = 2020; i < 2050; i++) {
        const rentreeScolaire = `${i}`;
        const rentreeScolaireSuivante = getRentreeScolaireSuivante(rentreeScolaire);
        expect(rentreeScolaireSuivante).toEqual(`${i + 1}`);
      }
    });
  });

  describe("getRentreeScolaire", () => {
    it("Should work for a rentree scolaire between 2020 and 2050 and an offset", () => {
      for (let i = 2020; i < 2050; i++) {
        const rentreeScolaire = `${i}`;
        for (let j = -2; j < 3; j++) {
          const offset = j;
          const millesimePrecedent = getRentreeScolaire({
            rentreeScolaire,
            offset,
          });
          expect(millesimePrecedent).toEqual(`${i + offset}`);
        }
      }
    });
  });

  describe("getDateRentreeScolaire", () => {
    it("Should work for any rentrée scolaire between 2020 and 2050", () => {
      for (let i = 2020; i < 2050; i++) {
        const rentreeScolaire = `${i}`;
        const dateRentreeScolaire = getDateRentreeScolaire(rentreeScolaire);
        expect(dateRentreeScolaire).toEqual(`${i}-09-01`);
      }
    });
  });
});
