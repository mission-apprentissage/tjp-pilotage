import { Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import CarteFranceRegions from "../../../../public/fond_carte_regions.json";
import { IndicateurType } from "../types";

export const CartoGraph = function <
  F extends {
    codeRegion: string;
    libelleRegion?: string;
    insertion?: number;
    poursuite?: number;
  }[],
>({ graphData, indicateur }: { graphData?: F; indicateur: IndicateurType }) {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const geoMapRegions = JSON.parse(JSON.stringify(CarteFranceRegions));

  echarts.registerMap("regions", geoMapRegions);

  // Utilisée pour supprimer les valeurs extrèmes
  const removeMin = (array: number[]): number[] => {
    const min = Math.min(...array);
    return array.filter((value) => value != min);
  };

  const removeMax = (array: number[]): number[] => {
    const max = Math.max(...array);
    return array.filter((value) => value != max);
  };

  //TODO : améliorer la gestion de la graduation dynamique
  const getPieces = (
    indicateur: IndicateurType
  ): { min: number; max: number; label: string; color: string }[] => {
    const data = Array.from(
      graphData?.map((it) => it[indicateur] ?? -1) ?? []
    ).filter((value) => value != -1);
    const min = Math.min(...removeMin(data));
    const max = Math.max(...removeMax(data));
    const diff = max - min;
    const steps = [
      min,
      Math.ceil(min + diff / 4),
      Math.ceil(max - diff / 4),
      max,
    ];

    const colorRange = ["#D5DBEF", "#ABB8DE", "#5770BE", "#000091"];

    return [
      {
        min: 0,
        max: steps[1] - 1,
        label: `< ${steps[1] - 1}%`,
        color: colorRange[0],
      },
      {
        min: steps[1],
        max: steps[2] - 1,
        label: `< ${steps[2] - 1}%`,
        color: colorRange[1],
      },
      {
        min: steps[2],
        max: steps[3],
        label: `< ${steps[3]}%`,
        color: colorRange[2],
      },
      {
        min: steps[3],
        max: 100,
        label: `> ${steps[3]}%`,
        color: colorRange[3],
      },
    ];
  };

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "item",
        showDelay: 0,
        transitionDuration: 0.2,
        //@ts-ignore
        formatter: function (params: any) {
          if (params.data && params.data?.value)
            return `${params.name} : ${params.data?.value}%`;
          return `Aucune donnée disponible pour ${params.name}`;
        },
      },
      visualMap: {
        type: "piecewise",
        splitNumber: 4,
        pieces: getPieces(indicateur),
        left: "left",
        min: 0,
        max: 100,
        orient: "horizontal",
      },
      // permet de supprimer l'aspect "écrasé" de la carte
      projection: {
        project: (point: [number, number]): [number, number] => [
          (point[0] / 180) * Math.PI,
          -Math.log(Math.tan((Math.PI / 2 + (point[1] / 180) * Math.PI) / 2)),
        ],
        unproject: (point: [number, number]): [number, number] => [
          (point[0] * 180) / Math.PI,
          ((2 * 180) / Math.PI) * Math.atan(Math.exp(point[1])) - 90,
        ],
      },
      series: [
        {
          name: "regions",
          type: "map",
          map: "regions",
          emphasis: {
            label: {
              show: false,
              color: "#000091",
              fontWeight: 700,
            },
            itemStyle: {
              areaColor: "white",
              borderColor: "#000091",
            },
          },
          select: {
            disabled: true,
          },
          nameProperty: "reg",
          nameMap: {
            "52": "Pays de la Loire",
            "24": "Centre-Val de Loire",
            "03": "Guyane",
            "93": "Provence-Alpes-Côte d'Azur",
            "94": "Corse",
            "32": "Hauts-de-France",
            "11": "Île-de-France",
            "01": "Guadeloupe",
            "44": "Grand Est",
            "02": "Martinique",
            "04": "La Réunion",
            "84": "Auvergne-Rhône-Alpes",
            "76": "Occitanie",
            "28": "Normandie",
            "75": "Nouvelle-Aquitaine",
            "27": "Bourgogne-Franche-Comté",
            "53": "Bretagne",
            "06": "Mayotte",
          },
          itemStyle: {
            borderColor: "#FFF",
          },
          data: graphData?.map((region) => {
            return {
              name: region.libelleRegion,
              value: region[indicateur],
            };
          }),
        },
      ],
    }),
    [graphData]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option);
  }, [option, graphData]);

  return (
    <Box position="relative" overflow="visible !important">
      <Box
        ref={containerRef}
        position="absolute"
        right="0"
        top="0"
        left="0"
        bottom="0"
        height={"540"}
      ></Box>
    </Box>
  );
};
