import { Flex, IconButton, Text, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { humanFileSize } from "shared/utils/humanFileSize";

import { LinkButton } from "@/components/LinkButton";

import { FileType } from "./types";

export const FilesField = ({
  files,
  deleteFile,
  downloadFile,
}: {
  files: FileType[];
  deleteFile: (file: FileType) => void;
  downloadFile: (file: FileType) => Promise<void>;
}) => {
  const greyColor = useToken("colors", "grey.425");

  return (
    <Flex direction="column" rowGap={6}>
      {files.map((file) => (
        <Flex key={file.name} direction={"column"} gap={1}>
          <Flex direction={"row"} gap={2} alignItems={"start"}>
            <LinkButton
              onClick={() => downloadFile(file)}
              rightIcon={<Icon icon="ri:download-line" />}
            >
              {file.nameWithoutExtension}
            </LinkButton>
            <IconButton
              variant="ghost"
              color={"bluefrance.113"}
              aria-label="Call Sage"
              fontSize={16}
              icon={<Icon icon="ri:delete-bin-5-line" />}
              width={"20px"}
              height={"20px"}
              onClick={() => deleteFile(file)}
            />
          </Flex>
          <Flex
            direction="row"
            gap={"2"}
            fontSize={"smaller"}
            color={greyColor}
          >
            <Text textTransform={"uppercase"}>{file.extension}</Text>-
            <Text>{humanFileSize(file.size)}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
