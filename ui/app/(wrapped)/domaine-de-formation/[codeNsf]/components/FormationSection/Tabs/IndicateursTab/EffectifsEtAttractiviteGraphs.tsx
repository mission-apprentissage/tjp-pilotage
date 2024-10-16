import { Box, Flex, Text, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";
import type { ScopeZone } from "shared";

import type {
  Formation,
  FormationIndicateurs,
  TauxAttractiviteType,
} from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { BadgeScope } from "@/components/BadgeScope";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

import { displayEffectifsDatas, displayEtablissementsDatas } from "./displayIndicators";
import { TauxPressionRemplissageCard } from "./TauxPressionRemplissageCard";

const VerticalBarChart = ({
  data,
}: {
  data: {
    label: string;
    value: number;
  }[];
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const gris = useToken("colors", "grey.850");
  const bf113 = useToken("colors", "bluefrance.113");
  const be850a = useToken("colors", "bluefrance.850_active");
  const be850 = useToken("colors", "bluefrance.850");

  const colors: Record<number, string> = {
    0: gris,
    1: be850,
    2: be850a,
    3: bf113,
  };

  const getXAxisData = () => {
    if (data !== undefined) {
      return data.map((data) => data.label).reverse();
    }
    return [];
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      textStyle: {
        fontFamily: "Marianne, Arial",
      },
      animationDelay: 0.5,
      responsive: true,
      maintainAspectRatio: true,
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: "{a} : {c}",
      },
      legend: {
        data: getXAxisData(),
        icon: "square",
        orient: "vertical",
        left: 0,
        bottom: 0,
        padding: 0,
        itemWidth: 15,
        itemStyle: {
          color: "inherit",
        },
        textStyle: {
          color: "black",
          fontSize: 12,
        },
      },
      grid: {
        bottom: 1,
        top: 25,
        width: "70%",
        right: 0,
        height: "100%",
      },
      xAxis: {
        type: "category",
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "black",
            width: 0.5,
          },
          onZero: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        show: false, // Hide Y-axis
      },
      series: data
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((serie, index) => ({
          data: [serie.value],
          name: serie.label,
          type: "bar",
          color: colors[index],
          maxBarWidth: "50px",
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            distance: 10,
            show: true,
            position: "top",
            formatter: "{c}",
            rich: {
              percent: {
                fontSize: "11px",
              },
            },
            fontSize: "13px",
            fontWeight: 700,
          },
        })),
    }),
    [data, getXAxisData, colors]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option, true);
  }, [data]);

  return (
    <Box position="relative" overflow="visible !important" w={"100%"} h={"100%"}>
      <Box ref={containerRef} h={"100%"} w={"100%"}></Box>
    </Box>
  );
};

export const EffectifsEtAttractiviteGraphs = ({
  formation,
  indicateurs,
  scope,
  tauxAttractiviteSelected,
  handleChangeTauxAttractivite,
}: {
  formation: Formation;
  indicateurs: FormationIndicateurs;
  scope: ScopeZone;
  tauxAttractiviteSelected: TauxAttractiviteType;
  handleChangeTauxAttractivite: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <Flex direction={"column"} gap={4}>
      <Flex direction={"row"} gap={4} wrap={"nowrap"}>
        <Flex
          direction={"column"}
          gap={3}
          borderRadius={"4px"}
          border={"1px solid"}
          borderColor={"grey.925"}
          p={"12px"}
          bg={"white"}
          height={"200px"}
          flex={1}
        >
          <Flex direction="row" justifyContent={"space-between"}>
            <Flex direction="column" gap={2}>
              <Text color="grey.50" fontSize={"15px"}>
                Etablissements
              </Text>
              <BadgeScope scope={scope} />
            </Flex>
          </Flex>
          {displayEtablissementsDatas(indicateurs) ? (
            <VerticalBarChart
              data={indicateurs.etablissements.map(
                // @ts-expect-error TODO
                ({ rentreeScolaire, nbEtablissements }) => ({
                  label: `RS ${rentreeScolaire}`,
                  value: nbEtablissements,
                })
              )}
            />
          ) : (
            <Flex alignItems={"flex-end"} justifyContent={"flex-end"} height={"100%"}>
              <Text>Indisponible</Text>
            </Flex>
          )}
        </Flex>
        <Flex
          direction={"column"}
          gap={3}
          borderRadius={"4px"}
          border={"1px solid"}
          borderColor={"grey.925"}
          p={"12px"}
          bg={"white"}
          height={"200px"}
          flex={1}
        >
          <Flex direction="row" justifyContent={"space-between"}>
            <Flex direction="column" gap={2}>
              <Text color="grey.50" fontSize={"15px"}>
                Effectif en entrée
              </Text>
              <BadgeScope scope={scope} />
            </Flex>
            <GlossaireShortcut
              display={"inline"}
              marginInline={1}
              iconSize={"16px"}
              glossaireEntryKey={"effectif-en-entree"}
              tooltip={
                <Box>
                  <Text>Effectifs en entrée en première année de formation.</Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
            />
          </Flex>
          {displayEffectifsDatas(indicateurs) ? (
            <VerticalBarChart
              data={indicateurs.effectifs.map(
                // @ts-expect-error TODO
                ({ rentreeScolaire, effectif }) => ({
                  label: `RS ${rentreeScolaire}`,
                  value: effectif,
                })
              )}
            />
          ) : (
            <Flex alignItems={"flex-end"} justifyContent={"flex-end"} height={"100%"}>
              <Text>Indisponible</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      <TauxPressionRemplissageCard
        formation={formation}
        indicateurs={indicateurs}
        scope={scope}
        handleChangeTauxAttractivite={handleChangeTauxAttractivite}
        tauxAttractiviteSelected={tauxAttractiviteSelected}
      />
    </Flex>
  );
};
