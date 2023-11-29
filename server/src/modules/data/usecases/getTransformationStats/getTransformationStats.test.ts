import {
  getEffectifByScaleByDiplomes,
  getEffectifNationalByDiplomes,
} from "./getTransformationStats.usecase";

describe("Feature:  Get Transformation Stats", () => {
  describe("Scenario: Getting the effectif for a region", () => {
    test("should return the sum of all effectifs when no filter on the codeNiveauDiplome is passed", () => {
      expect(getEffectifByScaleByDiplomes("01", "regions")).toBe(3751);
    });

    test("should return only the effectif for the codeNiveauDiplome passed", () => {
      expect(getEffectifByScaleByDiplomes("01", "regions", ["460"])).toBe(42);
    });

    test("should return the sum of all codeNiveauDiplome passed", () => {
      expect(
        getEffectifByScaleByDiplomes("01", "regions", ["321", "241"])
      ).toBe(30);
    });

    test("should return zero if the codeNiveauDiplome is not found", () => {
      expect(getEffectifByScaleByDiplomes("01", "regions", ["ABC"])).toBe(0);
    });
  });

  describe("Scenario: Getting the effectif for a departement", () => {
    test("should return the sum of all effectifs when no filter on the codeNiveauDiplome is passed", () => {
      expect(getEffectifByScaleByDiplomes("02A", "departements")).toBe(511);
    });
  });

  describe("Scenario: Getting the effectif for an academie", () => {
    test("should return the sum of all effectifs when no filter on the codeNiveauDiplome is passed", () => {
      expect(getEffectifByScaleByDiplomes("01", "academies")).toBe(13290);
    });
  });

  describe("Scenario: Getting the national effectifs", () => {
    test("should return the sum of all effectifs when no filters are passed", () => {
      expect(getEffectifNationalByDiplomes()).toBe(359650);
      expect(getEffectifNationalByDiplomes([])).toBe(359650);
    });

    test("should return the sum of all effectifs for one codeNiveauDiplome", () => {
      expect(getEffectifNationalByDiplomes(["500"])).toBe(59290);
    });

    test("should return the sum of all effectifs for one codeNiveauDiplome", () => {
      expect(getEffectifNationalByDiplomes(["10", "140"])).toBe(4420);
    });
  });
});
