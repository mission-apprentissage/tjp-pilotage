import { Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { frenchLocale } from "@/utils/echarts/frenchLocale";
import { formatNumber } from "@/utils/formatUtils";

export type BarGraphData = {
  [key: string]: {
    annee: string;
    libelleAnnee: string;
    filtered?: number;
    nationale?: number;
  };
};

export const BarGraph = function <F extends BarGraphData>({
  graphData,
  isFiltered,
  libelleRegion,
}: {
  graphData?: F;
  isFiltered: boolean | string;
  libelleRegion?: string;
}) {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf113 = useToken("colors", "bluefrance.113");
  const be850 = useToken("colors", "blueecume.850_active");

  const getXAxisData = () => {
    if (graphData !== undefined) {
      return Object.keys(graphData).map((annee) => graphData[annee].libelleAnnee);
    }
    return [];
  };

  const getNationalSerieData = () => {
    if (graphData !== undefined) {
      return Object.keys(graphData).map((annee) => typeof graphData[annee].nationale !== "undefined" ? formatNumber(graphData[annee].nationale, 1) : "-");
    }

    return [];
  };

  const getFilteredSerieData = () => {
    if (isFiltered && graphData !== undefined) {
      return Object.keys(graphData).map((annee) =>  typeof graphData[annee].filtered !== "undefined" ? formatNumber(graphData[annee].filtered, 1) : "-");
    }

    return [];
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      aria: {
        label: {
          enabled: true,
          data: {
            maxCount: 100
          }
        },
      },
      animationDelay: 1,
      responsive: true,
      maintainAspectRatio: true,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        valueFormatter: (value) => `${value} %`,
      },
      legend: {
        left: "10%",
        bottom: 10,
        icon: "square",
        itemStyle: {
          color: "inherit",
        },
        textStyle: {
          color: "inherit",
        },
        itemGap: 25,
      },
      xAxis: {
        type: "category",
        data: getXAxisData(),
        axisLabel: {
          color: bf113,
          fontWeight: 700,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value} %",
          color: bf113,
          fontWeight: 700,
        },
        splitNumber: 3,
        min: function (value) {
          return Math.floor(value.min - 5);
        },
      },
      series: isFiltered
        ? [
          {
            name: "NATIONAL",
            data: getNationalSerieData(),
            type: "bar",
            color: bf113,
            barMaxWidth: 50,
            itemStyle: {
              borderRadius: [15, 15, 0, 0],
            },
            label: {
              formatter: "{c}%",
            },
          },
          {
            name: libelleRegion?.toUpperCase() ?? "",
            data: getFilteredSerieData(),
            type: "bar",
            color: be850,
            barMaxWidth: 50,
            itemStyle: {
              borderRadius: [15, 15, 0, 0],
            },
          },
        ]
        : [
          {
            name: "NATIONAL",
            data: getNationalSerieData(),
            type: "bar",
            color: bf113,
            barMaxWidth: 50,
            itemStyle: {
              borderRadius: [15, 15, 0, 0],
            },
          },
        ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphData]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      echarts.registerLocale("fr", frenchLocale);
      chartRef.current = echarts.init(containerRef.current, null, { locale: "fr" });
    }
    chartRef.current.setOption(option, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  return (
    <Box position="relative" overflow="visible !important">
      <Box ref={containerRef} position="absolute" right="0" top="0" left="0" bottom="0" height={280}></Box>
    </Box>
  );
};
