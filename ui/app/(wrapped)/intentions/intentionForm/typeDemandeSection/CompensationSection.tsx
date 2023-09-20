import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  LightMode,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { api } from "../../../../../api.client";
import { CfdAutocompleteInput } from "../../components/CfdAutocomplete";
import { UaiAutocomplete } from "../../components/UaiAutocomplete";

export const CompensationSection = ({
  formMetadata,
  defaultValues,
}: {
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
  defaultValues: PartialIntentionForms;
}) => {
  const {
    formState: { errors },
    control,
    handleSubmit,
    resetField,
  } = useFormContext<IntentionForms>();

  const [dispositifsCompensation, setDispositifsCompensation] = useState<
    ApiType<typeof api.searchDiplome>[number]["dispositifs"] | undefined
  >(formMetadata?.formationCompensation?.dispositifs);

  return (
    <LightMode>
      <FormControl
        mb="4"
        isInvalid={!!errors.compensationCfd?.message}
        isRequired
        flex="1"
        w="752px"
        onSubmit={handleSubmit(() => {})}
      >
        <FormLabel>Diplôme compensé</FormLabel>
        <Box color="chakra-body-text" minW="700px">
          <Controller
            name="compensationCfd"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CfdAutocompleteInput
                name={name}
                value={value}
                type={"compensation"}
                inError={errors.compensationCfd ? true : false}
                formMetadata={formMetadata}
                defaultValues={defaultValues}
                onChange={onChange}
                resetField={resetField}
                setDispositifs={setDispositifsCompensation}
                onSubmit={() => {}}
              />
            )}
          />
          {errors.cfd && (
            <FormErrorMessage>{errors.cfd.message}</FormErrorMessage>
          )}
        </Box>
      </FormControl>
      <FormControl
        mb="4"
        maxW="sm"
        isInvalid={!!errors.dispositifId}
        isRequired
        onSubmit={handleSubmit(() => {})}
      >
        <FormLabel>Dispositif</FormLabel>
        <Controller
          name="compensationDispositifId"
          control={control}
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field: { onChange, value, name } }) => (
            <Select
              value={value}
              name={name}
              bg={"white"}
              color="chakra-body-text"
              disabled={!dispositifsCompensation}
              placeholder="Sélectionner une option"
              onChange={(selected) => {
                onChange(selected.target.value);
              }}
            >
              {dispositifsCompensation?.map(
                ({ codeDispositif, libelleDispositif }) => (
                  <option key={codeDispositif} value={codeDispositif}>
                    {libelleDispositif}
                  </option>
                )
              )}
            </Select>
          )}
        />

        {errors.dispositifId && (
          <FormErrorMessage>{errors.dispositifId.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl
        mb="4"
        isInvalid={!!errors.compensationCfd?.message}
        isRequired
        flex="1"
        maxW="752px"
        onSubmit={handleSubmit(() => {})}
      >
        <FormLabel>Établissement</FormLabel>
        <Box color="chakra-body-text" minW="700px">
          <Controller
            name="compensationUai"
            control={control}
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <UaiAutocomplete
                name={name}
                value={value}
                type={"compensation"}
                inError={errors.compensationUai ? true : false}
                formMetadata={formMetadata}
                defaultValues={defaultValues}
                onChange={onChange}
                setUaiInfo={() => {}}
                onSubmit={() => {}}
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
