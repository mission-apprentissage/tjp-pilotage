import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ApiType } from "shared";
import { isTypeCompensation } from "shared/demandeValidators/validators";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { api } from "../../../../../../api.client";
import { CfdAutocompleteInput } from "../../components/CfdAutocomplete";
import { UaiAutocomplete } from "../../components/UaiAutocomplete";

export const CompensationSection = ({
  disabled,
  formMetadata,
}: {
  disabled?: boolean;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useFormContext<IntentionForms>();

  useEffect(
    () =>
      watch(({ typeDemande }, { name }) => {
        if (name !== "typeDemande") return;
        if (!typeDemande || isTypeCompensation(typeDemande)) return;

        setValue("compensationCfd", undefined);
        setValue("compensationDispositifId", undefined);
        setValue("compensationUai", undefined);
        setValue("compensationRentreeScolaire", undefined);
      }).unsubscribe
  );

  const { data, isLoading } = useQuery({
    queryKey: [getValues("uai")],
    queryFn: api.getEtab({ params: { uai: getValues("uai") } }).call,
    cacheTime: 0,
  });

  const getSameEtabDefaultValue = (): ApiType<typeof api.getEtab> => {
    return data ?? ({} as ApiType<typeof api.getEtab>);
  };

  const getUaiDefaultValue = (value?: string): ApiType<typeof api.getEtab> => {
    if (formMetadata?.etablissementCompensation?.libelle && value)
      return {
        label: formMetadata?.etablissementCompensation.libelle,
        value: value,
        commune: formMetadata?.etablissementCompensation.commune,
      };
    return getSameEtabDefaultValue();
  };

  useEffect(() => {
    if (!formMetadata?.etablissementCompensation?.libelle)
      setValue("compensationUai", getValues("uai"));
  }, []);

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
            disabled={disabled}
            shouldUnregister
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name, disabled } }) => (
              <CfdAutocompleteInput
                name={name}
                active={!disabled}
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
                  if (!selected) setValue("compensationDispositifId", "");
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
          disabled={disabled}
          control={control}
          shouldUnregister
          rules={{ required: "Ce champ est obligatoire" }}
          render={({ field: { onChange, value, name, disabled } }) => (
            <Select
              value={value}
              name={name}
              bg={"white"}
              color="chakra-body-text"
              disabled={disabled || !dispositifsCompensation}
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
            disabled={disabled}
            control={control}
            shouldUnregister
            rules={{ required: "Ce champs est obligatoire" }}
            render={({ field: { onChange, value, name, disabled } }) =>
              !isLoading ? (
                <UaiAutocomplete
                  name={name}
                  active={!disabled}
                  inError={errors.compensationUai ? true : false}
                  defaultValue={getUaiDefaultValue(value)}
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
