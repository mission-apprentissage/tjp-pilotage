import { describe, expect, it } from "vitest";

import { rentreeScolaireCampagnes } from "../rentreeScolaireCampagnes";

describe("rentreeScolaireCampagnes", () => {
  it("should return the correct rentreeScolaireCampagnes", () => {
    expect(rentreeScolaireCampagnes()).toEqual(["2024", "2025"]);
  });

  it("should return the correct rentreeScolaireCampagnes with custom start and end", () => {
    expect(rentreeScolaireCampagnes("2022", "2026")).toEqual(["2023", "2024", "2025", "2026", "2027"]);
  });
});


