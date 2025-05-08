import type { _Object } from "@aws-sdk/client-s3";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
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
    listFiles: async (
      { filepath, legacyFilepath }: { filepath: string; legacyFilepath?: string }
    ): Promise<FileType[]> => {
      const fetchFilesFromPath = async (path: string): Promise<FileType[]> => {
        try {
          const listObjectsCommand = await deps.client.send(
            new ListObjectsV2Command({
              Bucket: config.s3.bucket,
              Prefix: path,
            })
          );

          if (!listObjectsCommand.Contents) {
            return [];
          }

          return listObjectsCommand.Contents.map(mapperToFileType).filter(Boolean) as FileType[];
        } catch (error) {
          console.error(
            `Une erreur est survenue lors de la récupération des fichiers du dossier suivant: ${path}`,
            error
          );
          throw new Error((error as Error).message);
        }
      };

      try {
        const filesFromFilepath = await fetchFilesFromPath(filepath);
        const filesFromLegacyFilepath = legacyFilepath ? await fetchFilesFromPath(legacyFilepath) : [];

        return [...filesFromFilepath, ...filesFromLegacyFilepath];
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    deleteFile: async (
      { filepath, legacyFilepath} :
      { filepath: string, legacyFilepath?: string}
    ) => {
      try {
        if (!filepath) {
          throw new Error("No filepath provided to delete file.");
        }
        try {
          await deps.client.send(
            new DeleteObjectCommand({
              Bucket: config.s3.bucket,
              Key: filepath,
            })
          );
        }
        catch (filepathError) {
          console.warn(`File not found at filepath: ${filepath}. Trying ${legacyFilepath}`, filepathError);

          await deps.client.send(
            new DeleteObjectCommand({
              Bucket: config.s3.bucket,
              Key: legacyFilepath,
            })
          );
        }
      } catch (error) {
        console.error(`Une erreur est survenue lors de la suppression du fichier suivant: ${filepath}`, error);

        throw new Error((error as Error).message);
      }
    },
    getDownloadUrl: async (
      { filepath, legacyFilepath} :
      { filepath: string, legacyFilepath?: string}
    ): Promise<string> => {
      const generateDownloadCommand = async (path: string): Promise<GetObjectCommand> => {
        if (!path) {
          throw new Error("No filepath provided to get download url.");
        }

        const command = new GetObjectCommand({
          Bucket: config.s3.bucket,
          Key: path,
        });
        return command;
      };

      try {
        const command = await generateDownloadCommand(filepath);
        // Essayez d'abord avec le chemin principal
        await deps.client.send(command);
        return getSignedUrl(deps.client, command, { expiresIn: 600 });
      }
      catch (error) {
        if (error instanceof NoSuchKey) {
          // Si le chemin principal échoue et que legacyFilepath est fourni, essayez avec legacyFilepath
          if (legacyFilepath) {
            const command = await generateDownloadCommand(legacyFilepath);
            // Essayez d'abord avec le chemin principal
            await deps.client.send(command);
            return getSignedUrl(deps.client, command, { expiresIn: 600 });
          }
        }
        throw new Error((error as Error).message);
      }
    }
  };
};

export const ovhFileManager = ovhFileManagerFactory();
