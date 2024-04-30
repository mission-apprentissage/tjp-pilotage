import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  InputGroup,
  Text,
  useToken,
} from "@chakra-ui/react";
import { ReactNode, useRef } from "react";
import { useFormContext, UseFormRegisterReturn } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const MAX_FILE_SIZE = 1 * 1024 * 1024;
export const ACCEPTED_FILES_TYPES =
  ".jpg,.jpeg,.png,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type FileUploadProps = {
  register: UseFormRegisterReturn;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
};

const FileUpload = ({
  register,
  accept,
  multiple,
  children,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick} width={"auto"}>
      <input
        type={"file"}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
      />
      <>{children}</>
    </InputGroup>
  );
};

const validateFiles = (value?: FileList) => {
  console.log("validateFiles", value);

  if (!value || (value?.length ?? 0) < 1) {
    return undefined;
    // return "Au moins un fichier est requis.";
  }

  console.log("validateFiles", value);

  for (const file of Array.from(value)) {
    if (file.size > MAX_FILE_SIZE) {
      return `Le fichier ${
        file.name
      } est trop volumineux. La taille maximale est de ${
        MAX_FILE_SIZE / (1024 * 1024)
      } Mo.`;
    }
  }
  return true;
};

export const UploadFileField = () => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<IntentionForms>();

  const files = watch("files");
  const greyColor = useToken("colors", "grey.425");

  console.log({ errors });

  return (
    <>
      <Text fontWeight={"bold"} mt={"42px"}>
        Ajouter des fichiers
      </Text>
      <Text color={greyColor} mt={"16px"}>
        Taille maximale de {MAX_FILE_SIZE / (1024 * 1024)} Mo. Formats supportés
        : .jpg, .jpeg, .png, .pdf, .doc, .docx Plusieurs fichiers possibles.
      </Text>
      <Text color={greyColor}>
        Vous pouvez ajouter des fichiers pour étayer votre demande
      </Text>
      <FormControl isInvalid={!!errors.files} mt={"16px"}>
        <Flex direction={"row"} alignItems={"center"}>
          <FileUpload
            accept={ACCEPTED_FILES_TYPES}
            multiple
            register={register("files", {
              validate: validateFiles,
              required: false,
            })}
          >
            <Button>Parcourir</Button>
          </FileUpload>
          <Flex ml={"8px"}>
            {!files || files.length === 0 ? (
              <Text color={greyColor}>Aucun fichier sélectionné.</Text>
            ) : (
              <Text color={greyColor}>
                {files.length} fichier{files.length > 1 ? "s" : ""} sélectionné
              </Text>
            )}
          </Flex>
        </Flex>
        <FormErrorMessage>
          {errors.files && errors?.files.message}
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
