import { Box, FormControl, FormLabel, LightMode } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { client } from "@/api.client";

import { UaiAutocomplete } from "../../components/UaiAutocomplete";
import { IntentionForms } from "../defaultFormValues";

export const UaiBlock = ({
  disabled,
  formMetadata,
  setUaiInfo,
}: {
  disabled: boolean;
  formMetadata?: (typeof client.infer)["[GET]/intention/:numero"]["metadata"];
  setUaiInfo: (
    uaiInfo:
      | (typeof client.infer)["[GET]/etablissement/perdir/search/:search"][number]
      | undefined
  ) => void;
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <LightMode>
      <FormControl isInvalid={!!errors.uai} mb="auto" isRequired>
        <FormLabel>Recherche d'un établissement</FormLabel>
        <Box color="chakra-body-text">
          <Controller
            name="uai"
            control={control}
            rules={{ required: "Ce champ est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <UaiAutocomplete
                name={name}
                disabled={disabled}
                inError={!!errors.uai}
                defaultValue={
                  formMetadata?.etablissement?.libelleEtablissement && value
                    ? {
                        label: formMetadata?.etablissement.libelleEtablissement,
                        value: value,
                        commune: formMetadata?.etablissement.commune,
                      }
                    : undefined
                }
                onChange={(v) => {
                  setUaiInfo(v);
                  onChange(v?.value);
                }}
              />
            )}
          />
        </Box>
      </FormControl>
    </LightMode>
  );
};
