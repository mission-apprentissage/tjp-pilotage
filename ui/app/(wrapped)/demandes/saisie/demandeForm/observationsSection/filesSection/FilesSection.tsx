import { Flex } from "@chakra-ui/react";

import { useDemandeFilesContext } from "./filesContext";
import { FilesField } from "./FilesField";
import { UploadField } from "./UploadField";

export const FilesSection = ({ disabled }: { disabled?: boolean }) => {
  const { newFiles, addNewFiles, files, deleteFile, downloadFile } = useDemandeFilesContext();

  return (
    <Flex direction={"column"} alignItems={"start"} justifyContent={"start"} rowGap={4}>
      <UploadField setNewFiles={addNewFiles} newFiles={newFiles} disabled={disabled} />
      <FilesField files={files} deleteFile={deleteFile} downloadFile={downloadFile} disabled={disabled} />
    </Flex>
  );
};
