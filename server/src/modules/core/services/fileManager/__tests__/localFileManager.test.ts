import path from "node:path";

import * as fs from "fs";

import { FilePathManager } from "../../filePathManager/filePathManager";
import { localFilePathManagerFactory } from "../../filePathManager/localFilePathManager";
import { FileManager, FileType } from "../fileManager";
import { localFileManagerFactory } from "../localFileManager";

describe("Core Service: Local file manager", () => {
  let fileFixture: ReturnType<typeof fileManagerFixture>;

  beforeEach(() => {
    fileFixture = fileManagerFixture(
      localFileManagerFactory(),
      localFilePathManagerFactory()
    );
  });

  afterEach(async () => {
    jest.restoreAllMocks();

    await fileFixture.thenDeleteFile(
      fileFixture.givenAnIntentionId(),
      "test.txt"
    );
    await fileFixture.thenDeleteFile(
      fileFixture.givenAnIntentionId(),
      "test-1.txt"
    );
  });

  it("should list that no files are linked to the demande", async () => {
    // given
    const id = fileFixture.givenAnIntentionId();

    // when
    await fileFixture.whenListingFiles(id);

    // then
    fileFixture.thenExpectFilesToBeEmpty();
  });

  it("should list that one file is linked to the demande", async () => {
    // given
    const id = fileFixture.givenAnIntentionId();
    fileFixture.givenAFileIsExistingInDirectory(id, "test.txt");

    // when
    await fileFixture.whenListingFiles(id);

    // then
    fileFixture.thenExpectFilesToBeLength(1);
    fileFixture.thenExpectFileToBeExisting(
      "test.txt",
      `public/upload/INTENTION_TEST/test.txt`,
      25
    );
  });
});

const fileManagerFixture = (
  fileManager: FileManager,
  filePathManager: FilePathManager
) => {
  let files: FileType[] = [];

  return {
    givenAnIntentionId: () => {
      return `INTENTION_TEST`;
    },
    givenASimpleFileAsBuffer: () => {
      return Buffer.from("i'm the content of a file", "utf-8");
    },
    givenAFileIsExistingInDirectory: (id: string, filename: string) => {
      const filepath = filePathManager.getIntentionFilePath(id, filename);
      const folderPath = path.dirname(filepath);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(filepath, "i'm the content of a file", {
        encoding: "utf8",
        flag: "w",
      });
    },
    whenUploadingAFileAsBuffer: async (
      demandeId: string,
      filename: string,
      file: Buffer
    ) => {
      const flname = filePathManager.getIntentionFilePath(demandeId, filename);

      await fileManager.uploadFile(flname, file);
    },
    whenListingFiles: async (id: string) => {
      const listedFiles = await fileManager.listFiles(
        filePathManager.getIntentionFilePath(id)
      );

      files = listedFiles;
    },
    thenDeleteFile: async (id: string, filename: string) => {
      await fileManager.deleteFile(
        filePathManager.getIntentionFilePath(id, filename)
      );
    },
    thenExpectFilesToBeEmpty() {
      expect(files).toEqual([]);
    },
    thenExpectFileToBeExisting(name: string, path: string, size: number) {
      const file = files.find((f) => f.name === name);

      expect(file).toBeTruthy();
      expect(file!.path).toBe(path);
      expect(file!.size).toBe(size);
    },
    thenExpectFilesToBeLength(length: number) {
      expect(files.length).toBe(length);
    },
  };
};
