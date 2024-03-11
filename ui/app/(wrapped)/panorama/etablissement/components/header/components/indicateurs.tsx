import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  GridItem,
  Img,
  Text,
  useToken,
} from "@chakra-ui/react";

import { GlossaireShortcut } from "../../../../../../../components/GlossaireShortcut";
import { TooltipIcon } from "../../../../../../../components/TooltipIcon";
import { useGlossaireContext } from "../../../../../glossaire/glossaireContext";
import { CounterChart } from "../../analyse-detaillee/components/CounterChart";
import { DashboardCard } from "../../DashboardCard";
import type { Indicateur, Indicateurs } from "../types";
import { DonneesIncompletes } from "./donneesIncompletes";

const getCompareData = (
  compareTo:
    | {
        value: string;
        direction: "up" | "down" | "equal";
        color: "green" | "red" | "grey";
      }
    | undefined
) => {
  const { value, direction, color } = compareTo || {};

  if (!value) return null;

  const [green, red, grey] = useToken("colors", [
    "success.425",
    "error.425",
    "grey.425",
  ]);

  return (
    <Flex color={{ green, red, grey }[color!]}>
      <Img
        src={
          {
            up: `/icons/arrow_${direction}.svg`,
            down: `/icons/arrow_${direction}.svg`,
            equal: `/icons/arrow_right.svg`,
          }[direction!]
        }
        alt={direction}
      />
      <Text fontWeight={"bold"}>{value}</Text>
    </Flex>
  );
};

const IndicateurValeurAjoutee = ({
  indicateur,
}: {
  indicateur: Indicateur;
}) => (
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
              Capacité de l'établissement à insérer, en prenant en compte le
              profil social des élèves et le taux de chômage de la zone
              d'emploi, comparativement au taux de référence d’établissements
              similaires.
            </Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    }
    grow={1}
    minH={"120px"}
  >
    <CounterChart
      data={indicateur?.value?.toFixed(0)}
      type="absolute"
      compareData={getCompareData(indicateur?.compareTo)}
    />
  </DashboardCard>
);

const IndicateurTauxEmploi6mois = ({
  indicateur,
}: {
  indicateur: Indicateur;
}) => (
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
            <Text>
              La part de ceux qui sont en emploi 6 mois après leur sortie
              d’étude.
            </Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    }
    minH={"120px"}
  >
    <CounterChart
      data={indicateur?.value?.toFixed(0)}
      type="percentage"
      compareData={getCompareData(indicateur?.compareTo)}
    />
  </DashboardCard>
);

const IndicateurPoursuiteDetudes = ({
  indicateur,
}: {
  indicateur: Indicateur;
}) => (
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
            <Text>
              Tout élève inscrit à N+1 (réorientation et redoublement compris).
            </Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    }
    minH={"120px"}
  >
    <CounterChart
      data={indicateur?.value?.toFixed(0)}
      type="percentage"
      compareData={getCompareData(indicateur?.compareTo)}
    />
  </DashboardCard>
);

const IndicateurTauxDevenirFavorable = ({
  indicateur,
}: {
  indicateur: Indicateur;
}) => {
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
                (nombre d'élèves inscrits en formation + nombre d'élèves en
                emploi) / nombre d'élèves en entrée en dernière année de
                formation.
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
        />
      }
      minH={"120px"}
    >
      <CounterChart
        data={indicateur?.value?.toFixed(0)}
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

export const IndicateursSection = ({
  indicateurs,
}: {
  indicateurs?: Indicateurs;
}) => {
  const { openGlossaire } = useGlossaireContext();
  return (
    <GridItem colSpan={12}>
      <Flex
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Flex direction={"row"} alignItems={"center"}>
          <Text fontSize={{ base: "14px" }} fontWeight={"bold"}>
            INDICATEURS ÉTABLISSEMENT
          </Text>
          <TooltipIcon
            ml="2"
            label="Ces chiffres incluent l'apprentissage pour les établissements qui en proposent."
            placement="right"
          />
        </Flex>
        <Badge
          variant="info"
          size={"md"}
          as="button"
          onClick={() => openGlossaire("inserjeunes")}
        >
          Millésimes {indicateurs?.millesime}
          <QuestionOutlineIcon ml={"0.2rem"} />
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
