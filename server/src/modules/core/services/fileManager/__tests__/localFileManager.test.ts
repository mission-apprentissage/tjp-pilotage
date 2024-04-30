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

  // it("should upload a file to local directory", async () => {
  //   // given
  //   const id = fileFixture.givenAnIntentionId();
  //   const fileBuffer = fileFixture.givenASimpleFileAsBuffer();

  //   // when
  //   await fileFixture.whenUploadingAFileAsBuffer(id, "test.txt", fileBuffer);

  //   // then
  //   fileFixture.thenFileShouldBeUploaded(id, "test.txt");
  // });

  it("should list that no files are linked to the demande", async () => {
    // given
    const id = fileFixture.givenAnIntentionId();

    // when
    await fileFixture.whenListingFiles(id);

    // then
    await fileFixture.thenFilesShouldBeEmpty();
  });

  it("should list that one file is linked to the demande", async () => {
    // given
    const id = fileFixture.givenAnIntentionId();
    fileFixture.givenAFileIsExistingInDirectory(id, "test.txt");

    // when
    await fileFixture.whenListingFiles(id);

    // then
    await fileFixture.thenFilesShoulBeLength(1);
    await fileFixture.thenFileShouldBeExisting(
      "test",
      `public/upload/INTENTION_01/test.txt`,
      "25 B"
    );
  });

  // it("should list that two files are linked to the demande", async () => {
  //   // given
  //   const id = fileFixture.givenAnIntentionId();
  //   fileFixture.givenAFileIsExistingInDirectory(id, "test.txt");
  //   fileFixture.givenAFileIsExistingInDirectory(id, "test-1.txt");

  //   // when
  //   const files = await fileFixture.whenListingFiles(id);

  //   // then
  //   expect(files.length).toBe(2);
  // });
});

const fileManagerFixture = (
  fileManager: FileManager,
  filePathManager: FilePathManager
) => {
  let files: FileType[] = [];

  return {
    givenAnIntentionId: () => {
      return `INTENTION_01`;
    },
    givenASimpleFileAsBuffer: () => {
      return Buffer.from("i'm the content of a file", "utf-8");
    },
    givenAFileIsExistingInDirectory: (id: string, filename: string) => {
      const folderPath = filePathManager.getIntentionFilePath(id);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(filePathManager.getIntentionFilePath(id));
      }

      const flm = filePathManager.getIntentionFilePath(id, filename);
      fs.writeFileSync(flm, "i'm the content of a file", {
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

      console.log("filename", flname);

      await fileManager.uploadFile(flname, file);
    },
    whenListingFiles: async (id: string) => {
      files = await fileManager.listFiles(
        filePathManager.getIntentionFilePath(id)
      );
    },
    thenFileShouldBeUploaded: (id: string, filename: string) => {
      expect(
        fs.existsSync(filePathManager.getIntentionFilePath(id, filename))
      ).toBe(true);
    },
    thenDeleteFile: async (id: string, filename: string) => {
      await fileManager.deleteFile(
        filePathManager.getIntentionFilePath(id, filename)
      );
    },
    thenFilesShouldBeEmpty() {
      expect(files).toEqual([]);
    },
    thenFileShouldBeExisting(name: string, path: string, size: string) {
      const file = files.find((f) => f.name === name);

      expect(file).toBeTruthy();
      expect(file!.path).toBe(path);
      expect(file!.size).toBe(size);
    },
    thenFilesShoulBeLength(length: number) {
      expect(files.length).toBe(length);
    },
  };
};
