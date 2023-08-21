import { Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import CarteFranceRegions from "../../../../public/fond_carte_regions.json";

export const CartoGraph = function <
  F extends {
    codeRegion: string;
    libelleRegion?: string;
    tauxInsertion6mois?: number;
    tauxPoursuiteEtudes?: number;
    tauxDecrochage?: number;
  }[]
>({
  graphData,
  indicateur,
}: {
  graphData?: F;
  indicateur: "tauxInsertion6mois" | "tauxPoursuiteEtudes" | "tauxDecrochage";
}) {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const geoMapRegions = JSON.parse(JSON.stringify(CarteFranceRegions));

  echarts.registerMap("regions", geoMapRegions);

  const getPieces = (
    indicateur: "tauxInsertion6mois" | "tauxPoursuiteEtudes" | "tauxDecrochage"
  ) => {
    if (indicateur === "tauxDecrochage") {
      return [
        { min: 0, max: 10, label: "< 10%", color: "#D5DBEF" },
        { min: 11, max: 12, label: "< 12%", color: "#ABB8DE" },
        { min: 13, max: 14, label: "< 14%", color: "#5770BE" },
        { min: 15, max: 100, label: "> 15%", color: "#000091" },
      ];
    } else {
      return [
        { min: 0, max: 39, label: "< 40%", color: "#D5DBEF" },
        { min: 40, max: 44, label: "< 45%", color: "#ABB8DE" },
        { min: 45, max: 49, label: "< 50%", color: "#5770BE" },
        { min: 50, max: 100, label: "> 50%", color: "#000091" },
      ];
    }
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
            focus: "self",
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
        height={"550"}
      ></Box>
    </Box>
  );
};
