import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Divider,
  Flex,
  UnorderedList,
} from "@chakra-ui/react";
import { ReactNode } from "react";

import { client } from "@/api.client";

import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  disabled,
  errors,
  formMetadata,
  footerActions,
}: {
  disabled: boolean;
  errors?: Record<string, string>;
  formMetadata?: (typeof client.infer)["[GET]/demande/:id"]["metadata"];
  footerActions: ReactNode;
}) => {
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
        {footerActions && (
          <Flex justify="flex-end" mt="12" mb="4" gap={6}>
            {footerActions}
          </Flex>
        )}
      </Box>
    </>
  );
};
