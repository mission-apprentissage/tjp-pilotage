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
import { Controller, useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { UaiAutocomplete } from "../../components/UaiAutocomplete";
import { IntentionForms } from "../defaultFormValues";

export const UaiBlock = ({
  active,
  formMetadata,
}: {
  active: boolean;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<IntentionForms>();

  const uai = watch("uai");

  const [uaiInfo, setUaiInfo] = useState<
    ApiType<typeof api.searchEtab>[number] | undefined
  >(
    formMetadata?.etablissement?.libelle && uai
      ? {
          label: formMetadata?.etablissement.libelle,
          value: uai,
          commune: formMetadata?.etablissement.commune,
        }
      : undefined
  );

  return (
    <LightMode>
      <FormControl isInvalid={!!errors.uai} mb="auto" isRequired>
        <FormLabel>Recherche d'un établissement</FormLabel>
        <Flex flexDirection={"row"} justifyContent={"space-between"}>
          <Box color="chakra-body-text" minW="700px">
            <Controller
              name="uai"
              control={control}
              rules={{ required: "Ce champ est obligatoire" }}
              render={({ field: { onChange, value, name } }) => (
                <UaiAutocomplete
                  name={name}
                  active={active}
                  inError={!!errors.uai}
                  defaultValue={
                    formMetadata?.etablissement?.libelle && value
                      ? {
                          label: formMetadata?.etablissement.libelle,
                          value: value,
                          commune: formMetadata?.etablissement.commune,
                        }
                      : undefined
                  }
                  onChange={(v) => {
                    setUaiInfo(v);
                    onChange(v?.value);
                  }}
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
            {!uaiInfo && <Text>Veuillez saisir le numéro établissement.</Text>}

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
      </FormControl>
    </LightMode>
  );
};
