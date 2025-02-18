import { Divider, Highlight, HStack, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { FIRST_ANNEE_CAMPAGNE } from "shared/time/FIRST_ANNEE_CAMPAGNE";
import { rentreeScolaireCampagnes } from "shared/time/rentreeScolaireCampagnes";

import { themeColors } from "@/theme/themeColors";

export const DefinitionTauxTransformationCumuleModal = (
  { isOpen, onClose }:
  { isOpen: boolean; onClose: () => void }) => {
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
              fontSize={14}
              textTransform="uppercase"
              color={themeColors.bluefrance[113]}
              width="100%"
            >
              Taux de transformation cumulé
            </Text>
            <VStack gap="16px" width="100%" alignItems="start">
              <Text>Dans Orion, le taux de transformation cumulé est défini par défaut comme suit :</Text>
              <VStack
                backgroundColor={themeColors.yellowTournesol[950]}
                width="90%"
                fontSize={12}
                fontStyle="italic"
                px="16px"
                paddingTop="24px"
                paddingBottom="8px"
                alignSelf="center"
              >
                <HStack alignItems="center">
                  <VStack lineHeight="20px">
                    <Text fontWeight="700">% de transformation</Text>
                    <Text>cumulé</Text>
                  </VStack>
                  <Text lineHeight="20px">=</Text>
                  <VStack lineHeight="20px">
                    <Text fontWeight="700">
                      <Highlight styles={{ color: "info.text" }} query={""}>
                        {`Pl. transformées Rentrées ${rentreeScolaireCampagnes().join(" + ")}`}
                      </Highlight>
                    </Text>
                    <Text>issues des demandes validées</Text>
                    <Divider borderColor="black" />
                    <Text fontWeight="700">Effectif en entrée de formation</Text>
                    <Text>Constat de rentrée {FIRST_ANNEE_CAMPAGNE}</Text>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
            <VStack gap="16px" alignItems="start" width="100%" paddingTop="16px">
              <Text fontWeight="700" fontStyle="italic">
                À noter :
              </Text>
              <UnorderedList spacing="16px">
                <ListItem>
                  <Text>
                    Pl. <b>transformées</b> = Pl. <b>ouvertes</b> + Pl. <b>fermées</b> + Pl. <b>existantes colorées</b> (à partir de la Rentrée Scolaire 2025).
                    <br/>
                    Pour la Rentrée scolaire "année N", le nombre de places transformées au numérateur correspond aux transformations <b>prévues</b> (sur la base des demandes validées) et non <b>constatées.</b>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    Le calcul tient compte des places transformées en <b>voie scolaire</b> et en <b>apprentissage</b> (diplômes retenus : CAP, Bac Pro, MC/CS, BTS, FCIL, BT, BP, DNMADE, BMA). Le dénominateur concerne les effectifs <b>en entrée de formation.</b>
                  </Text>
                </ListItem>
              </UnorderedList>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
