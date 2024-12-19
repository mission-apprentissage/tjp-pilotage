import { Button, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import type { Formation } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { Callout } from "@/components/Callout";

export const DonneesManquantesApprentissageCard = ({
  codeNsf,
  codeRegion,
  cfd,
  formation,
}: {
  codeNsf: string;
  codeRegion?: string;
  cfd: string;
  formation: Formation;
}) => {
  if (formation.isScolaire) {
    return null;
  }

  return (
    <Callout
      h={"fit-content"}
      body={
        <Flex gap={1} direction={"column"}>
          <Text fontWeight={"bold"}>Données manquantes en apprentissage</Text>
          <Text>
            Les données relatives aux effectifs ne sont pas disponibles car la formation est enseignée seulement en
            apprentissage sur le territoire choisi.
          </Text>
        </Flex>
      }
      actionButton={
        <Link
          href={`/console/formations?filters[codeNsf][0]=${codeNsf}${
            codeRegion ? `&filters[codeRegion][0]=${codeRegion}` : ""
          }&filters[cfd][0]=${cfd}&withAnneeCommune=true`}
          passHref
          target="_blank"
        >
          <Button color="bluefrance.113">
            Consulter les données régionales ou nationales de la formation
            <Icon icon="ri:arrow-right-line" width={"16px"} height={"16px"} style={{ marginLeft: "8px" }} />
          </Button>
        </Link>
      }
    />
  );
};
