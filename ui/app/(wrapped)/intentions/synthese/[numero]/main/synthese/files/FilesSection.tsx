import { Flex, Img, Text, useToast, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { humanFileSize } from "shared/utils/humanFileSize";

import { client } from "@/api.client";

import type { FileType } from "./types";

const useFilesSection = (numero: string) => {
  const toast = useToast();
  const { isLoading: isLoadingFiles, data: uploadedFiles } = client
    .ref("[GET]/intention/:numero/files")
    .useQuery({ params: { numero } }, { enabled: !!numero });

  const downloadFile = async (file: FileType) => {
    try {
      const { url } = await client.ref("[GET]/intention/:numero/files/url").query({
        params: { numero: numero },
        query: { filename: file.name },
      });

      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
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

  return { isLoadingFiles, uploadedFiles, downloadFile };
};

export const FilesSection = ({ numero }: { numero: string }) => {
  const [grey, blue] = useToken("colors", ["grey.425", "bluefrance.113"]);
  const { isLoadingFiles, uploadedFiles, downloadFile } = useFilesSection(numero);

  if (isLoadingFiles || !uploadedFiles?.files?.length) {
    return null;
  }

  return (
    <Flex direction={"column"} gap={2} bgColor={"blueecume.975"} p={4} h="fit-content" width={"100%"}>
      <Text fontWeight={700}>{uploadedFiles?.files.length === 1 ? "Pièce jointe" : "Pièces jointes"}</Text>
      {uploadedFiles.files.map((file) => (
        <Flex
          direction={"row"}
          key={`${file.name}`}
          bgColor="white"
          padding={"12px"}
          width={"100%"}
          whiteSpace={"nowrap"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          <Flex flex={"0 0 50px"}>
            <Img src={"/illustrations/piece-jointe-visualization.svg"} height={"50px"} width={"auto"} />
          </Flex>
          <Flex direction={"column"} width="100%" justifyContent={"space-between"} minW={0}>
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {file.nameWithoutExtension}
            </Text>
            <Flex direction={"row"} justify={"space-between"} alignItems={"center"}>
              <Text color={grey}>{`${file.extension.toLocaleUpperCase()} - ${humanFileSize(file.size)}`}</Text>
              <Icon icon="ri:download-line" color={blue} cursor={"pointer"} onClick={async () => downloadFile(file)} />
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
