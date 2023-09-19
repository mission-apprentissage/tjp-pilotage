import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
  Select,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
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
  onSubmit: (values: PartialIntentionForms[1]) => void;
}) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IntentionForms[1]>({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  return (
    <LightMode>
      <FormControl
        mb="4"
        maxW="sm"
        isInvalid={!!errors.dispositifId}
        isRequired
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLabel>Dispositif</FormLabel>
        <Controller
          name="dispositifId"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field: { onChange, value, name } }) => (
            <Select
              value={value}
              name={name}
              bg={"white"}
              color="chakra-body-text"
              disabled={!options || !active}
              placeholder="Sélectionner une option"
              onChange={(selected) => {
                onChange(selected.target.value);
                onSubmit({
                  uai: defaultValues.uai,
                  cfd: defaultValues.cfd,
                  libelleDiplome: defaultValues.libelleDiplome,
                  dispositifId: selected.target.value,
                });
              }}
            >
              {options?.map(({ codeDispositif, libelleDispositif }) => (
                <option key={codeDispositif} value={codeDispositif}>
                  {libelleDispositif}
                </option>
              ))}
            </Select>
          )}
        />

        {errors.dispositifId && (
          <FormErrorMessage>{errors.dispositifId.message}</FormErrorMessage>
        )}
      </FormControl>
    </LightMode>
  );
};
