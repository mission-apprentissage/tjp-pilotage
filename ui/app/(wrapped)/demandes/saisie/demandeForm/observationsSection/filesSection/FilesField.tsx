import { Flex, IconButton, Text, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { humanFileSize } from "shared/utils/humanFileSize";

import { LinkButton } from "@/components/LinkButton";

import type { FileType } from "./types";

export const FilesField = ({
  files,
  deleteFile,
  downloadFile,
  disabled,
}: {
  files: FileType[];
  deleteFile: (file: FileType) => void;
  downloadFile: (file: FileType) => Promise<void>;
  disabled?: boolean;
}) => {
  const greyColor = useToken("colors", "grey.425");

  return (
    <Flex direction="column" rowGap={6} maxWidth={"100%"}>
      {files.map((file) => (
        <Flex key={file.name} direction={"column"} gap={1}>
          <Flex direction={"row"} gap={2} alignItems={"start"}>
            <LinkButton onClick={async () => downloadFile(file)} rightIcon={<Icon icon="ri:download-line" />}>
              <Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"}>
                {file.nameWithoutExtension}
              </Text>
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
              disabled={disabled}
            />
          </Flex>
          <Flex direction="row" gap={"2"} fontSize={"smaller"} color={greyColor}>
            <Text textTransform={"uppercase"}>{file.extension}</Text>-<Text>{humanFileSize(file.size)}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
