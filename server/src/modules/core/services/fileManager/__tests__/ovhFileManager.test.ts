// eslint-disable-next-line import/no-extraneous-dependencies
import "aws-sdk-client-mock-vitest";

import type { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import type { FileType } from "shared/files/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ovhFileManagerFactory } from "@/modules/core/services/fileManager/ovhFileManager";
import { ovhFilePathManagerFactory } from "@/modules/core/services/filePathManager/ovhFilePathManager";

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
          requestId: "request-01",
          extendedRequestId: "request-01",
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
      files = await fileManager.listFiles(filepathManager.getDemandeFilePath(id));
    },
    whenGeneratingAnUrlForAFile: async (id: string, filename: string) => {
      return fileManager.getDownloadUrl(filepathManager.getDemandeFilePath(id, filename));
    },
    thenFileShouldBeUploaded: async (id: string, filename: string) => {
      files = await fileManager.listFiles(filepathManager.getDemandeFilePath(id, filename));
      expect(files).toContain(filename);
    },
    thenDeleteFile: (id: string, filename: string) => {
      fileManager.deleteFile(filepathManager.getDemandeFilePath(id, filename));
    },
    thenZeroFilesShouldBeListed() {
      expect(files.length).toBe(0);
    },
    thenFileShouldBeListed: (filepath: string) => {
      expect(files.filter((f) => f.path === filepath).length).toBe(1);
    },
  };
};
