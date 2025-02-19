import { Box, Divider, Highlight, HStack, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, UnorderedList, useToken, VStack } from "@chakra-ui/react";
import { FIRST_ANNEE_CAMPAGNE } from "shared/time/FIRST_ANNEE_CAMPAGNE";
import { rentreeScolaireCampagnes } from "shared/time/rentreeScolaireCampagnes";

import { themeColors } from "@/theme/themeColors";

export const DefinitionTauxTransformationCumuleModal = (
  { isOpen, onClose }:
  { isOpen: boolean; onClose: () => void }) => {
  const [blue, cyan, grey] = useToken("colors", ["bluefrance.113", "blueecume.675_hover", "grey.925"]);

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
          <VStack width="100%" gap="16px">
            <Text
              fontWeight="700"
              fontSize={14}
              textTransform="uppercase"
              color={themeColors.bluefrance[113]}
              width="100%"
            >
              Taux de transformation cumulé
            </Text>

            <Box width="100%" position="relative" height="24px" bg="gray.100" borderRadius="8px">
              <Box position="absolute" left="0" top="0" bottom="0" width="100%" height="100%" bg={grey} borderRadius="8px"/>
              <Box position="absolute" left="0" top="0" bottom="0" width="75%" height="100%" bg={cyan} borderRadius="8px"/>
              <Box position="absolute" left="0" top="0" bottom="0" width="25%" height="100%" bg={blue} borderRadius="8px"/>
            </Box>
            <Box position="relative" width="100%" height="17px">
              <Box position="absolute" top="-4px"  left="05%" height="15px" borderRadius="full" _before={{
                content: '""',
                position: "absolute",
                top: "-7px",
                left: 0,
                width: "2px",
                height: "15px",
                backgroundColor: "bluefrance.113",
                borderRadius: "full",
              }}>
                <Text fontSize={"24px"} fontWeight={"bold"} color="bluefrance.113">%</Text>
                <Text fontWeight={"bold"}>Demandes validées</Text>
              </Box>
              <Box position="absolute" top="-4px"  left="60%" height="15px" borderRadius="full" _before={{
                content: '""',
                position: "absolute",
                top: "-7px",
                left: 0,
                width: "2px",
                height: "15px",
                backgroundColor: "bluefrance.113",
                borderRadius: "full",
              }}>
                <Text fontSize={"24px"} fontWeight={"bold"} color="bluefrance.113">%</Text>
                <Text fontWeight={"bold"}>Projets RS inclus</Text>
              </Box>
            </Box>

            <HStack width="100%" mt={"32px"}>
              {/* DEMANDES VALIDEES */}
              <VStack
                width="fit-content"
                fontSize={12}
                fontStyle="italic"
                px="8px"
                py="16px"
                alignSelf="center"
                borderRadius="8px"
                borderWidth="3px"
                borderColor={blue}
              >
                <HStack alignItems="center">
                  <Text lineHeight="20px">=</Text>
                  <VStack lineHeight="20px">
                    <Text fontWeight="700" align="center" style={{ textWrap: "nowrap" }}>
                      <Highlight styles={{ color: "info.text" }} query={""}>
                        {`Pl. transformées RS ${rentreeScolaireCampagnes().join(" + ")}`}
                      </Highlight>
                    </Text>
                    <Text>issues des demandes validées</Text>
                    <Divider borderColor="black" />
                    <Text fontWeight="700" style={{ textWrap: "nowrap" }}>Effectif en entrée de formation</Text>
                    <Text>Constat de rentrée {FIRST_ANNEE_CAMPAGNE}</Text>
                  </VStack>
                </HStack>
              </VStack>

              {/* PROJETS RS INCLUS */}
              <VStack
                width="fit-content"
                fontSize={12}
                fontStyle="italic"
                px="8px"
                py="16px"
                alignSelf="center"
                borderRadius="8px"
                borderWidth="3px"
                borderColor={cyan}
              >
                <HStack alignItems="center">
                  <Text lineHeight="20px">=</Text>
                  <VStack lineHeight="20px">
                    <HStack>
                      <HStack>
                        <Text fontSize={"24px"}>(</Text>
                        <VStack gap={0}>
                          <Text fontWeight={"bold"} align="center" style={{ textWrap: "balance" }}>{`Pl. transformées RS ${rentreeScolaireCampagnes().join(" + ")}`}</Text>
                          <Text align="center" style={{ textWrap: "balance" }}>issues des demandes validées</Text>
                        </VStack>
                        <Text fontSize={"24px"}>)</Text>
                      </HStack>
                      <Text fontWeight={"bold"}>+</Text>
                      <HStack>
                        <Text fontSize={"24px"}> (</Text>
                        <VStack gap={0}>
                          <Text fontWeight={"bold"} align="center" style={{ textWrap: "balance" }}>Pl. transformées RS 26</Text>
                          <Text align="center" style={{ textWrap: "balance" }}>incluant les demandes en "projet" et "prêt pour le vote"</Text>
                        </VStack>
                        <Text fontSize={"24px"}>)</Text>
                      </HStack>
                    </HStack>

                    <Divider borderColor="black" />
                    <Text fontWeight="700">Effectif en entrée de formation</Text>
                    <Text>Constat de rentrée {FIRST_ANNEE_CAMPAGNE}</Text>
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
            <VStack gap="16px" alignItems="start" width="100%">
              <Text fontWeight="700" fontStyle="italic">
                À noter :
              </Text>
              <UnorderedList spacing="16px">
                <ListItem>
                  <Text>
                    Pl. <b>transformées</b> = Pl. <b>ouvertes</b> + Pl. <b>fermées</b> + Pl. <b>existantes colorées</b> (à partir de la Rentrée Scolaire 2025).
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                  Pour la Rentrée scolaire "année N", le nombre de places transformées au numérateur correspond aux transformations <b>prévues</b> (sur la base des demandes validées à l'issue de la concertation entre régions académiques - régions).
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    Le calcul tient compte des places transformées en <b>voie scolaire</b> et en <b>apprentissage</b> (diplômes retenus : CAP, Bac Pro, MC/CS, BTS, FCIL, DNMADE, BMA). Le dénominateur concerne les effectifs <b>en entrée de formation.</b>
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
