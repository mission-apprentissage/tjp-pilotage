import { describe, expect, it } from "vitest";

import {
  getMillesime,
  getMillesimeFromRentreeScolaire,
  getMillesimePrecedent,
  getMillesimeSuivant,
} from "../getMillesime";

describe("getMillesime", () => {
  describe("getMillesimePrecedent", () => {
    it("Should work for any millesime between 2020 and 2050", () => {
      for (let i = 2020; i < 2050; i++) {
        const millesimeActuel = `${i}_${i + 1}`;
        const millesimePrecedent = getMillesimePrecedent(millesimeActuel);
        expect(millesimePrecedent).toEqual(`${i - 1}_${i}`);
      }
    });
  });

  describe("getMillesimeSuivant", () => {
    it("Should work for any millesime between 2020 and 2050", () => {
      for (let i = 2020; i < 2050; i++) {
        const millesimeActuel = `${i}_${i + 1}`;
        const millesimePrecedent = getMillesimeSuivant(millesimeActuel);
        expect(millesimePrecedent).toEqual(`${i + 1}_${i + 2}`);
      }
    });
  });

  describe("getMillesime", () => {
    it("Should work for a millesime and an offset", () => {
      for (let i = 2020; i < 2050; i++) {
        const millesimeActuel = `${i}_${i + 1}`;
        for (let j = -2; j < 3; j++) {
          const offset = j;
          const millesimePrecedent = getMillesime({
            millesimeSortie: millesimeActuel,
            offset,
          });
          expect(millesimePrecedent).toEqual(`${i + offset}_${i + offset + 1}`);
        }
      }
    });
  });

  describe("getMillesimeFromRentreeScolaire", () => {
    it("Should work for any rentrée scolaire between 2020 and 2050", () => {
      for (let i = 2020; i < 2050; i++) {
        const rentreeScolaire = `${i}`;

        for (let j = -2; j < 3; j++) {
          const offset = j;
          const millesime = getMillesimeFromRentreeScolaire({
            rentreeScolaire,
            offset,
          });
          expect(millesime).toEqual(`${i + offset - 2}_${i + offset - 1}`);
        }
      }
    });
  });
});
