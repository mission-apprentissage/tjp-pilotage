import type { _Object } from "@aws-sdk/client-s3";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { FileManager, FileType } from "shared/files/types";

import config from "@/config";

function generateNewS3Client() {
  return new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
      accessKeyId: config.s3.accessKey!,
      secretAccessKey: config.s3.secretKey!,
    },
  });
}

const mapperToFileType = (content: _Object): FileType | undefined => {
  if (!content.Key || !content.Size || !content.LastModified) {
    return undefined;
  }

  const parts = content.Key.split("/");
  const filename = parts[parts.length - 1];
  const filenameParts = filename.split(".");
  const extension = filenameParts.pop(); // Remove and get the last element as the extension
  const nameWithoutExtension = filenameParts.join(".");

  return {
    path: content.Key,
    name: filename,
    nameWithoutExtension,
    extension: extension ?? "",
    type: "file",
    size: content.Size,
    lastModified: content.LastModified.toISOString(),
    isUploaded: true,
  };
};

export const ovhFileManagerFactory = (
  deps = {
    client: generateNewS3Client(),
  }
): FileManager => {
  return {
    uploadFile: async (filepath: string, file: Buffer) => {
      try {
        if (!filepath) {
          throw new Error(
            "Le chemin du fichier n'a pas été fourni pour l'ajout d'un fichier. Il doit contenir au moins le nom du fichier."
          );
        }

        const { $metadata } = await deps.client.send(
          new PutObjectCommand({
            Bucket: config.s3.bucket,
            Key: filepath,
            Body: file,
          })
        );

        console.log({ $metadata });
      } catch (error) {
        console.error(`Une erreur est survenue lors de l'ajout d'un fichier au dossier suivant: ${filepath}`, error);

        throw new Error((error as Error).message);
      }
    },
    listFiles: async (filepath: string): Promise<FileType[]> => {
      try {
        const listObjectsCommand = await deps.client.send(
          new ListObjectsV2Command({
            Bucket: config.s3.bucket,
            Prefix: filepath,
          })
        );

        if (!listObjectsCommand.Contents) {
          return [];
        }

        return listObjectsCommand.Contents.map(mapperToFileType).filter(Boolean) as FileType[];
      } catch (error) {
        console.error(
          `Une erreur est survenue lors de la récupération des fichiers du dossier suivant: ${filepath}`,
          error
        );

        throw new Error((error as Error).message);
      }
    },
    deleteFile: async (filepath: string) => {
      try {
        if (!filepath) {
          throw new Error("No filepath provided to delete file.");
        }

        await deps.client.send(
          new DeleteObjectCommand({
            Bucket: config.s3.bucket,
            Key: filepath,
          })
        );
      } catch (error) {
        console.error(`Une erreur est survenue lors de la suppression du fichier suivant: ${filepath}`, error);

        throw new Error((error as Error).message);
      }
    },
    getDownloadUrl: async (filepath: string): Promise<string> => {
      try {
        if (!filepath) {
          throw new Error("No filepath provided to get download url.");
        }

        const command = new GetObjectCommand({
          Bucket: config.s3.bucket,
          Key: filepath,
        });

        return getSignedUrl(deps.client, command, { expiresIn: 600 });
      } catch (error) {
        console.error(
          `Une erreur est survenue en générant l'url de téléchargement du fichier suivant: ${filepath}`,
          error
        );
        throw new Error((error as Error).message);
      }
    },
  };
};

export const ovhFileManager = ovhFileManagerFactory();
