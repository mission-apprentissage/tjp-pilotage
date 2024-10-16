import { Button, Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { Callout } from "../../../../../../../../components/Callout";
import {
  Formation,
  FormationIndicateurs,
  TauxAttractiviteType,
  TauxIJType,
} from "../../../../types";
import {
  displayEffectifsDatas,
  displayEtablissementsDatas,
  displayIJDatas,
  displaySoldeDePlacesTransformees,
  displayTauxAttractiviteDatas,
} from "./displayIndicators";
import { getTauxAttractiviteDatas } from "./TauxPressionRemplissageCard";

const displayTauxAttractivite = (
  data: FormationIndicateurs,
  tauxAttractiviteSelected: TauxAttractiviteType
) => {
  return displayTauxAttractiviteDatas(
    getTauxAttractiviteDatas(data, tauxAttractiviteSelected)
  );
};

export const DonneesManquantes = ({
  codeNsf,
  codeRegion,
  cfd,
  tauxIJSelected,
  tauxAttractiviteSelected,
  formation,
  indicateurs,
}: {
  formation: Formation;
  codeNsf: string;
  codeRegion?: string;
  cfd: string;
  indicateurs: FormationIndicateurs;
  tauxIJSelected: TauxIJType;
  tauxAttractiviteSelected: TauxAttractiviteType;
}) => {
  if (
    !formation.isScolaire ||
    (displaySoldeDePlacesTransformees(indicateurs) &&
      displayEffectifsDatas(indicateurs) &&
      displayEtablissementsDatas(indicateurs) &&
      displayIJDatas(indicateurs, tauxIJSelected) &&
      displayTauxAttractivite(indicateurs, tauxAttractiviteSelected))
  ) {
    return null;
  }

  return (
    <Callout
      h={"fit-content"}
      body={
        <Flex gap={1} direction={"column"}>
          <Text fontWeight={"bold"}>Données manquantes</Text>
          <Text>
            Certaines données ne sont pas disponibles pour le territoire choisi
            ({" "}
            <Link
              href="https://aide.orion.inserjeunes.beta.gouv.fr/fr/article/pourquoi-certaines-donnees-sont-indisponibles-dans-orion-puqea5/"
              target="_blank"
            >
              <Text as="span" decoration={"underline"} px={1}>
                Pourquoi ?
              </Text>
            </Link>{" "}
            ) .
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
            <Icon
              icon="ri:arrow-right-line"
              width={"16px"}
              height={"16px"}
              style={{ marginLeft: "8px" }}
            />
          </Button>
        </Link>
      }
    />
  );
};
