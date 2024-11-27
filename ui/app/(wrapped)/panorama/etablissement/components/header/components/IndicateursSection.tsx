import { Badge, Box, Flex, GridItem, Img, Text, Tooltip, useToken } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import type {
  CompareTo,
  Indicateur,
  Indicateurs,
} from "@/app/(wrapped)/panorama/etablissement/components/header/types";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { formatNumber } from "@/utils/formatUtils";

import { DonneesIncompletes } from "./DonneesIncompletes";

const getCompareData = (compareTo?: CompareTo) => {
  const { value, direction } = compareTo || {};

  if (!value || !direction) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [green, red, grey] = useToken("colors", [
    // TODO useToken
    "success.425",
    "error.425",
    "grey.425",
  ]);
  const arrowImg: string = {
    up: `/icons/arrow_${direction}.svg`,
    down: `/icons/arrow_${direction}.svg`,
    equal: `/icons/arrow_right.svg`,
  }[direction];
  const color = { up: green, down: red, equal: grey }[direction];

  return (
    <Tooltip label={compareTo?.description}>
      <Flex color={color}>
        <Img src={arrowImg} alt={direction} />
        <Text fontWeight={"bold"}>{value}</Text>
      </Flex>
    </Tooltip>
  );
};

const IndicateurValeurAjoutee = ({ indicateur }: { indicateur?: Indicateur }) => (
  <DashboardCard
    label="Valeur ajoutée"
    tooltip={
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"valeur-ajoutee"}
        tooltip={
          <Box>
            <Text>
              Capacité de l'établissement à insérer, en prenant en compte le profil social des élèves et le taux de
              chômage de la zone d'emploi, comparativement au taux de référence d’établissements similaires.
            </Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    }
    grow={1}
    minH={"120px"}
    badge={
      <Badge variant="lavander" size={"xs"}>
        Étab.
      </Badge>
    }
  >
    <CounterChart
      data={formatNumber(indicateur?.value)}
      type="absolute"
      compareData={getCompareData(indicateur?.compareTo)}
    />
  </DashboardCard>
);

const IndicateurTauxEmploi6mois = ({ indicateur }: { indicateur?: Indicateur }) => (
  <DashboardCard
    label="Taux d'emploi à 6 mois"
    grow={1}
    tooltip={
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"taux-emploi-6-mois"}
        tooltip={
          <Box>
            <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’étude.</Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    }
    minH={"120px"}
    badge={
      <Badge variant="lavander" size={"xs"}>
        Étab.
      </Badge>
    }
  >
    <CounterChart
      data={formatNumber(indicateur?.value)}
      type="percentage"
      compareData={getCompareData(indicateur?.compareTo)}
    />
  </DashboardCard>
);

const IndicateurPoursuiteDetudes = ({ indicateur }: { indicateur?: Indicateur }) => (
  <DashboardCard
    label="Poursuite d'études"
    grow={1}
    tooltip={
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"taux-poursuite-etudes"}
        tooltip={
          <Box>
            <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    }
    minH={"120px"}
    badge={
      <Badge variant="lavander" size={"xs"}>
        Étab.
      </Badge>
    }
  >
    <CounterChart
      data={formatNumber(indicateur?.value)}
      type="percentage"
      compareData={getCompareData(indicateur?.compareTo)}
    />
  </DashboardCard>
);

const IndicateurTauxDevenirFavorable = ({ indicateur }: { indicateur?: Indicateur }) => {
  return (
    <DashboardCard
      label="Taux de devenir favorable"
      grow={1}
      tooltip={
        <GlossaireShortcut
          display={"inline"}
          marginInline={1}
          iconSize={"16px"}
          glossaireEntryKey={"taux-de-devenir-favorable"}
          tooltip={
            <Box>
              <Text>
                (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
                dernière année de formation.
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
        />
      }
      minH={"120px"}
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      <CounterChart
        data={formatNumber(indicateur?.value)}
        compareData={getCompareData(indicateur?.compareTo)}
        type="percentage"
      />
    </DashboardCard>
  );
};

const isMissingDatas = (indicateurs?: Indicateurs) => {
  return (
    typeof indicateurs === "undefined" ||
    typeof indicateurs?.valeurAjoutee === "undefined" ||
    typeof indicateurs?.tauxEmploi6mois === "undefined" ||
    typeof indicateurs?.tauxPoursuite === "undefined" ||
    typeof indicateurs?.tauxDevenir === "undefined"
  );
};

export const IndicateursSection = ({ indicateurs }: { indicateurs?: Indicateurs }) => {
  const { openGlossaire } = useGlossaireContext();
  return (
    <GridItem colSpan={12}>
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
        <Flex direction={"row"} alignItems={"center"}>
          <Text fontSize={{ base: "14px" }} fontWeight={"bold"}>
            INDICATEURS ÉTABLISSEMENT
          </Text>
          <GlossaireShortcut
            display={"inline"}
            ml={2}
            mr={2}
            pr={2}
            iconSize={"14px"}
            glossaireEntryKey={"inserjeunes"}
            tooltip={
              <Box>
                <Text>Ces chiffres incluent l'apprentissage pour les établissements qui en proposent.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
          />
        </Flex>
        <Badge variant="info" size={"md"} as="button" onClick={() => openGlossaire("millesime")}>
          Millésimes {indicateurs?.millesime}
          <GlossaireShortcut
            marginLeft={1}
            glossaireEntryKey={"millesime"}
            tooltip={
              <Box>
                <Text>
                  Cohorte d’élèves pour laquelle les indicateurs InserJeunes ont été mesurés systématiquement sur 2
                  années scolaires cumulées.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
          />
        </Badge>
      </Flex>
      <Flex width={"100%"} gap={2} justifyContent={"space-between"} mt={"16px"}>
        <IndicateurValeurAjoutee indicateur={indicateurs?.valeurAjoutee} />
        <IndicateurTauxEmploi6mois indicateur={indicateurs?.tauxEmploi6mois} />
        <IndicateurPoursuiteDetudes indicateur={indicateurs?.tauxPoursuite} />
        <IndicateurTauxDevenirFavorable indicateur={indicateurs?.tauxDevenir} />
      </Flex>
      <DonneesIncompletes isMissingDatas={isMissingDatas(indicateurs)} />
    </GridItem>
  );
};
