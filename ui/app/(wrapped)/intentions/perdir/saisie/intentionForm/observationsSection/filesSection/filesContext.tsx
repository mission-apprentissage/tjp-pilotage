import type { ToastId, UseToastOptions } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { client } from "@/api.client";

import type { FileType } from "./types";

type IntentionFilesContext = {
  deleteFile: (file: FileType) => void;
  addNewFiles: (files: FileList | null) => void;
  files: FileType[];
  newFiles: File[];
  handleFiles: (numero: string) => Promise<void>;
  isLoadingFiles: boolean;
  isUploadingFiles: boolean;
  isDeletingFiles: boolean;
  downloadFile: (file: FileType) => Promise<void>;
};

const mapFileToFileType = (file: File): FileType => {
  return {
    name: file.name,
    extension: file.name.split(".").pop() ?? "",
    nameWithoutExtension: file.name.split(".").slice(0, -1).join("."),
    size: file.size,
    isUploaded: false,
    lastModified: `${file.lastModified}`,
    type: "file",
  } as FileType;
};

export const IntentionFilesContext = createContext<IntentionFilesContext>({} as IntentionFilesContext);

const useGetFiles = (numero: string | undefined) => {
  const { isLoading: isLoadingFiles, data: uploadedFiles } = client
    .ref("[GET]/intention/:numero/files")
    .useQuery({ params: { numero: numero! } }, { enabled: !!numero });

  return { isLoadingFiles, uploadedFiles };
};

const useUploadFiles = (numberOfFiles: number) => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>();

  const { isLoading: isUploadingFiles, mutateAsync: uploadFiles } = client
    .ref("[PUT]/intention/:numero/files")
    .useMutation({
      onSuccess: () => {
        const toastContent: UseToastOptions = {
          status: "success",
          title: numberOfFiles > 1 ? "Fichiers envoyés avec succès" : "Fichier envoyé avec succès",
          variant: "left-accent",
        };
        if (toastIdRef.current) {
          toast.update(toastIdRef.current, toastContent);
        } else {
          toastIdRef.current = toast(toastContent);
        }
      },
      onError: (e) => {
        const toastContent: UseToastOptions = {
          status: "error",
          title:
            numberOfFiles > 1
              ? `Une erreur est survenue lors de l'envoi des fichiers`
              : `Une erreur est survenue lors de l'envoi du fichier`,
          description: e.message,
          variant: "left-accent",
        };

        if (toastIdRef.current) {
          toast.update(toastIdRef.current, toastContent);
        } else {
          toastIdRef.current = toast(toastContent);
        }
      },
      onMutate: () => {
        const toastContent: UseToastOptions = {
          status: "info",
          title: numberOfFiles > 1 ? "Envoi des fichiers en cours" : "Envoi du fichier en cours",
          variant: "left-accent",
        };

        if (toastIdRef.current) {
          toast.update(toastIdRef.current, toastContent);
        } else {
          toastIdRef.current = toast(toastContent);
        }
      },
    });

  return { isUploadingFiles, uploadFiles };
};

const useDeleteFiles = (numberOfFiles: number) => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>();

  const { isLoading: isDeletingFiles, mutateAsync: deleteFiles } = client
    .ref("[DELETE]/intention/:numero/files")
    .useMutation({
      onSuccess: () => {
        const toastContent: UseToastOptions = {
          status: "success",
          title:
            numberOfFiles > 1 ? "Les fichiers ont correctement été supprimé" : "Le fichier a correctement été supprimé",
          variant: "left-accent",
        };

        if (toastIdRef.current) {
          toast.update(toastIdRef.current, toastContent);
        } else {
          toastIdRef.current = toast(toastContent);
        }
      },
      onError: (e) => {
        const toastContent: UseToastOptions = {
          status: "error",
          title:
            numberOfFiles > 1
              ? "Une erreur est survenue lors de la suppression des fichiers"
              : "Une erreur est survenue lors de la suppression du fichier",
          description: e.message,
          variant: "left-accent",
        };

        if (toastIdRef.current) {
          toast.update(toastIdRef.current, toastContent);
        } else {
          toastIdRef.current = toast(toastContent);
        }
      },
      onMutate: () => {
        const toastContent: UseToastOptions = {
          status: "info",
          title: numberOfFiles > 1 ? "Suppression des fichiers en cours" : "Suppression du fichier en cours",
          variant: "left-accent",
        };

        if (toastIdRef.current) {
          toast.update(toastIdRef.current, toastContent);
        } else {
          toastIdRef.current = toast(toastContent);
        }
      },
    });

  return {
    isDeletingFiles,
    deleteFiles,
  };
};

export const IntentionFilesProvider = ({ children, numero }: { readonly children: ReactNode; numero?: string }) => {
  const toast = useToast();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<FileType[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);

  const { isLoadingFiles, uploadedFiles } = useGetFiles(numero);
  const { isUploadingFiles, uploadFiles } = useUploadFiles(newFiles.length);
  const { isDeletingFiles, deleteFiles } = useDeleteFiles(deletedFiles.length);

  const deleteFile = (file: FileType) => {
    if (file.isUploaded) {
      setDeletedFiles([...deletedFiles, file]);
      setFiles(files.filter((f) => f.name !== file.name));
    } else {
      setNewFiles(newFiles.filter((newFile) => newFile.name !== file.name));
    }
  };

  const addNewFiles = (files: FileList | null) => {
    setNewFiles((f) => [...f, ...Array.from(files ?? [])]);
  };

  const handleFiles = async (numero: string) => {
    if (newFiles.length > 0) {
      const formData = new FormData();

      Array.from(newFiles).map((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      await uploadFiles({ body: formData, params: { numero } });
    }

    if (deletedFiles.length > 0) {
      await deleteFiles({ params: { numero }, body: { files: deletedFiles } });
    }
  };

  const downloadFile = async (file: FileType) => {
    try {
      let fileUrl = undefined;

      if (numero && file.isUploaded) {
        const { url } = await client.ref("[GET]/intention/:numero/files/url").query({
          params: { numero: numero },
          query: { filename: file.name },
        });
        fileUrl = url;
      } else {
        const fileToDownload = newFiles.find((f) => f.name === file.name);

        if (fileToDownload) {
          fileUrl = URL.createObjectURL(fileToDownload);
        }
      }

      if (fileUrl) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = file.name; // Suggest a filename for download
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: "Une erreur est survenue lors du téléchargement du fichier",
        variant: "left-accent",
      });
    }
  };

  useEffect(() => {
    setFiles([...(uploadedFiles?.files ?? []), ...newFiles.map(mapFileToFileType)]);
  }, [uploadedFiles, newFiles]);

  const value = useMemo(
    () => ({
      files,
      deleteFile,
      newFiles,
      addNewFiles,
      handleFiles,
      isLoadingFiles,
      isUploadingFiles,
      isDeletingFiles,
      downloadFile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, deleteFile, newFiles, addNewFiles, isLoadingFiles, isUploadingFiles, isDeletingFiles, downloadFile]
  );

  return <IntentionFilesContext.Provider value={value}>{children}</IntentionFilesContext.Provider>;
};

export const useIntentionFilesContext = () => useContext(IntentionFilesContext);
