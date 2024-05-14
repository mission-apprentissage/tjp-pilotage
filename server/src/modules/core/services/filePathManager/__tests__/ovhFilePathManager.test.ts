import { FilePathManager } from "../filePathManager";
import { ovhFilePathManagerFactory } from "../ovhFilePathManager";

describe("Core Service: Ovh file path manager", () => {
  let filePathManager: FilePathManager;

  beforeEach(() => {
    filePathManager = ovhFilePathManagerFactory();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
