import {
  Divider,
  HStack,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { themeColors } from "../../../theme/themeColors";

const DefinitionTauxTransfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{
        sm: "full",
        lg: "half",
      }}
    >
      <ModalOverlay />
      <ModalContent px="32px" paddingTop="32px" paddingBottom="40px">
        <ModalCloseButton />
        <ModalBody>
          <VStack width="100%" gap="24px">
            <Text
              fontWeight="700"
              fontSize="14px"
              textTransform="uppercase"
              color={themeColors.bluefrance[113]}
              width="100%"
            >
              Taux de transformation prévisionnel
            </Text>
            <VStack gap="16px" width="100%" alignItems="start">
              <Text>
                Dans Orion, le taux de transformation prévisionnel est défini
                par défaut comme suit :
              </Text>
              <VStack
                mx="10%"
                backgroundColor={themeColors.bluefrance[975]}
                width="80%"
                alignItems="center"
                fontSize="12px"
                fontStyle="italic"
                px="16px"
                paddingTop="24px"
                paddingBottom="8px"
              >
                <HStack>
                  <VStack lineHeight="20px">
                    <Text fontWeight="700">% de transformation</Text>
                    <Text>Rentrée Scolaire N</Text>
                  </VStack>
                  <Text lineHeight="20px">=</Text>
                  <VStack lineHeight="20px">
                    <Text fontWeight="700">Pl. ouvertes + Pl. fermées</Text>
                    <Text>issues des demandes validées en année N-1</Text>
                    <Divider borderColor="black" />
                    <Text fontWeight="700">Pl. effectivement occupées</Text>
                    <Text>Constat de rentrée N-1</Text>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
            <VStack
              gap="16px"
              alignItems="start"
              width="100%"
              paddingTop="16px"
            >
              <Text fontWeight="700" fontStyle="italic">
                À noter :
              </Text>
              <UnorderedList spacing="16px">
                <ListItem>
                  <Text>
                    Le calcul tient compte des places transformées en{" "}
                    <b>voie scolaire</b> et en <b>apprentissage</b> (diplômes
                    retenus : CAP, Bac Pro, CS, BTS, FCIL, BT, BP, DNMADE, BMA).
                    Le dénominateur concerne les effectifs{" "}
                    <b>en entrée de formation</b>.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    Les taux affichés dans Orion sont <b>prévisionnels</b>{" "}
                    puisque :
                  </Text>
                  <UnorderedList>
                    <ListItem>
                      ils sont calculés à partir des transformations{" "}
                      <b>prévues</b> et non constatées
                    </ListItem>
                    <ListItem>
                      ils sont rapportés à un total de places de la{" "}
                      <b>Rentrée N-1</b> et non N
                    </ListItem>
                  </UnorderedList>
                </ListItem>
              </UnorderedList>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export { DefinitionTauxTransfoModal };
