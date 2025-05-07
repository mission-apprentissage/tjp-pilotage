import { Box, Button, Flex, Img } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { RefObject } from "react";

export const MenuFormulaire = ({
  refs,
  isTypeDemandeNotFermetureOuDiminution,
  showCorrection,
  showStatutSection,
}: {
  refs: Record<string, RefObject<HTMLDivElement>>;
  isTypeDemandeNotFermetureOuDiminution?: boolean;
  showCorrection?: boolean;
  showStatutSection?: boolean;
}) => {
  const jumpToAnchor = (anchor: string) => {
    refs[anchor]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      bg={"white"}
      borderRadius={"4px"}
      height={"fit-content"}
      mt="6"
      p={4}
      position="sticky"
      top={0}
      left={0}
      zIndex="sticky"
    >
      <Flex direction="column" gap={3}>
        <Button
          onClick={() => jumpToAnchor("typeDemande")}
          width={"100%"}
          justifyContent={"start"}
          fontSize={16}
          fontWeight={700}
          px={4}
          py={3}
          bg={"bluefrance.975"}
          _hover={{ bg: "blueecume.925_hover" }}
          leftIcon={<Icon icon="ri:article-line" color="black" />}
        >
          Type de demande
        </Button>
        {showCorrection && (
          <Button
            onClick={() => jumpToAnchor("correction")}
            width={"100%"}
            justifyContent={"start"}
            fontSize={16}
            fontWeight={700}
            px={4}
            py={3}
            bg={"bluefrance.975"}
            borderColor={"red"}
            borderWidth={"1px"}
            _hover={{ bg: "blueecume.925_hover" }}
            leftIcon={<Icon icon="ri:edit-line" color="black" />}
          >
          Correction
          </Button>
        )}
        <Button
          onClick={() => jumpToAnchor("motifsEtPrecisions")}
          width={"100%"}
          justifyContent={"start"}
          fontSize={16}
          fontWeight={700}
          px={4}
          py={3}
          bg={"bluefrance.975"}
          _hover={{ bg: "blueecume.925_hover" }}
          leftIcon={<Icon icon="ri:list-unordered" color="black" />}
        >
          Motif(s) et précisions
        </Button>
        <Button
          onClick={() => jumpToAnchor("ressourcesHumaines")}
          width={"100%"}
          justifyContent={"start"}
          fontSize={16}
          fontWeight={700}
          px={4}
          py={3}
          bg={"bluefrance.975"}
          _hover={{ bg: "blueecume.925_hover" }}
          leftIcon={<Icon icon="ri:parent-line" color="black" />}
        >
          Ressources Humaines
        </Button>
        {isTypeDemandeNotFermetureOuDiminution && (
          <>
            <Button
              onClick={() => jumpToAnchor("travauxEtEquipements")}
              width={"100%"}
              justifyContent={"start"}
              fontSize={16}
              fontWeight={700}
              px={4}
              py={3}
              bg={"bluefrance.975"}
              _hover={{ bg: "blueecume.925_hover" }}
              leftIcon={<Img src="/icons/travauxEtEquipements.svg" alt={""}/>}
            >
              Travaux et équipements
            </Button>
            <Button
              onClick={() => jumpToAnchor("internatEtRestauration")}
              width={"100%"}
              justifyContent={"start"}
              fontSize={16}
              fontWeight={700}
              px={4}
              py={3}
              bg={"bluefrance.975"}
              _hover={{ bg: "blueecume.925_hover" }}
              leftIcon={<Icon icon="ri:restaurant-line" color="black" />}
            >
              Internat et restauration
            </Button>
          </>
        )}
        <Button
          onClick={() => jumpToAnchor("commentaireEtPiecesJointes")}
          width={"100%"}
          justifyContent={"start"}
          fontSize={16}
          fontWeight={700}
          px={4}
          py={3}
          bg={"bluefrance.975"}
          _hover={{ bg: "blueecume.925_hover" }}
          leftIcon={<Icon icon="ri:chat-3-line" color="black" />}
        >
          Commentaire et pièce(s) jointe(s)
        </Button>
        {showStatutSection && (
          <Button
            onClick={() => jumpToAnchor("statut")}
            width={"100%"}
            justifyContent={"start"}
            fontSize={16}
            fontWeight={700}
            px={4}
            py={3}
            bg={"bluefrance.975"}
            _hover={{ bg: "blueecume.925_hover" }}
            leftIcon={<Icon icon="ri:chat-3-line" color="black" />}
          >
          Statut
          </Button>
        )}
      </Flex>
    </Box>
  );
};
