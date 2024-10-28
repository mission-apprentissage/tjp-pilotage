import { Button, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useMemo } from "react";
import { CURRENT_RENTREE } from "shared";

import type {
  ChiffresEntreeOffre,
  ChiffresEntreeOffreRentree,
  ChiffresIJOffre,
  Formation,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { Callout } from "@/components/Callout";

const isAnyDataMissingOfChiffresEntreeOffre = (chiffresEntreeOffre?: ChiffresEntreeOffreRentree) =>
  !chiffresEntreeOffre ||
  typeof chiffresEntreeOffre.premiersVoeux === "undefined" ||
  typeof chiffresEntreeOffre.tauxPression === "undefined" ||
  typeof chiffresEntreeOffre.effectifs === "undefined" ||
  typeof chiffresEntreeOffre.capacite === "undefined" ||
  typeof chiffresEntreeOffre.tauxPressionDepartemental === "undefined" ||
  typeof chiffresEntreeOffre.tauxPressionRegional === "undefined" ||
  typeof chiffresEntreeOffre.tauxPressionNational === "undefined" ||
  typeof chiffresEntreeOffre.tauxRemplissage === "undefined";

const isAnyDataMissingOfChiffresIJ = (formation?: Formation, chiffresIJOffre?: ChiffresIJOffre) => {
  if (!chiffresIJOffre) {
    if (formation && (formation.typeFamille === "2nde_commune" || formation.typeFamille === "1ere_commune")) {
      return false;
    }
    return true;
  }

  return Object.values(chiffresIJOffre).reduce((acc, value) => {
    if (
      // @ts-expect-error TODO
      typeof value.tauxInsertion === "undefined" ||
      // @ts-expect-error TODO
      typeof value.tauxPoursuite === "undefined" ||
      // @ts-expect-error TODO
      typeof value.tauxDevenirFavorable === "undefined"
    ) {
      return true;
    }
    return acc;
  }, false);
};

const isAnyDataMissingOfEffectifs = (formation?: Formation, chiffresEntreeOffre?: ChiffresEntreeOffreRentree) => {
  if (!formation || !chiffresEntreeOffre) {
    return true;
  }

  if (formation.typeFamille === "2nde_commune") {
    return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
  }

  if (formation.typeFamille === "1ere_commune") {
    return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
  }

  if (formation.typeFamille === "specialite") {
    if (chiffresEntreeOffre.dateOuverture - Number(CURRENT_RENTREE) === 0) {
      return typeof chiffresEntreeOffre.effectifAnnee2 === "undefined";
    }

    return (
      typeof chiffresEntreeOffre.effectifAnnee2 === "undefined" ||
      typeof chiffresEntreeOffre.effectifAnnee3 === "undefined"
    );
  }

  if (formation.typeFamille === "option") {
    return typeof chiffresEntreeOffre.effectifAnnee2 === "undefined";
  }

  if (chiffresEntreeOffre.dateOuverture - Number(CURRENT_RENTREE) === 0) {
    return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
  }

  if (Math.abs(chiffresEntreeOffre.dateOuverture - Number(CURRENT_RENTREE)) === 1) {
    if ((chiffresEntreeOffre.effectifs ?? []).length >= 2) {
      return (
        typeof chiffresEntreeOffre.effectifAnnee2 === "undefined" &&
        typeof chiffresEntreeOffre.effectifAnnee1 === "undefined"
      );
    } else {
      return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
    }
  }
  // @ts-expect-error TODO
  return chiffresEntreeOffre.effectifs?.some((f) => f === null);
};

export const InformationDonneeIncompletes = ({
  chiffresIJOffre,
  formation,
  chiffresEntreeOffre,
  codeRegion,
}: {
  codeRegion?: string;
  formation?: Formation;
  chiffresIJOffre?: ChiffresIJOffre;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  const isAnyDataMissing = useMemo(
    () =>
      isAnyDataMissingOfChiffresIJ(formation, chiffresIJOffre) ||
      isAnyDataMissingOfChiffresEntreeOffre(chiffresEntreeOffre?.[CURRENT_RENTREE]) ||
      isAnyDataMissingOfEffectifs(formation, chiffresEntreeOffre?.[CURRENT_RENTREE]),
    [formation, chiffresIJOffre, chiffresEntreeOffre]
  );

  if (!isAnyDataMissing) {
    return null;
  }

  return (
    <Callout
      body={
        <Flex gap={1}>
          <Text>L'établissement ne dispose pas de certaines données pour cette formation</Text>
          <Link
            href="https://aide.orion.inserjeunes.beta.gouv.fr/fr/article/pourquoi-certaines-donnees-sont-indisponibles-dans-orion-puqea5/"
            target="_blank"
          >
            <Text decoration={"underline"}>( Pourquoi ? )</Text>
          </Link>
        </Flex>
      }
      actionButton={
        <Link href={`/panorama/region/${codeRegion}`} passHref target="_blank">
          <Button color="bluefrance.113">
            Consulter les données régionales de la formation
            <Icon icon="ri:arrow-right-line" width={"16px"} height={"16px"} style={{ marginLeft: "8px" }} />
          </Button>
        </Link>
      }
    />
  );
};
