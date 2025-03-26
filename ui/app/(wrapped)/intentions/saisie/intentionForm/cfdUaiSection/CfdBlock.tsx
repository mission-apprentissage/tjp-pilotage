import { Box, FormControl, FormErrorMessage, FormLabel, LightMode } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";

import { CfdAutocompleteInput } from "@/app/(wrapped)/intentions/saisie/components/CfdAutocomplete";
import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import type { DemandeMetadata } from "@/app/(wrapped)/intentions/saisie/types";
import type { Formation } from "@/app/(wrapped)/intentions/types";

export const CfdBlock = ({
  setDispositifs,
  setIsFCIL,
  formMetaData,
  disabled,
  campagne,
}: {
  setDispositifs: (info?: Formation["dispositifs"]) => void;
  setIsFCIL: (isFcil: boolean) => void;
  formMetaData?: DemandeMetadata;
  disabled: boolean;
  campagne?: CampagneType;
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <LightMode>
      <FormControl mb="4" isInvalid={!!errors.cfd?.message} isRequired w="100%" maxW="752px">
        <FormLabel htmlFor="cfd-autocomplete">Recherche d'un diplôme</FormLabel>
        <Box color="chakra-body-text">
          <Controller
            name="cfd"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CfdAutocompleteInput
                id="cfd-autocomplete"
                name={name}
                inError={!!errors.cfd}
                defaultValue={
                  value && formMetaData?.formation?.libelleFormation
                    ? {
                      value,
                      label: formMetaData?.formation?.libelleFormation,
                    }
                    : undefined
                }
                disabled={disabled}
                onChange={(selected) => {
                  onChange(selected?.value);
                  setDispositifs(selected?.dispositifs);
                  setIsFCIL(selected?.isFCIL ?? false);
                }}
                campagne={campagne}
              />
            )}
          />
          {errors.cfd && <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>}
        </Box>
      </FormControl>
    </LightMode>
  );
};
