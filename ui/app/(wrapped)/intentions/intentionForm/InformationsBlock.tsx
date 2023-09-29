import { Box, Button, Flex } from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  canEdit,
  isSubmitting,
  onDraftSubmit,
  isDraftSubmitting,
  formMetadata,
}: {
  canEdit: boolean;
  isSubmitting?: boolean;
  onDraftSubmit: () => void;
  isDraftSubmitting?: boolean;
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  return (
    <>
      <Box bg="white" p="6" mt="6" mb="6" borderRadius={6}>
        <TypeDemandeSection formMetadata={formMetadata} />
      </Box>
      <Box bg="white" p="6" mt="6" borderRadius={6}>
        <CapaciteSection />
        <Flex justify="flex-end" mt="1200" mb="4">
          <Button
            isDisabled={!canEdit}
            isLoading={isDraftSubmitting}
            variant="secondary"
            mr="4"
            onClick={() => onDraftSubmit()}
          >
            Enregistrer l'intention
          </Button>
          <Button
            isDisabled={!canEdit}
            isLoading={isSubmitting}
            variant="primary"
            type="submit"
          >
            Valider la demande
          </Button>
        </Flex>
      </Box>
    </>
  );
};
