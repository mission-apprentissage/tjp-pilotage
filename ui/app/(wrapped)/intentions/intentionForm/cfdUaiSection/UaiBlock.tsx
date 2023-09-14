import {
  Badge,
  Box,
  Flex,
  FormControl,
  FormLabel,
  LightMode,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";

export const UaiBlock = ({
  active,
  onSubmit,
  defaultValues,
  defaultEtablissement,
}: {
  active: boolean;
  onSubmit: (values: PartialIntentionForms[1]) => void;
  defaultValues: PartialIntentionForms[1];
  defaultEtablissement: ApiType<
    typeof api.getDemande
  >["metadata"]["etablissement"];
}) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IntentionForms[1]>({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  const selectStyle = {
    control: (styles: CSSObjectWithLabel) => ({
      ...styles,
      borderColor: errors.uai ? "red" : undefined,
    }),
  };

  const [uaiInfo, setUaiInfo] = useState<
    ApiType<typeof api.searchEtab>[number] | undefined
  >(
    defaultValues?.uai && defaultEtablissement
      ? {
          label: defaultEtablissement.libelle,
          value: defaultValues?.uai,
          commune: defaultEtablissement.commune,
        }
      : undefined
  );

  return (
    <Flex align="flex-end">
      <FormControl
        isInvalid={!!errors.uai}
        mb="auto"
        isRequired
        onSubmit={handleSubmit(onSubmit)}
      >
        <LightMode>
          <FormLabel>Recherche d'un établissement</FormLabel>
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Box color="chakra-body-text" minW="700px">
              <Controller
                name="uai"
                control={control}
                rules={{ required: "Ce champ est obligatoire" }}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <AsyncSelect
                    onBlur={onBlur}
                    name={name}
                    styles={selectStyle}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    onChange={(selected) => {
                      onChange(selected?.value);
                      setUaiInfo(selected ?? undefined);
                      onSubmit({
                        uai: selected?.value,
                        cfd: defaultValues.cfd,
                        libelleDiplome: defaultValues.libelleDiplome,
                        dispositifId: defaultValues.dispositifId,
                      });
                    }}
                    defaultValue={
                      defaultEtablissement &&
                      ({
                        value,
                        label: `${defaultEtablissement.libelle} - ${defaultEtablissement.commune}`,
                        commune: defaultEtablissement.commune,
                      } as ApiType<typeof api.searchEtab>[0])
                    }
                    loadOptions={(inputValue: string) => {
                      if (inputValue.length >= 3)
                        return api
                          .searchEtab({ params: { search: inputValue } })
                          .call();
                    }}
                    loadingMessage={({ inputValue }) =>
                      inputValue.length >= 3
                        ? "Recherche..."
                        : "Veuillez rentrer au moins 3 lettres"
                    }
                    isClearable={true}
                    noOptionsMessage={({ inputValue }) =>
                      inputValue
                        ? "Pas d'établissement correspondant"
                        : "Commencez à écrire..."
                    }
                    placeholder="UAI, nom, commune"
                    isDisabled={!active}
                  />
                )}
              />
            </Box>
            <Box
              bg="rgba(255,255,255,0.1)"
              p="4"
              flex="1"
              w="100%"
              minH={150}
              ms={8}
            >
              {!uaiInfo && !defaultValues.uai && (
                <Text>Veuillez saisir le numéro établissement.</Text>
              )}

              {uaiInfo && (
                <>
                  <Badge mb="2" colorScheme="green">
                    Établissement validé
                  </Badge>
                  <Text fontSize="sm">{uaiInfo.label?.split("-")[0]}</Text>
                  <Text fontSize="sm" mt="1">
                    {uaiInfo.commune}
                  </Text>
                </>
              )}
            </Box>
          </Flex>
        </LightMode>
      </FormControl>
    </Flex>
  );
};
