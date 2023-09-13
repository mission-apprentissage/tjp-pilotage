import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";

export const DispositifBlock = ({
  active,
  options,
  defaultValues,
  onSubmit,
}: {
  active: boolean;
  options?: ApiType<typeof api.searchDiplome>[number]["dispositifs"];
  defaultValues: PartialIntentionForms[1];
  onSubmit: (values: {
    uai?: string;
    cfd?: string;
    dispositifId?: string;
  }) => void;
}) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<IntentionForms[1]>({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  return (
    <LightMode>
      <FormControl
        mb="4"
        maxW="500px"
        isInvalid={!!errors.dispositifId}
        isRequired
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLabel>Dispositif</FormLabel>
        <Select
          bg={"white"}
          color="chakra-body-text"
          disabled={!options || !active}
          placeholder="Sélectionner une option"
          {...register("dispositifId", {
            required: "Le dispositif est obligatoire",
          })}
          onChange={(selected) => {
            if (selected) {
              onSubmit({
                uai: defaultValues.uai,
                cfd: defaultValues.cfd,
                dispositifId: selected.target.value,
              });
            }
          }}
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
    </LightMode>
  );
};
