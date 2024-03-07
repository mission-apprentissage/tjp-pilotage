import { Badge, Flex, GridItem, Img, Text, useToken } from "@chakra-ui/react";

import { GlossaireShortcut } from "../../../../../../../components/GlossaireShortcut";
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
  codeRegion,
}: {
  indicateurs?: Indicateurs;
  codeRegion?: string;
}) => {
  return (
    <GridItem colSpan={12}>
      <Flex
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Text fontWeight={"bold"}>
          INDICATEURS ÉTABLISSEMENT (VOIE SCOLAIRE)
        </Text>
        <Badge variant="info" size={"md"}>
          Millésimes {indicateurs?.millesime}
        </Badge>
      </Flex>
      <Flex width={"100%"} gap={2} justifyContent={"space-between"} mt={"32px"}>
        <IndicateurValeurAjoutee indicateur={indicateurs?.valeurAjoutee} />
        <IndicateurTauxEmploi6mois indicateur={indicateurs?.tauxEmploi6mois} />
        <IndicateurPoursuiteDetudes indicateur={indicateurs?.tauxPoursuite} />
        <IndicateurTauxDevenirFavorable indicateur={indicateurs?.tauxDevenir} />
      </Flex>
      <DonneesIncompletes
        isMissingDatas={isMissingDatas(indicateurs)}
        codeRegion={codeRegion}
      />
    </GridItem>
  );
};
