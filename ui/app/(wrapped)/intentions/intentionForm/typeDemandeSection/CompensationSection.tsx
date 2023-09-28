import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { api } from "../../../../../api.client";
import { CfdAutocompleteInput } from "../../components/CfdAutocomplete";
import { UaiAutocomplete } from "../../components/UaiAutocomplete";

export const CompensationSection = ({
  formMetadata,
}: {
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const {
    formState: { errors },
    control,
    handleSubmit,
    resetField,
    getValues,
  } = useFormContext<IntentionForms>();

  const { data, isLoading } = useQuery({
    queryKey: [getValues("uai")],
    queryFn: api.getEtab({ params: { uai: getValues("uai") } }).call,
    cacheTime: 0,
  });

  const getSameEtabDefaultValue = (): ApiType<typeof api.getEtab> =>
    data ?? ({} as ApiType<typeof api.getEtab>);

  const getUaiDefaultValue = (value?: string): ApiType<typeof api.getEtab> => {
    if (formMetadata?.etablissementCompensation?.libelle && value)
      return {
        label: formMetadata?.etablissementCompensation.libelle,
        value: value,
        commune: formMetadata?.etablissementCompensation.commune,
      };
    return getSameEtabDefaultValue();
  };

  const [dispositifsCompensation, setDispositifsCompensation] = useState<
    ApiType<typeof api.searchDiplome>[number]["dispositifs"] | undefined
  >(formMetadata?.formationCompensation?.dispositifs);

  return (
    <>
      <FormControl
        mb="4"
        w="100%"
        isInvalid={!!errors.compensationCfd?.message}
        isRequired
        onSubmit={handleSubmit(() => {})}
      >
        <FormLabel>Diplôme compensé</FormLabel>
        <Box color="chakra-body-text">
          <Controller
            name="compensationCfd"
            control={control}
            shouldUnregister
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name } }) => (
              <CfdAutocompleteInput
                name={name}
                inError={errors.compensationCfd ? true : false}
                defaultValue={
                  value && formMetadata?.formationCompensation?.libelle
                    ? {
                        value,
                        label: formMetadata?.formationCompensation?.libelle,
                      }
                    : undefined
                }
                onChange={(selected) => {
                  if (!selected) resetField("compensationDispositifId");
                  onChange(selected?.value);
                  setDispositifsCompensation(selected?.dispositifs);
                }}
              />
            )}
          />
          {errors.compensationCfd && (
            <FormErrorMessage>
              {errors.compensationCfd.message}
            </FormErrorMessage>
          )}
        </Box>
      </FormControl>
      <FormControl
        mb="4"
        w="100%"
        isInvalid={!!errors.compensationDispositifId}
        isRequired
        onSubmit={handleSubmit(() => {})}
      >
        <FormLabel>Dispositif</FormLabel>
        <Controller
          name="compensationDispositifId"
          control={control}
          shouldUnregister
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

        {errors.compensationDispositifId && (
          <FormErrorMessage>
            {errors.compensationDispositifId.message}
          </FormErrorMessage>
        )}
      </FormControl>
      <FormControl
        w="100%"
        isInvalid={!!errors.compensationUai?.message}
        isRequired
        onSubmit={handleSubmit(() => {})}
      >
        <FormLabel>Établissement</FormLabel>
        <Box color="chakra-body-text">
          <Controller
            name="compensationUai"
            control={control}
            shouldUnregister
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, name } }) =>
              !isLoading ? (
                <UaiAutocomplete
                  name={name}
                  inError={errors.compensationUai ? true : false}
                  defaultValue={getUaiDefaultValue(
                    getValues("compensationUai")
                  )}
                  onChange={(selected) => {
                    onChange(selected?.value);
                  }}
                />
              ) : (
                <></>
              )
            }
          />
          {errors.compensationUai && (
            <FormErrorMessage>
              {errors.compensationUai.message}
            </FormErrorMessage>
          )}
        </Box>
      </FormControl>
    </>
  );
};
