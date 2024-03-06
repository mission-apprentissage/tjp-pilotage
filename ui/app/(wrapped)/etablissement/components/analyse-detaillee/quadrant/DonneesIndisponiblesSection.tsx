import { Flex, Text } from "@chakra-ui/react";

export const DonneesIndisponiblesSection = ({
  dimensions,
}: {
  dimensions?: Array<"tauxPoursuite" | "tauxInsertion">;
}) =>
  dimensions &&
  (!dimensions?.includes("tauxPoursuite") ||
    !dimensions?.includes("tauxInsertion")) ? (
    <Flex
      bgColor={"grey.925"}
      h={"100%"}
      borderLeftColor={"bluefrance.525"}
      borderLeftWidth={"4px"}
      direction={"column"}
      padding={"16px"}
    >
      <Text fontSize={14} fontWeight={700}>
        {dimensions?.includes("tauxPoursuite")
          ? "Taux de poursuite seul"
          : "Taux d'insertion seul"}
      </Text>
      <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
        {`Pour cette formation, le ${
          dimensions?.includes("tauxPoursuite")
            ? "taux de poursuite "
            : "taux d'insertion"
        } n’est pas disponible, seul le ${
          dimensions?.includes("tauxPoursuite")
            ? "taux d'insertion"
            : "taux de poursuite "
        } peut être comparé à ceux des autres formations de l’établissement`}
      </Text>
    </Flex>
  ) : (
    <></>
  );
