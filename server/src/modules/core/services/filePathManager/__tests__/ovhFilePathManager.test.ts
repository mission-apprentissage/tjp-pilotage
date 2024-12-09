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

  it("should generate a path for a given intention id", () => {
    // given
    const id = "INTENTION_01";

    // when
    const path = filePathManager.getIntentionFilePath(id);

    // then
    expect(path).toBe(`intentions/${id}/`);
  });

  it("should generate a path for a given intention id", () => {
    // given
    const id = "INTENTION_01";

    // when
    const path = filePathManager.getIntentionFilePath(id, "exemple.pdf");

    // then
    expect(path).toBe(`intentions/${id}/exemple.pdf`);
  });
});
