import "@/config";

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn().mockResolvedValue(`---
Type d'indicateur: Exemple
Created by: Test
statut: validé
title: A Exemple
icon: ri:hand-heart-line
---
# A Exemple`),
  },
}));

import { getGlossaireEntry } from "@/modules/glossaire/usecases/getGlossaireEntry/getGlossaireEntry.usecase";

describe("getGlossaireEntry - Retrouver une entrée de glossaire depuis un slug", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Pour une entrée de glossaire existante", async () => {
    // When
    const result = await getGlossaireEntry("exemple");

    // Then
    expect(result).toEqual({
      title: "A Exemple",
      type: "Exemple",
      createdBy: "Test",
      status: "validé",
      icon: "ri:hand-heart-line",
      slug: "exemple",
      content: "# A Exemple",
    });
  });

  it("Pour une entrée de glossaire non existante", async () => {
    // When/Then
    await expect(getGlossaireEntry("non-existant")).rejects.toThrow(
      "Entrée de glossaire non trouvée: non-existant"
    );
  });
});
