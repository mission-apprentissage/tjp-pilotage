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
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { UaiAutocomplete } from "../../components/UaiAutocomplete";
import { IntentionForms, PartialIntentionForms } from "../defaultFormValues";

export const UaiBlock = ({
  active,
  onSubmit,
  defaultValues,
  formMetadata,
}: {
  active: boolean;
  onSubmit: (values: PartialIntentionForms) => void;
  defaultValues: PartialIntentionForms;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IntentionForms>({
    defaultValues,
    reValidateMode: "onSubmit",
  });

  const [uaiInfo, setUaiInfo] = useState<
    ApiType<typeof api.searchEtab>[number] | undefined
  >(
    defaultValues?.uai && formMetadata?.etablissement
      ? {
          label: formMetadata?.etablissement.libelle,
          value: defaultValues?.uai,
          commune: formMetadata?.etablissement.commune,
        }
      : undefined
  );

  return (
    <LightMode>
      <FormControl
        isInvalid={!!errors.uai}
        mb="auto"
        isRequired
        onSubmit={handleSubmit(onSubmit)}
      >
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
                  value={value}
                  inError={errors.uai ? true : false}
                  active={active}
                  defaultValues={defaultValues}
                  formMetadata={formMetadata}
                  onSubmit={onSubmit}
                  onChange={onChange}
                  setUaiInfo={setUaiInfo}
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
      </FormControl>
    </LightMode>
  );
};
