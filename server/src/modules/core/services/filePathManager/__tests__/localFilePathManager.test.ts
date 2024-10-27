import type { FilePathManager } from "@/modules/core/services/filePathManager/filePathManager";
import { localFilePathManagerFactory } from "@/modules/core/services/filePathManager/localFilePathManager";

describe("Core Service: Local file path manager", () => {
  let filePathManager: FilePathManager;

  beforeEach(() => {
    filePathManager = localFilePathManagerFactory();
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
    expect(path).toBe(`./public/upload/${id}/`);
  });

  it("should generate a path with a filename", () => {
    // given
    const id = "INTENTION_02";
    const filename = "test.txt";

    // when
    const path = filePathManager.getIntentionFilePath(id, filename);

    // then
    expect(path).toBe(`./public/upload/${id}/test.txt`);
  });
});
