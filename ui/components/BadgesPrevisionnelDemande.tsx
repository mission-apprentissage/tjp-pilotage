import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex, Highlight, Tag, Text,Tooltip } from "@chakra-ui/react";
import type { ReactElement } from "react";
import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";
import { isTypeTransfert } from "shared/utils/typeDemandeUtils";


const getPrevisionnelArray = (
  {
    differenceCapaciteScolaireArray,
    differenceCapaciteApprentissageArray
  } : {
    differenceCapaciteScolaireArray: number[];
    differenceCapaciteApprentissageArray: number[];
  }): Array<ReactElement> => {

  return differenceCapaciteScolaireArray.map((differenceCapaciteScolaire, index) => {
    const differenceCapaciteApprentissage = differenceCapaciteApprentissageArray[index];

    const formattedDiffScolaire = differenceCapaciteScolaire >= 0 ? `+${differenceCapaciteScolaire}` : differenceCapaciteScolaire;
    const formattedDiffApprentissage = differenceCapaciteApprentissage >= 0 ? `+${differenceCapaciteApprentissage}` : differenceCapaciteApprentissage;

    if (differenceCapaciteScolaire !== 0 && differenceCapaciteApprentissage !== 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor="grey.975" px={4} borderRadius={"9999px"} whiteSpace="nowrap">{formattedDiffScolaire} Sco.</Tag>
          <Tag bgColor="grey.975" color={"bluefrance.925_hover"} px={4} borderRadius={"9999px"} whiteSpace="nowrap">{formattedDiffApprentissage} App.</Tag>
        </Flex>
      );
    }
    if (differenceCapaciteScolaire !== 0 && differenceCapaciteApprentissage === 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor="grey.975" px={4} borderRadius={"9999px"} whiteSpace="nowrap">{formattedDiffScolaire} Sco.</Tag>
        </Flex>
      );
    }
    if (differenceCapaciteScolaire === 0 && differenceCapaciteApprentissage !== 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor="grey.975" px={4} borderRadius={"9999px"} whiteSpace="nowrap">{formattedDiffApprentissage} App.</Tag>
        </Flex>
      );
    }
    return <></>;
  });
};

export const getTooltipText = (
  {
    differenceCapaciteScolaireArray,
    differenceCapaciteApprentissageArray
  } : {
    differenceCapaciteScolaireArray: number[];
    differenceCapaciteApprentissageArray: number[];
  }
): string => {
  if (
    differenceCapaciteScolaireArray.every((value) => value === 0) &&
    differenceCapaciteApprentissageArray.some((value) => value !== 0)
  ) return "Données absentes les effectifs en apprentissage ne sont pas disponible";
  else if (
    differenceCapaciteApprentissageArray.some((value) => value !== 0)
  ) return "Données partielles, seuls les effectifs en voie scolaire sont disponibles.";
  return "";
};



export const BadgesPrevisionnelDemande = chakra(({
  typeDemande,
  differenceCapaciteScolaire,
  differenceCapaciteApprentissage,
  ...props
}: {
  typeDemande?: string;
  differenceCapaciteScolaire?: string;
  differenceCapaciteApprentissage?: string;
  props?: FlexProps;
}) => {
  if (!differenceCapaciteScolaire || !differenceCapaciteApprentissage || !typeDemande) return null;

  const differenceCapaciteScolaireArray = differenceCapaciteScolaire.split(", ").map(item => parseInt(item));
  const differenceCapaciteApprentissageArray = differenceCapaciteApprentissage.split(", ").map(item => parseInt(item));
  const typeDemandeArray = typeDemande.split(", ") as Array<TypeDemandeType>;
  const previsionnelArray = getPrevisionnelArray({
    differenceCapaciteScolaireArray, differenceCapaciteApprentissageArray
  });

  return (
    <Flex direction={"column"} gap={2} {...props}>
      {
        differenceCapaciteScolaireArray.map((_d, index) =>
          <Flex direction={"row"} gap={2} key={index}>
            <Tooltip label={
              <Flex direction="column" gap={2}>
                <Text>
                  <Highlight query={["Prévisionnel :"]} styles={{ fontWeight: 700, color: "white" }}>
                    Prévisionnel : correspond à la transformation attendue en nombre de places (capacité).
                  </Highlight>
                </Text>
                <Text>
                  {getTooltipText({differenceCapaciteScolaireArray, differenceCapaciteApprentissageArray})}
                </Text>
              </Flex>
            }>
              <Flex direction={"row"} gap={2}>
                {previsionnelArray[index]}
                {typeDemandeArray[index] && isTypeTransfert(typeDemandeArray[index]) && (
                  <Tag bgColor="grey.975" borderRadius={"9999px"} whiteSpace="nowrap">
                    <Highlight query={[" App."]} styles={{ fontWeight: 700, color: "bluefrance.925_hover" }}>
                      Sco. &gt;&nbsp; App.
                    </Highlight>
                  </Tag>
                )}
              </Flex>
            </Tooltip>
          </Flex>
        )
      }
    </Flex>
  );
});
