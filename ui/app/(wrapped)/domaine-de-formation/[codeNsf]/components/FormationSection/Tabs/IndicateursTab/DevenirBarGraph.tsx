import { Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import type { TauxIJValues } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { formatPercentage } from "@/utils/formatUtils";

export type DevenirBarGraphData = {
  [key: string]: {
    annee: string;
    libelleAnnee: string;
    apprentissage?: number;
    scolaire?: number;
  };
};

const getXAxisData = (datas: TauxIJValues) => {
  return datas.map((data) => data.libelle);
};

export const DevenirBarGraph = function ({
  datas,
  hasVoieScolaire,
  hasVoieApprentissage,
}: {
  datas: TauxIJValues;
  hasVoieScolaire: boolean;
  hasVoieApprentissage: boolean;
}) {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const blue = useToken("colors", "blueCumulus.526");
  const mustard = useToken("colors", "yellowMoutarde.679");

  const series: {
    name: string;
    data: (number | undefined)[];
    color: string;
  }[] = [];

  if (hasVoieScolaire) {
    series.push({
      name: `Voie scolaire${datas.some((d) => d.scolaire !== undefined) ? "" : " (indisponible)"}`,
      data: datas.map((data) => data.scolaire),
      color: blue,
    });
  }

  if (hasVoieApprentissage) {
    series.push({
      name: `Apprentissage${datas.some((d) => d.apprentissage !== undefined) ? "" : " (indisponible)"}`,
      data: datas.map((data) => data.apprentissage),
      color: mustard,
    });
  }

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      textStyle: {
        fontFamily: "Marianne, Arial",
      },
      animationDelay: 1,
      responsive: true,
      maintainAspectRatio: true,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        valueFormatter: (value) => formatPercentage(value as number, 2, "-"),
      },
      legend: {
        show: true,
        icon: "square",
        orient: "vertical",
        left: 0,
        bottom: 15,
        padding: 0,
        itemWidth: 25,
        textStyle: {
          color: "black",
          fontSize: 14,
        },
      },
      xAxis: {
        show: true,
        type: "category",
        data: getXAxisData(datas),
        axisLabel: {
          color: "black",
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
        show: false,
        type: "value",
        axisLabel: {
          formatter: (value: number | undefined) => {
            return formatPercentage(value as number, 2, "-");
          },
          color: "black",
          fontWeight: 700,
        },
        splitNumber: 3,
      },
      grid: {
        containLabel: true,
        width: "70%",
        bottom: 0,
        right: 0,
        top: 25,
      },
      series: series.map((s) => ({
        ...s,
        type: "bar",
        barMaxWidth: 50,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          distance: 5,
          show: true,
          position: "top",
          formatter: ({ value }) => {
            if (value === undefined) return "-";
            return formatPercentage(value as number);
          },
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
    [series, datas],
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option, true);
  }, [chartRef, option]);

  return (
    <Box position="relative" overflow="visible !important" w={"100%"} height={"100%"}>
      <Box ref={containerRef} height={"100%"} w={"100%"}></Box>
    </Box>
  );
};
