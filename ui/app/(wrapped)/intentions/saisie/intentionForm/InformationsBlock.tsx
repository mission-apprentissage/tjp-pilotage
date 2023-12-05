import { DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  Select,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { client } from "@/api.client";
import {
  IntentionForms,
  PartialIntentionForms,
} from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  disabled,
  errors,
  defaultValues,
  formMetadata,
  footerActions,
}: {
  disabled: boolean;
  errors?: Record<string, string>;
  defaultValues: PartialIntentionForms;
  formMetadata?: (typeof client.infer)["[GET]/demande/:id"]["metadata"];
  footerActions: ReactNode;
}) => {
  const { control } = useFormContext<IntentionForms>();

  return (
    <>
      <Box bg="white" p="6" mt="6" mb="6" borderRadius={6}>
        <TypeDemandeSection disabled={disabled} formMetadata={formMetadata} />
      </Box>
      <Box bg="white" p="6" mt="6" borderRadius={6}>
        <CapaciteSection disabled={disabled} />
        <Divider mt={8}></Divider>
        {errors && (
          <Alert mt="8" alignItems="flex-start" status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Erreur(s) lors de l'envoi</AlertTitle>
              <AlertDescription mt="2">
                <UnorderedList>
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </UnorderedList>
              </AlertDescription>
            </Box>
          </Alert>
        )}
        {!defaultValues && footerActions && (
          <Flex justify="flex-end" mt="12" mb="4" gap={6}>
            {footerActions}
          </Flex>
        )}
      </Box>
      {defaultValues && (
        <>
          <Box bg="white" p="6" mt="6" borderRadius={6}>
            <Text fontSize={20} mb={4} fontWeight={700}>
              Statut de la demande
            </Text>
            <Divider mb={4} />
            <Controller
              name="status"
              control={control}
              rules={{ required: "Le type de demande est obligatoire." }}
              render={({ field: { onChange, name, value } }) => (
                <Select w="xs" onChange={onChange} name={name} value={value}>
                  <option value="draft">Projet de demande</option>
                  <option value="submitted">Validée</option>
                  <option value="refused">Refusée</option>
                </Select>
              )}
            />
          </Box>
          <Box bg="white" p="6" mt="6" borderRadius={6}>
            <Flex justifyContent={"space-between"} flexDir={"row"}>
              <Button
                leftIcon={<DeleteIcon />}
                variant="ghost"
                color="bluefrance.113"
              >
                Supprimer la demande
              </Button>

              {footerActions && <Flex>{footerActions}</Flex>}
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};
