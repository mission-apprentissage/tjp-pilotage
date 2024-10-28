import { FormControl, FormErrorMessage, FormLabel, LightMode, Select } from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { client } from "@/api.client";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const DispositifBlock = ({
  disabled,
  options,
}: {
  disabled: boolean;
  options?: (typeof client.infer)["[GET]/diplome/search/:search"][number]["dispositifs"];
}) => {
  const {
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<IntentionForms>();

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "cfd") return;
        setValue("codeDispositif", "");
      }).unsubscribe
  );

  return (
    <LightMode>
      <FormControl mb="4" w="100%" maxW="752px" isInvalid={!!errors.codeDispositif} isRequired>
        <FormLabel>Dispositif</FormLabel>
        <Controller
          name="codeDispositif"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field: { onChange, value, name } }) => (
            <Select
              value={value}
              name={name}
              bg={"white"}
              color="chakra-body-text"
              disabled={!options || disabled}
              placeholder="Sélectionner une option"
              onChange={(selected) => {
                onChange(selected.target.value);
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

        {errors.codeDispositif && <FormErrorMessage>{errors.codeDispositif.message}</FormErrorMessage>}
      </FormControl>
    </LightMode>
  );
};
