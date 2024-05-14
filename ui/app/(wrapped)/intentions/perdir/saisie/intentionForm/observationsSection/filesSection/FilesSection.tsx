import { Flex } from "@chakra-ui/react";

import { useIntentionFilesContext } from "./filesContext";
import { FilesField } from "./FilesField";
import { UploadField } from "./UploadField";

export const FilesSection = () => {
  const { newFiles, addNewFiles, files, deleteFile, downloadFile } =
    useIntentionFilesContext();

  return (
    <Flex
      direction={"column"}
      alignItems={"start"}
      justifyContent={"start"}
      rowGap={4}
    >
      <UploadField setNewFiles={addNewFiles} newFiles={newFiles} />
      <FilesField
        files={files}
        deleteFile={deleteFile}
        downloadFile={downloadFile}
      />
    </Flex>
  );
};
