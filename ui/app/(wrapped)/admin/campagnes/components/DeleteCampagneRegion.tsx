import {Alert, AlertDescription,Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast} from '@chakra-ui/react';
import { useQueryClient } from "@tanstack/react-query";
import {useContext} from 'react';

import {client} from '@/api.client';
import {PreviousCampagneContext} from '@/app/previousCampagneContext';
import {getErrorMessage} from '@/utils/apiError';
import { useCurrentCampagne } from '@/utils/security/useCurrentCampagne';

export const DeleteCampagneRegion = ({
  isOpen,
  onClose,
  campagneRegion,
  regions
}: {
  isOpen: boolean;
  onClose: () => void;
  campagneRegion: (typeof client.infer)["[GET]/campagnes-region"][number];
  regions?: (typeof client.infer)["[GET]/regions"]
}) => {
  const toast = useToast();

  const queryClient = useQueryClient();

  const { setCampagne: setCurrentCampagne } = useCurrentCampagne();
  const { setCampagne: setPreviousCampagne } = useContext(PreviousCampagneContext);

  const {
    mutate: deleteCampagneRegion,
    isLoading,
    isError,
    error
  } = client.ref("[DELETE]/campagne-region/:id").useMutation({
    onSuccess: async () => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La campagne régionale a été supprimée avec succès",
      });
      queryClient.invalidateQueries(["[GET]/campagnes-region"]);
      await client.ref("[GET]/campagne/current").query({}).then((campagne) => {
        setCurrentCampagne(campagne.current);
        setPreviousCampagne(campagne.previous);
      });
      onClose();
    },
  });

  const region = regions?.find(({ value }) => value === campagneRegion.codeRegion);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent
      >
        <ModalHeader>Confirmer la suppression de la campagne régionale</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={4}>
            <Text>
              {`Souhaitez-vous vraiment supprimer la campagne régionale
              ${campagneRegion.annee} pour la région ${region?.label} ?`}
            </Text>
            {isError && (
              <Alert status="error">
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>
            )}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button variant="primary" ml={3} isLoading={isLoading}
            onClick={() =>
              deleteCampagneRegion({
                params: { id: campagneRegion.id },
              })
            }>
            Envoyer
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
};
