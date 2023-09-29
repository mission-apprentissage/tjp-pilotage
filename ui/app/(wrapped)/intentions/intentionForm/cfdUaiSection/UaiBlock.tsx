import { Box, FormControl, FormLabel, LightMode } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { UaiAutocomplete } from "../../components/UaiAutocomplete";
import { IntentionForms } from "../defaultFormValues";

export const UaiBlock = ({
  active,
  formMetadata,
  setUaiInfo,
}: {
  active: boolean;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
  setUaiInfo: (
    uaiInfo: ApiType<typeof api.searchEtab>[number] | undefined
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
                active={active}
                inError={!!errors.uai}
                defaultValue={
                  formMetadata?.etablissement?.libelle && value
                    ? {
                        label: formMetadata?.etablissement.libelle,
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
