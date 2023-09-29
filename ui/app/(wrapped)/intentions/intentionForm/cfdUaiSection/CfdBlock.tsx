import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { CfdAutocompleteInput } from "../../components/CfdAutocomplete";
import { IntentionForms } from "../defaultFormValues";

export const CfdBlock = ({
  setDispositifs,
  formMetaData,
  active,
}: {
  setDispositifs: (
    info?: ApiType<typeof api.searchDiplome>[number]["dispositifs"]
  ) => void;
  formMetaData?: ApiType<typeof api.getDemande>["metadata"];
  active: boolean;
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<IntentionForms>();

  return (
    <LightMode>
      <FormControl
        mb="4"
        isInvalid={!!errors.cfd?.message}
        isRequired
        w="100%"
        maxW="752px"
      >
        <FormLabel>Recherche d'un diplôme</FormLabel>
        <Box color="chakra-body-text">
          <Controller
            name="cfd"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CfdAutocompleteInput
                name={name}
                inError={errors.cfd ? true : false}
                defaultValue={
                  value && formMetaData?.formation?.libelle
                    ? {
                        value,
                        label: formMetaData?.formation?.libelle,
                      }
                    : undefined
                }
                active={active}
                onChange={(selected) => {
                  onChange(selected?.value);
                  setDispositifs(selected?.dispositifs);
                }}
              />
            )}
          />
          {errors.cfd && (
            <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>
          )}
        </Box>
      </FormControl>
    </LightMode>
  );
};
