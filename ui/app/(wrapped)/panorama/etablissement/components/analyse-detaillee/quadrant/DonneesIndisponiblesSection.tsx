import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, Flex, Mark, Text } from "@chakra-ui/react";
import NextLink from "next/link";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { Etablissement, Formation } from "../types";

export const DonneesIndisponiblesSection = ({
  dimensions,
  currentFormation,
  etablissement,
}: {
  dimensions?: Array<"tauxPoursuite" | "tauxInsertion">;
  currentFormation?: Formation;
  etablissement?: Etablissement;
}) => {
  const { openGlossaire } = useGlossaireContext();
  return dimensions ? (
    !dimensions?.includes("tauxPoursuite") ||
    !dimensions?.includes("tauxInsertion") ? (
      <Flex
        bgColor={"grey.975"}
        h={"100%"}
        borderLeftColor={"bluefrance.525"}
        borderLeftWidth={"4px"}
        direction={"column"}
        padding={"16px"}
        gap={2}
      >
        <Text fontSize={14} fontWeight={700}>
          {dimensions?.includes("tauxPoursuite")
            ? "Taux de poursuite seul"
            : "Taux d'insertion seul"}
        </Text>
        <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
          {`Pour cette formation, le ${
            dimensions?.includes("tauxPoursuite")
              ? "taux de poursuite"
              : "taux d'insertion"
          } n’est pas disponible, seul le ${
            dimensions?.includes("tauxPoursuite")
              ? "taux d'insertion"
              : "taux de poursuite "
          } peut être comparé à ceux des autres formations de l’établissement`}
        </Text>
        <Button
          as={NextLink}
          href={createParametrizedUrl("/console/formations", {
            filters: {
              cfd: [currentFormation?.cfd ?? ""],
              dispositifId: [currentFormation?.codeDispositif ?? ""],
              codeRegion: [etablissement?.codeRegion ?? ""],
            },
          })}
          rightIcon={<ExternalLinkIcon />}
          variant={"externalLink"}
        >
          Consulter les données régionales
        </Button>
      </Flex>
    ) : (
      <></>
    )
  ) : (
    <Flex
      bgColor={"grey.975"}
      h={"100%"}
      borderLeftColor={"bluefrance.525"}
      borderLeftWidth={"4px"}
      direction={"column"}
      padding={"16px"}
      gap={2}
    >
      <Text fontSize={14} fontWeight={700}>
        Formation "hors quadrant"
      </Text>
      <Flex
        flex="inline"
        fontSize={14}
        fontWeight={400}
        lineHeight={"24px"}
        flexDirection={"column"}
      >
        <Text>
          Cette formation ne peut pas être affichée sur le quadrant, car les
          données de poursuite et d'emploi à 6 mois ne sont pas disponibles.{" "}
          <Mark
            textDecoration="underline"
            cursor="pointer"
            onClick={() => openGlossaire("quadrant")}
          >
            (Pourquoi ?)
          </Mark>
        </Text>
      </Flex>
      <Button
        as={NextLink}
        href={createParametrizedUrl("/console/formations", {
          filters: {
            cfd: [currentFormation?.cfd ?? ""],
            dispositifId: [currentFormation?.codeDispositif ?? ""],
            codeRegion: [etablissement?.codeRegion ?? ""],
          },
        })}
        rightIcon={<ExternalLinkIcon />}
        variant={"externalLink"}
      >
        Consulter les données régionales
      </Button>
    </Flex>
  );
};
