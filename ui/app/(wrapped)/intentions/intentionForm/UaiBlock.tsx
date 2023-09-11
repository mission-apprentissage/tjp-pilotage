import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  DarkMode,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  LightMode,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CSSObjectWithLabel } from "react-select";
import AsyncSelect from "react-select/async";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { IntentionForms, PartialIntentionForms } from "./defaultFormValues";

export const UaiBlock = ({
  active,
  onSubmit,
  onOpen,
  defaultValues,
  defaultEtablissement,
}: {
  active: boolean;
  onSubmit: (values: IntentionForms[1]) => void;
  onOpen: () => void;
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
    defaultValues.uai && defaultEtablissement
      ? {
          label: defaultEtablissement.libelle,
          value: defaultValues.uai,
          commune: defaultEtablissement.commune,
        }
      : undefined
  );

  return (
    <DarkMode>
      <Box
        color="chakra-body-text"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="#5770BE"
        p="6"
        borderRadius="6"
      >
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          Nouvelle demande
          <IconButton
            visibility={active ? "collapse" : "visible"}
            variant="ghost"
            ml="auto"
            aria-label="Editer"
            onClick={onOpen}
          >
            <EditIcon />
          </IconButton>
        </Heading>
        <Divider pt="4" mb="4" />
        <Flex align="flex-end">
          <Box
            bg="rgba(255,255,255,0.1)"
            p="4"
            mr="8"
            flex="1"
            maxW="400"
            minH={150}
          >
            {!uaiInfo && !defaultValues.uai && (
              <Text>Veuillez saisir le numéro établissement.</Text>
            )}

            {uaiInfo && (
              <>
                <Badge mb="2" colorScheme="green">
                  Établissement validé
                </Badge>
                <Text fontSize="sm">{uaiInfo.label}</Text>
                <Text fontSize="sm" mt="1">
                  {uaiInfo.commune}
                </Text>
              </>
            )}
          </Box>
          <FormControl mr="8" flex="1" maxW="480px" isInvalid={!!errors.uai}>
            <FormLabel>Recherche d'un établissement</FormLabel>
            <LightMode>
              <Box color="chakra-body-text">
                <Controller
                  name="uai"
                  control={control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <AsyncSelect
                      onBlur={onBlur}
                      name={name}
                      styles={selectStyle}
                      onChange={(selected) => {
                        onChange(selected?.value);
                        setUaiInfo(selected ?? undefined);
                        if (selected) {
                          onSubmit({ uai: selected.value });
                        }
                      }}
                      defaultValue={
                        defaultEtablissement &&
                        ({
                          value,
                          label: defaultEtablissement.libelle,
                          commune: defaultEtablissement.commune,
                        } as ApiType<typeof api.searchEtab>[0])
                      }
                      loadOptions={(inputValue: string) =>
                        api
                          .searchEtab({ params: { search: inputValue } })
                          .call()
                      }
                      loadingMessage={() => "Recherche..."}
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
            </LightMode>
          </FormControl>
        </Flex>
      </Box>
    </DarkMode>
  );
};
