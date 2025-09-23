import { Box, Flex, FormControl, FormErrorMessage, FormLabel, LightMode } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";

import { CfdAutocompleteInput } from "@/app/(wrapped)/demandes/saisie/components/CfdAutocomplete";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import type { DemandeMetadata , Formation } from "@/app/(wrapped)/demandes/types";
import { TooltipIcon } from "@/components/TooltipIcon";

export const CfdBlock = ({
  setDispositifs,
  setIsFCIL,
  setDateFermetureFormation,
  formMetaData,
  disabled,
  campagne
}: {
  setDispositifs: (info?: Formation["dispositifs"]) => void;
  setIsFCIL: (isFcil: boolean) => void;
  setDateFermetureFormation: (dateFermetureFormation?: string) => void;
  formMetaData?: DemandeMetadata;
  disabled: boolean;
  campagne?: CampagneType
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<DemandeFormType>();

  return (
    <LightMode>
      <FormControl mb="4" isInvalid={!!errors.cfd?.message} isRequired w="100%" maxW="752px">
        <Flex direction={"row"}>
          <FormLabel htmlFor="autocomplete-cfd">
            Recherche d'une spécialité, un intitulé de formation, un code diplôme...
          </FormLabel>
          <TooltipIcon
            label="Privilégiez les intitulés complets et n'utilisez pas d'acronymes ou d'abréviations pour une recherche efficace. "
          />
        </Flex>
        <Box color="chakra-body-text">
          <Controller
            name="cfd"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CfdAutocompleteInput
                id="autocomplete-cfd"
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
                  setDateFermetureFormation(selected?.dateFermeture);
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
