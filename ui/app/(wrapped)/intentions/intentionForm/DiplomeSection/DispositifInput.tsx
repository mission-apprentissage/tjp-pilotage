import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms } from "../defaultFormValues";

export const DispositifInput = ({
  options,
}: {
  options?: ApiType<typeof api.searchDiplome>[number]["dispositifs"];
}) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms[2]>();

  return (
    <FormControl
      mb="4"
      maxW="500px"
      isInvalid={!!errors.dispositifId}
      isRequired
    >
      <FormLabel>Dispositif</FormLabel>
      <Select
        placeholder="Sélectionner une option"
        {...register("dispositifId", {
          required: "Le dispositif est obligatoire",
        })}
      >
        {options?.map(({ codeDispositif, libelleDispositif }) => (
          <option key={codeDispositif} value={codeDispositif}>
            {libelleDispositif}
          </option>
        ))}
      </Select>
      {errors.dispositifId && (
        <FormErrorMessage>{errors.dispositifId.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
