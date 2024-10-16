import { Box, Flex, Select, Text, useToken } from "@chakra-ui/react";
import _ from "lodash";
import { useMemo } from "react";
import { Scope, ScopeEnum } from "shared";

import { GlossaireShortcut } from "../../../../../../../../components/GlossaireShortcut";
import { formatNumber } from "../../../../../../../../utils/formatUtils";
import {
  Formation,
  FormationIndicateurs,
  TauxAttractiviteType,
} from "../../../../types";
import { displayTauxAttractiviteDatas } from "./displayIndicators";
import { TauxPressionRemplissageGraph } from "./TauxPressionRemplissageGraph";

const tauxAttractiviteOptions = (isBTS: boolean) => [
  {
    label: "Taux de remplissage",
    value: "tauxRemplissage",
  },
  {
    label: isBTS ? "Taux de demande" : "Taux de pression",
    value: "tauxPression",
  },
];

export const getTauxAttractiviteDatas = (
  datas: FormationIndicateurs,
  tauxAttractiviteSelected: TauxAttractiviteType
): Record<string, Array<number | undefined>> => {
  const scopedDatas: Record<string, Array<number | undefined>> = {};
  const scopes = [
    ScopeEnum.national,
    ScopeEnum.région,
    ScopeEnum.académie,
    ScopeEnum.département,
  ];
  const values =
    tauxAttractiviteSelected === "tauxRemplissage"
      ? datas.tauxRemplissages
      : datas.tauxPressions;

  scopes.forEach((scope) => {
    const scopeValues = values.filter((d) => d.scope === scope);
    if (scopeValues.length > 0) {
      scopedDatas[scope] = scopeValues.map(({ value }) =>
        typeof value === "undefined" ? undefined : formatNumber(value, 2)
      );
    }
  });

  return scopedDatas;
};

const GlossaireIcon = ({
  isBTS,
  tauxAttractiviteSelected,
}: {
  isBTS: boolean;
  tauxAttractiviteSelected: TauxAttractiviteType;
}) => {
  if (tauxAttractiviteSelected === "tauxRemplissage") {
    return (
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"taux-de-remplissage"}
        tooltip={
          <Box>
            <Text>
              Le ratio entre l’effectif d’entrée en formation et sa capacité.
            </Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    );
  }

  if (tauxAttractiviteSelected === "tauxPression") {
    if (isBTS) {
      return (
        <GlossaireShortcut
          tooltip={
            <Box>
              <Text>
                Le ratio entre le nombre de voeux et la capacité de la formation
                dans l'établissement.
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          glossaireEntryKey="taux-de-demande"
        />
      );
    } else {
      return (
        <GlossaireShortcut
          tooltip={
            <Box>
              <Text>
                Le ratio entre le nombre de premiers voeux et la capacité de la
                formation dans l'établissement.
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          glossaireEntryKey="taux-de-pression"
        />
      );
    }
  }

  return null;
};

export const TauxPressionRemplissageCard = ({
  formation,
  indicateurs,
  scope,
  tauxAttractiviteSelected,
  handleChangeTauxAttractivite,
}: {
  formation: Formation;
  indicateurs: FormationIndicateurs;
  scope: Scope;
  tauxAttractiviteSelected: TauxAttractiviteType;
  handleChangeTauxAttractivite: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}) => {
  const blue = useToken("colors", "bluefrance.113");
  const green = useToken("colors", "greenArchipel.557");
  const orange = useToken("colors", "orangeTerreBattue.645");
  const purple = useToken("colors", "purpleGlycine.494");

  const colors: Record<string, string> = {
    [ScopeEnum.national]: purple,
    [ScopeEnum.région]: green,
    [ScopeEnum.académie]: blue,
    [ScopeEnum.département]: orange,
  };

  const lineChartColumns = useMemo(() => {
    const values =
      tauxAttractiviteSelected === "tauxRemplissage"
        ? indicateurs.tauxRemplissages
        : indicateurs.tauxPressions;

    return _.uniq(
      values.map(({ rentreeScolaire }) => `RS ${rentreeScolaire}`)
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [tauxAttractiviteSelected]);

  const lineChartDatas = useMemo(
    () => getTauxAttractiviteDatas(indicateurs, tauxAttractiviteSelected),
    [indicateurs, tauxAttractiviteSelected]
  );

  return (
    <Flex
      direction={"column"}
      gap={4}
      borderRadius={"4px"}
      border={"1px solid"}
      borderColor={"grey.925"}
      p={"12px"}
      bg={"white"}
      minHeight={"200px"}
    >
      <Flex direction={"column"} gap={2}>
        <Flex justifyContent={"space-between"}>
          <Select
            width="64"
            size="sm"
            variant="newInput"
            bg={"grey.150"}
            onChange={handleChangeTauxAttractivite}
            value={tauxAttractiviteSelected}
          >
            {tauxAttractiviteOptions(formation.isBTS).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label.toUpperCase()}
              </option>
            ))}
          </Select>
          <GlossaireIcon
            isBTS={formation.isBTS}
            tauxAttractiviteSelected={tauxAttractiviteSelected}
          />
        </Flex>
      </Flex>
      {displayTauxAttractiviteDatas(lineChartDatas) ? (
        <TauxPressionRemplissageGraph
          title={
            tauxAttractiviteSelected === "tauxRemplissage"
              ? "Taux de remplissage"
              : "Taux de pression"
          }
          data={lineChartDatas}
          colors={colors}
          categories={lineChartColumns}
          defaultMainKey={scope}
          isPercentage={tauxAttractiviteSelected === "tauxRemplissage"}
        />
      ) : (
        <Flex
          alignItems={"flex-end"}
          justifyContent={"flex-end"}
          height={"100%"}
        >
          <Text>Indisponible</Text>
        </Flex>
      )}
    </Flex>
  );
};
