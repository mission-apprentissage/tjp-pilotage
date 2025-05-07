
import type { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import {
  toHaveReceivedCommandWith,
} from "aws-sdk-client-mock-vitest";
import { randomUUID } from "crypto";
import type { FileType } from "shared/files/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ovhFileManagerFactory } from "@/modules/core/services/fileManager/ovhFileManager";
import { ovhFilePathManagerFactory } from "@/modules/core/services/filePathManager/ovhFilePathManager";

/* you can also run this in setupTests, see above */
expect.extend({ toHaveReceivedCommandWith });

const s3ClientMock = mockClient(S3Client);

describe("Ovh file manager", () => {
  let fileFixture: ReturnType<typeof fileManagerFixture>;

  beforeEach(() => {
    fileFixture = fileManagerFixture(s3ClientMock as unknown as S3Client);
    s3ClientMock.reset();
    vi.restoreAllMocks();
  });

  it("should list that no files are linked to the demande", async () => {
    // given
    const id = fileFixture.givenAnDemandeId();
    fileFixture.givenNoFileAreLinkedToTheDemande();

    // when
    await fileFixture.whenListingFiles(id);

    // then
    fileFixture.thenZeroFilesShouldBeListed();
  });

  it("should list that one file is linked to the demande", async () => {
    // given
    const id = fileFixture.givenAnDemandeId();
    fileFixture.givenNFilesIsLinkedToTheDemande([
      {
        filepath: `demandes/${id}/test.txt`,
        lastModified: new Date("2021-09-01T00:00:00Z"),
        size: 1024,
      },
    ]);

    // when
    await fileFixture.whenListingFiles(id);

    // then

    fileFixture.thenFileShouldBeListed(`demandes/${id}/test.txt`);
  });

  it("should list that one file is linked to the demande", async () => {
    // given
    const id = fileFixture.givenAnDemandeId();
    fileFixture.givenNFilesIsLinkedToTheDemande([
      {
        filepath: `intentions/${id}/test.txt`,
        lastModified: new Date("2021-09-01T00:00:00Z"),
        size: 1024,
      },
    ]);

    // when
    await fileFixture.whenListingFiles(id);

    // then

    fileFixture.thenFileShouldBeListed(`intentions/${id}/test.txt`);
  });
});

const fileManagerFixture = (client: S3Client) => {
  const fileManager = ovhFileManagerFactory({
    client,
  });
  const filepathManager = ovhFilePathManagerFactory();
  let files: FileType[] = [];
  return {
    givenAnDemandeId: () => {
      return `INTENTION_01`;
    },
    givenASimpleFileAsBuffer: () => {
      return Buffer.from("i'm the content of a file", "utf-8");
    },
    givenAFileIsExistingInDirectory: (id: string, filename: string) => {
      fileManager.uploadFile(
        filepathManager.getDemandeFilePath(id, filename),
        Buffer.from("i'm the content of a file", "utf-8")
      );
    },
    givenUploadWillResultWell: () => {
      s3ClientMock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: "request-01",
          extendedRequestId: "request-01",
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0,
        },
      });
    },
    givenNoFileAreLinkedToTheDemande: () => {
      s3ClientMock.on(ListObjectsV2Command).resolves({
        Contents: [],
        KeyCount: 0,
        $metadata: {
          httpStatusCode: 200,
          requestId: "request-01",
          extendedRequestId: "request-01",
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0,
        },
      } as ListObjectsV2CommandOutput);
    },
    givenNFilesIsLinkedToTheDemande: (
      files: {
        filepath: string;
        lastModified: Date;
        size: number;
      }[]
    ) => {
      s3ClientMock.on(ListObjectsV2Command).resolves({
        Contents: [
          ...files.map((file) => ({
            Key: file.filepath,
            LastModified: file.lastModified,
            Size: file.size,
          })),
        ],
        KeyCount: files.length,
        $metadata: {
          httpStatusCode: 200,
          requestId: randomUUID(),
          extendedRequestId: randomUUID(),
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0,
        },
      } as ListObjectsV2CommandOutput);
    },
    whenUploadingAFileAsBuffer: async (demandeId: string, filename: string, file: Buffer) => {
      await fileManager.uploadFile(filepathManager.getDemandeFilePath(demandeId, filename), file);
    },
    whenListingFiles: async (id: string) => {
      files = await fileManager.listFiles({
        filepath: filepathManager.getDemandeFilePath(id),
        legacyFilepath: filepathManager.getLegacyIntentionFilePath(id)
      });
    },
    whenGeneratingAnUrlForAFile: async (id: string, filename: string) => {
      return fileManager.getDownloadUrl({
        filepath: filepathManager.getDemandeFilePath(id, filename),
        legacyFilepath: filepathManager.getLegacyIntentionFilePath(id, filename)
      });
    },
    thenFileShouldBeUploaded: async (id: string, filename: string) => {
      files = await fileManager.listFiles({
        filepath: filepathManager.getDemandeFilePath(id, filename),
        legacyFilepath: filepathManager.getLegacyIntentionFilePath(id, filename)
      });
      expect(files).toContain(filename);
    },
    thenDeleteFile: (id: string, filename: string) => {
      fileManager.deleteFile({
        filepath: filepathManager.getDemandeFilePath(id, filename),
        legacyFilepath: filepathManager.getLegacyIntentionFilePath(id, filename)
      });
    },
    thenZeroFilesShouldBeListed: () => {
      expect(files.length).toBe(0);
    },
    thenFileShouldBeListed: (filepath: string) => {
      expect(files.filter((f) => f.path === filepath).length).toBeGreaterThan(0);
    },
  };
};
