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
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  errors,
  formMetadata,
  footerActions,
}: {
  canEdit: boolean;
  errors?: Record<string, string>;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
  footerActions: ReactNode;
}) => {
  return (
    <>
      <Box bg="white" p="6" mt="6" mb="6" borderRadius={6}>
        <TypeDemandeSection formMetadata={formMetadata} />
      </Box>
      <Box bg="white" p="6" mt="6" borderRadius={6}>
        <CapaciteSection />
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
        <Flex justify="flex-end" mt="12" mb="4" gap={6}>
          {footerActions}
        </Flex>
      </Box>
    </>
  );
};
