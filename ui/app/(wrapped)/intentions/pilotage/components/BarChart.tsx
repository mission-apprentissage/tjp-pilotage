import { AspectRatio, Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { formatPercentage } from "@/utils/formatUtils";

import { FormationsPilotageIntentions } from "../types";

type PositionQuadrant = "Q1" | "Q2" | "Q3" | "Q4" | "Hors quadrant";

type StatsPositionQuadrant = {
  ["Places fermées"]: number;
  ["Places ouvertes"]: number;
  ["Places colorées"]: number;
  ["Places transformées"]: number;
  ["Solde"]: number;
  ["Effectif"]: number;
  ["Taux de transformation"]: string;
  ["Ratio de fermeture"]: string;
};

export const BarChart = ({
  formations,
}: {
  formations?: FormationsPilotageIntentions["formations"];
}) => {
  if (!formations) return <></>;

  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf113 = useToken("colors", "bluefrance.113");
  const bf850 = useToken("colors", "bluefrance.850");
  const bf850_active = useToken("colors", "bluefrance.850_active");
  const grey425 = useToken("colors", "grey.425");

  const positionsQuadrant: PositionQuadrant[] = [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Hors quadrant",
  ];

  const getStatsPositionQuadrant = (
    positionQuadrant: PositionQuadrant
  ): StatsPositionQuadrant => {
    const statsPositionQuadrant: StatsPositionQuadrant = {
      ["Places fermées"]: 0,
      ["Places ouvertes"]: 0,
      ["Places colorées"]: 0,
      ["Places transformées"]: 0,
      ["Solde"]: 0,
      ["Effectif"]: 0,
      ["Taux de transformation"]: "-",
      ["Ratio de fermeture"]: "-",
    };

    formations
      .filter((formation) => formation.positionQuadrant === positionQuadrant)
      .map((formation) => {
        if (statsPositionQuadrant) {
          statsPositionQuadrant["Places fermées"] += formation.placesFermees;
          statsPositionQuadrant["Places ouvertes"] += formation.placesOuvertes;
          statsPositionQuadrant["Places colorées"] += formation.placesColorees;
          statsPositionQuadrant["Effectif"] += formation.effectif;
          statsPositionQuadrant["Places transformées"] +=
            formation.placesTransformees;
          statsPositionQuadrant["Solde"] +=
            formation.placesOuvertes - formation.placesFermees;
        }
      });

    statsPositionQuadrant["Taux de transformation"] = formatPercentage(
      statsPositionQuadrant["Places transformées"] /
        statsPositionQuadrant["Effectif"],
      2
    );
    statsPositionQuadrant["Ratio de fermeture"] = formatPercentage(
      statsPositionQuadrant["Places fermées"] /
        statsPositionQuadrant["Places transformées"],
      2
    );

    return statsPositionQuadrant;
  };

  const seriesOption: echarts.BarSeriesOption = {
    type: "bar",
    barWidth: 100,
    yAxisIndex: 0,
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      animationDelay: 0.5,
      responsive: true,
      maintainAspectRatio: true,
      title: {
        text: "Répartition des places transformées par section du quadrant",
        show: false,
        textStyle: {
          color: bf113,
          fontFamily: "Marianne",
          fontSize: 16,
          fontWeight: 500,
          texttransform: "uppercase",
        },
      },
      tooltip: [
        {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          textStyle: {
            width: "fit-content",
          },

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            return `
            <div style="min-width: fit-content;">
              <span style="font-weight: 700;">${params[0]?.name} :</span>
              <br />
              Ratio de fermetures :
              <span style="font-weight: 700;">
                ${
                  getStatsPositionQuadrant(params[0]?.name as PositionQuadrant)[
                    "Ratio de fermeture"
                  ]
                }
              </span>
              <br />
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${params[2]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. colorées :
                  <span style="font-weight: 700;">${params[2]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${params[1]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. ouvertes :
                  <span style="font-weight: 700;">${params[1]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${params[0]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. fermées :
                  <span style="font-weight: 700;"> ${params[0]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 15px;">
                <span>
                  Pl. transformées :
                  <span style="font-weight: 700;"> ${
                    getStatsPositionQuadrant(
                      params[0]?.name as PositionQuadrant
                    )["Places transformées"]
                  }</span>
                </span>
              </div>
            </div>
            `;
          },
        },
      ],
      toolbox: {
        showTitle: false,
        tooltip: {
          show: true,
          textStyle: {
            color: bf113,
            backgroundColor: "transparent",
            fontSize: 12,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => `${params.title}`,
        },
        feature: {
          saveAsImage: {
            title: "Télécharger sous format .png",
            name: "Répartition des places transformées par section du quadrant",
            type: "png",
            backgroundColor: "transparent",
            textStyle: {
              color: bf113,
            },
            iconStyle: {
              color: bf113,
              width: 20,
            },
            icon: "image://../icons/download.svg",
          },
        },
      },
      legend: {
        show: true,
        orient: "vertical",
        bottom: "20%",
        right: 0,
        itemGap: 15,
        itemWidth: 15,
        selectedMode: false,
        formatter: (value: string) =>
          `${value.replace("Place(s) ", "Pl. ").replace("(s)", "s")}`,
        data: [
          {
            name: "Place(s) colorée(s)",
            icon: "square",
          },
          {
            name: "Place(s) ouverte(s)",
            icon: "square",
          },
          {
            name: "Place(s) fermée(s)",
            icon: "square",
          },
        ],
      },
      grid: {
        id: 1,
        left: 200,
        right: "15%",
        bottom: 0,
      },
      xAxis: {
        data: positionsQuadrant,
        type: "category",
        show: true,
        axisLabel: {
          show: false,
          fontSize: 14,
          color: grey425,
          fontWeight: 700,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          onZero: true,
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          data: positionsQuadrant.map(
            (positionQuadrant) =>
              getStatsPositionQuadrant(positionQuadrant as PositionQuadrant)[
                "Places fermées"
              ]
          ),
          stack: "placesTransformées",
          color: bf113,
          name: "Place(s) fermée(s)",
          ...seriesOption,
        },
        {
          data: positionsQuadrant.map(
            (positionQuadrant) =>
              getStatsPositionQuadrant(positionQuadrant as PositionQuadrant)[
                "Places ouvertes"
              ]
          ),
          stack: "placesTransformées",
          color: bf850_active,
          name: "Place(s) ouverte(s)",
          ...seriesOption,
        },
        {
          data: positionsQuadrant.map(
            (positionQuadrant) =>
              getStatsPositionQuadrant(positionQuadrant as PositionQuadrant)[
                "Places colorées"
              ]
          ),
          stack: "placesTransformées",
          color: bf850,
          barWidth: 45,
          name: "Place(s) colorée(s)",
          ...seriesOption,
        },
      ],
    }),
    [formations]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option, true);
  }, [formations]);

  return (
    <>
      <Box width={"100%"}>
        <Box>
          <AspectRatio ratio={4}>
            <Box position="relative" overflow={"visible !important"}>
              <Box ref={containerRef} h={300} w={"100%"}></Box>
            </Box>
          </AspectRatio>
        </Box>
      </Box>
    </>
  );
};
