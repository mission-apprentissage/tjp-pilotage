import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";
import NextLink from "next/link";

import type {
  Etablissement,
  Formation,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { Callout } from "@/components/Callout";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";

export const DonneesIndisponiblesSection = ({
  dimensions,
  currentFormation,
  etablissement,
}: {
  dimensions?: Array<"tauxPoursuite" | "tauxInsertion">;
  currentFormation?: Formation;
  etablissement?: Etablissement;
}) => {
  if (!dimensions) {
    return (
      <Callout
        title={"Formation hors quadrant"}
        body={
          <Text>
            Cette formation ne peut pas être affichée sur le quadrant, car les données de poursuite et d'emploi à 6 mois
            ne sont pas disponibles.{" "}
            <GlossaireShortcut label={"(Pourquoi ?)"} textDecoration={"underline"} glossaireEntryKey="quadrant" />
          </Text>
        }
        actionButton={
          <Button
            as={NextLink}
            href={createParameterizedUrl("/console/formations", {
              filters: {
                cfd: [currentFormation?.cfd ?? ""],
                codeDispositif: [currentFormation?.codeDispositif ?? ""],
                codeRegion: [etablissement?.codeRegion ?? ""],
              },
            })}
            rightIcon={<ExternalLinkIcon />}
            variant={"externalLink"}
          >
            Consulter les données régionales
          </Button>
        }
      />
    );
  }

  if (dimensions && !dimensions.includes("tauxPoursuite")) {
    return (
      <Callout
        title={"Taux de poursuite d'études seul"}
        body={
          <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
            Pour cette formation le taux de pousuite n'est pas possible, seul le taux d'insertion peut être comparé à
            ceux des autres formations de l'établissement.
          </Text>
        }
        actionButton={
          <Button
            as={NextLink}
            href={createParameterizedUrl("/console/formations", {
              filters: {
                cfd: [currentFormation?.cfd ?? ""],
                codeDispositif: [currentFormation?.codeDispositif ?? ""],
                codeRegion: [etablissement?.codeRegion ?? ""],
              },
            })}
            rightIcon={<ExternalLinkIcon />}
            variant={"externalLink"}
          >
            Consulter les données régionales
          </Button>
        }
      />
    );
  }

  if (dimensions && !dimensions.includes("tauxInsertion")) {
    return (
      <Callout
        title={"Taux d'insertion seul"}
        body={
          <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
            Pour cette formation le taux d'insertion n'est pas possible, seul le taux de poursuite peut être comparé à
            ceux des autres formations de l'établissement.
          </Text>
        }
        actionButton={
          <Button
            as={NextLink}
            href={createParameterizedUrl("/console/formations", {
              filters: {
                cfd: [currentFormation?.cfd ?? ""],
                codeDispositif: [currentFormation?.codeDispositif ?? ""],
                codeRegion: [etablissement?.codeRegion ?? ""],
              },
            })}
            rightIcon={<ExternalLinkIcon />}
            variant={"externalLink"}
          >
            Consulter les données régionales
          </Button>
        }
      />
    );
  }

  return null;
};
