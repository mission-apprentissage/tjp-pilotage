import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
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
        <Divider mt={8}></Divider>
        <Flex justify="flex-end" mt="12" mb="4" gap={6}>
          <Box justifyContent={"center"}>
            <Button
              isDisabled={!canEdit}
              isLoading={isDraftSubmitting}
              variant="secondary"
              onClick={() => onDraftSubmit()}
            >
              Enregister le projet de demande
            </Button>
            <Text fontSize={"12"} align={"center"}>
              (Phase d'enregistrement du 02 au 12 octobre)
            </Text>
          </Box>
          <Box justifyContent={"center"}>
            <Button
              isDisabled={!canEdit}
              isLoading={isSubmitting}
              variant="primary"
              type="submit"
            >
              Valider la demande définitive
            </Button>
            <Text fontSize={"12"} align={"center"}>
              Pour soumission au vote du Conseil Régional
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
