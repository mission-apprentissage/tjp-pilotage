import { describe, expect, it } from "vitest";

import { getFinDanneeScolaireMillesime, getMillesimeFromCampagne } from "../millesimes";

describe("Millesimes", () => {
  describe("getMillesimeFromCampagne", () => {
    it("doit renvoyer le millesime 2020_2021 pour une campagne 2023", () => {
      expect(getMillesimeFromCampagne("2023")).toEqual("2020_2021");
    });
  });

  describe("getFinDanneeScolaireMillesime", () => {
    it("doit renvoyer la fin la 2023 sur 2022_2023", () => {
      expect(getFinDanneeScolaireMillesime("2022_2023")).toEqual(2023);
    });

    it("doit renvoyer une chaine vide", () => {
      expect(getFinDanneeScolaireMillesime("")).toEqual(0);
    });
  });
});
