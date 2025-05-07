import { Box, FormControl, FormLabel, LightMode } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { UaiAutocomplete } from "@/app/(wrapped)/demandes/saisie/components/UaiAutocomplete";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import type { DemandeMetadata , Etablissement } from "@/app/(wrapped)/demandes/types";

export const UaiBlock = ({
  disabled,
  formMetadata,
  setUaiInfo,
}: {
  disabled: boolean;
  formMetadata?: DemandeMetadata;
  setUaiInfo: (uaiInfo?: Etablissement) => void;
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<DemandeFormType>();

  return (
    <LightMode>
      <FormControl isInvalid={!!errors.uai} mb="auto" isRequired>
        <FormLabel htmlFor="autocomplete-uai">Recherche d'un établissement</FormLabel>
        <Box color="chakra-body-text">
          <Controller
            name="uai"
            control={control}
            rules={{ required: "Ce champ est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <UaiAutocomplete
                id="autocomplete-uai"
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
