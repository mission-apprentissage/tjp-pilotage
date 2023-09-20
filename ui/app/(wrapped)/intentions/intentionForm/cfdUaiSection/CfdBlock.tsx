import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { CfdAutocompleteInput } from "../../components/CfdAutocomplete";
import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";

export const cfdRegex = /^[0-9]{8}$/;

export const CfdBlock = ({
  setDispositifs,
  formMetaData,
  defaultValues,
  defaultDispositifs = [],
  onSubmit,
  active,
}: {
  setDispositifs: (
    info?: ApiType<typeof api.searchDiplome>[number]["dispositifs"]
  ) => void;
  formMetaData?: ApiType<typeof api.getDemande>["metadata"];
  defaultValues: PartialIntentionForms;
  defaultDispositifs?: ApiType<typeof api.searchDiplome>[number]["dispositifs"];
  onSubmit: (values: PartialIntentionForms) => void;
  active: boolean;
}) => {
  const {
    formState: { errors },
    handleSubmit,
    resetField,
    control,
  } = useForm<IntentionForms>({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  return (
    <LightMode>
      <FormControl
        mb="4"
        isInvalid={!!errors.cfd?.message}
        isRequired
        flex="1"
        w="md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLabel>Recherche d'un diplôme</FormLabel>
        <Box color="chakra-body-text" minW="700px">
          <Controller
            name="cfd"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CfdAutocompleteInput
                name={name}
                value={value}
                inError={errors.cfd ? true : false}
                formMetadata={formMetaData}
                defaultValues={defaultValues}
                defaultDispositifs={defaultDispositifs}
                active={active}
                onSubmit={onSubmit}
                onChange={onChange}
                resetField={resetField}
                setDispositifs={setDispositifs}
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
