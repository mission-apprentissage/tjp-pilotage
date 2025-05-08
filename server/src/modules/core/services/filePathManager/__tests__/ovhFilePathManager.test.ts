import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { FilePathManager } from "@/modules/core/services/filePathManager/filePathManager";
import { ovhFilePathManagerFactory } from "@/modules/core/services/filePathManager/ovhFilePathManager";

describe("Core Service: Ovh file path manager", () => {
  let filePathManager: FilePathManager;

  beforeEach(() => {
    filePathManager = ovhFilePathManagerFactory();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should generate a path for a given demande id", () => {
    // given
    const id = "INTENTION_01";

    // when
    const path = filePathManager.getDemandeFilePath(id);

    // then
    expect(path).toBe(`demandes/${id}/`);
  });

  it("should generate a path for a given demande id", () => {
    // given
    const id = "INTENTION_01";

    // when
    const path = filePathManager.getDemandeFilePath(id, "exemple.pdf");

    // then
    expect(path).toBe(`demandes/${id}/exemple.pdf`);
  });

  it("should generate a path for a given legacy demande id", () => {
    // given
    const id = "INTENTION_01";

    // when
    const path = filePathManager.getLegacyIntentionFilePath(id, "exemple.pdf");

    // then
    expect(path).toBe(`intentions/${id}/exemple.pdf`);
  });
});
