import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex, Highlight, Tag, Text,Tooltip } from "@chakra-ui/react";
import type { ReactElement } from "react";


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
    if (differenceCapaciteScolaire > 0 && differenceCapaciteApprentissage > 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor="grey.975" px={4}>+{differenceCapaciteScolaire}</Tag>
          <Tag bgColor="grey.975" px={2}>Scolaire</Tag>
          <Tag bgColor="grey.975" color={"bluefrance.925_hover"} px={4}>+{differenceCapaciteApprentissage}</Tag>
          <Tag bgColor="grey.975" color={"bluefrance.925_hover"} px={2}>Apprentissage</Tag>
        </Flex>
      );
    }
    if (differenceCapaciteScolaire < 0 && differenceCapaciteApprentissage < 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor="grey.975" px={4}>{differenceCapaciteScolaire}</Tag>
          <Tag bgColor="grey.975" px={2}>Scolaire</Tag>
          <Tag bgColor="grey.975" color={"bluefrance.925_hover"} px={4}>{differenceCapaciteApprentissage}</Tag>
          <Tag bgColor="grey.975" color={"bluefrance.925_hover"} px={2}>Apprentissage</Tag>
        </Flex>
      );
    }
    if (differenceCapaciteScolaire > 0 && differenceCapaciteApprentissage < 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor={"grey.975"} borderRadius={"9999px"} px={4}>
            <Text>{differenceCapaciteScolaire} {`>`} </Text>
            <Text color={"bluefrance.925_hover"}>{differenceCapaciteApprentissage}</Text>
          </Tag>
          <Tag bgColor={"grey.975"} borderRadius={"9999px"} px={2}>
            <Text>Sco. {`>`} </Text>
            <Text color={"bluefrance.925_hover"}>App.</Text>
          </Tag>
        </Flex>
      );
    }
    if (differenceCapaciteScolaire < 0 && differenceCapaciteApprentissage > 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor={"grey.975"} borderRadius={"9999px"} px={4}>
            <Text color={"bluefrance.925_hover"}>+{differenceCapaciteApprentissage} {`>`} </Text>
            <Text>{differenceCapaciteScolaire}</Text>
          </Tag>
          <Tag bgColor={"grey.975"} borderRadius={"9999px"} px={2}>
            <Text color={"bluefrance.925_hover"}>App. {`>`} </Text>
            <Text>Sco.</Text>
          </Tag>
        </Flex>
      );
    }
    if (differenceCapaciteScolaire === 0 && differenceCapaciteApprentissageArray[index] !== 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor="grey.975" borderRadius={"9999px"} color={"bluefrance.925_hover"} px={4}>{differenceCapaciteApprentissage > 0 ? "+":""}{differenceCapaciteApprentissage}</Tag>
          <Tag bgColor="grey.975" borderRadius={"9999px"} color={"bluefrance.925_hover"} px={2}>Apprentissage</Tag>
        </Flex>
      );
    }
    if (differenceCapaciteScolaire !== 0 && differenceCapaciteApprentissageArray[index] === 0) {
      return (
        <Flex direction={"row"} gap={2} key={index}>
          <Tag bgColor="grey.975" borderRadius={"9999px"} px={4}>{differenceCapaciteScolaire > 0 ? "+":""}{differenceCapaciteScolaire}</Tag>
          <Tag bgColor={"grey.975"} borderRadius={"9999px"} px={2}>Scolaire</Tag>
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
  differenceCapaciteScolaire,
  differenceCapaciteApprentissage,
  ...props
}: {
  differenceCapaciteScolaire?: string;
  differenceCapaciteApprentissage?: string;
  props?: FlexProps;
}) => {
  if (!differenceCapaciteScolaire || !differenceCapaciteApprentissage) return null;

  const differenceCapaciteScolaireArray = differenceCapaciteScolaire.split(", ").map(item => parseInt(item));
  const differenceCapaciteApprentissageArray = differenceCapaciteApprentissage.split(", ").map(item => parseInt(item));
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
              {previsionnelArray[index]}
            </Tooltip>
          </Flex>
        )
      }
    </Flex>
  );
});
