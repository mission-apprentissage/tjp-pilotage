import { Box, Button, Flex } from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  isSubmitting,
  onDraftSubmit,
  isDraftSubmitting,
  formMetadata,
}: {
  isSubmitting?: boolean;
  onDraftSubmit: () => void;
  isDraftSubmitting?: boolean;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  return (
    <>
      <Box bg="white" as="form" p="6" mt="6" mb="6" borderRadius={6}>
        <TypeDemandeSection formMetadata={formMetadata} />
      </Box>
      <Box bg="white" as="form" p="6" mt="6" borderRadius={6}>
        <CapaciteSection />
        <Flex justify="flex-end" mt="12" mb="4">
          <Button
            isLoading={isDraftSubmitting}
            variant="secondary"
            mr="4"
            onClick={() => onDraftSubmit()}
          >
            Enregistrer en brouillon
          </Button>
          <Button isLoading={isSubmitting} variant="primary" type="submit">
            Envoyer la demande
          </Button>
        </Flex>
      </Box>
    </>
  );
};
