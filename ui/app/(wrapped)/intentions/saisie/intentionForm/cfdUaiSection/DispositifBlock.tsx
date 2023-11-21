import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
  Select,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { client } from "@/api.client";

import { IntentionForms } from "../defaultFormValues";

export const DispositifBlock = ({
  active,
  options,
}: {
  active: boolean;
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
        setValue("dispositifId", "");
      }).unsubscribe
  );

  return (
    <LightMode>
      <FormControl
        mb="4"
        w="100%"
        maxW="752px"
        isInvalid={!!errors.dispositifId}
        isRequired
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
