import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { client } from "@/api.client";

import { CfdAutocompleteInput } from "../../components/CfdAutocomplete";
import { IntentionForms } from "../defaultFormValues";

export const CfdBlock = ({
  setDispositifs,
  setIsFCIL,
  formMetaData,
  active,
}: {
  setDispositifs: (
    info?: (typeof client.infer)["[GET]/diplome/search/:search"][number]["dispositifs"]
  ) => void;
  setIsFCIL: (isFcil: boolean) => void;
  formMetaData?: (typeof client.infer)["[GET]/demande/:numero"]["metadata"];
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
                inError={!!errors.cfd}
                defaultValue={
                  value && formMetaData?.formation?.libelleFormation
                    ? {
                        value,
                        label: formMetaData?.formation?.libelleFormation,
                      }
                    : undefined
                }
                active={active}
                onChange={(selected) => {
                  onChange(selected?.value);
                  setDispositifs(selected?.dispositifs);
                  setIsFCIL(selected?.isFCIL ?? false);
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
