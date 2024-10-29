import { Button, Flex, InputGroup, Text, useToken } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_IN_MB } from "shared";

export const ACCEPTED_FILES_TYPES =
  ".jpg,.jpeg,.png,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const validateFiles = (value?: FileList) => {
  if (!value || (value?.length ?? 0) < 1) {
    return undefined;
  }

  let errorMessage = "";

  for (const file of Array.from(value)) {
    if (file.size > MAX_FILE_SIZE) {
      errorMessage += `Le fichier ${file.name} est trop volumineux. La taille maximale est de ${MAX_FILE_SIZE_IN_MB} Mo. `;
    }
    if (file.name.search(/["';=]/) !== -1) {
      errorMessage += `Les caractères spéciaux " ' ; = ne sont pas autorisés dans les noms de fichiers. Veuillez changer le nom du fichier.`;
    }
  }

  return errorMessage.length > 0 ? errorMessage : true;
};

export const UploadField = ({
  setNewFiles,
  newFiles,
  disabled,
}: {
  setNewFiles: (files: FileList | null) => void;
  newFiles: File[];
  disabled: boolean;
}) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const greyColor = useToken("colors", "grey.425");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const validationError = validateFiles(files);

    if (typeof validationError === "string") {
      setError(validationError);
      setNewFiles(null);
    } else {
      setError(null);
      setNewFiles(files);
    }
  };

  return (
    <Flex direction={"column"}>
      <Text fontWeight={"bold"} mt={"42px"}>
        Ajouter des fichiers
      </Text>
      <Text color={greyColor} mt={"16px"}>
        Taille maximale de {MAX_FILE_SIZE_IN_MB} Mo. Formats supportés : .jpg, .jpeg, .png, .pdf, .doc, .docx Plusieurs
        fichiers possibles.
      </Text>
      <Text color={greyColor}>Vous pouvez ajouter des fichiers pour étayer votre demande</Text>
      <Flex direction={"row"} alignItems={"center"} mt={4}>
        <InputGroup onClick={() => fileInputRef.current?.click()} width={"auto"}>
          <input
            type={"file"}
            multiple={true}
            hidden
            accept={ACCEPTED_FILES_TYPES}
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={disabled}
          />
          <Button isDisabled={disabled}>Parcourir</Button>
        </InputGroup>
        <Flex ml={"8px"}>
          {!newFiles || newFiles.length === 0 ? (
            <Text color={greyColor}>Aucun fichier sélectionné.</Text>
          ) : (
            <Text color={greyColor}>
              {newFiles.length} nouveau{newFiles.length > 1 ? "x" : ""} fichier
              {newFiles.length > 1 ? "s" : ""}{" "}
            </Text>
          )}
        </Flex>
      </Flex>
      {!!error && (
        <Text mt={4} color={"red"}>
          {error}
        </Text>
      )}
    </Flex>
  );
};
