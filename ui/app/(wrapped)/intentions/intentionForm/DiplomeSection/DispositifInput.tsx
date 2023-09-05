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
  cfdInfo,
}: {
  cfdInfo?: ApiType<typeof api.checkCfd>;
}) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms[2]>();

  const data = cfdInfo?.status === "valid" ? cfdInfo.data : undefined;

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
        {data?.dispositifs.map(({ codeDispositif, libelleDispositif }) => (
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
