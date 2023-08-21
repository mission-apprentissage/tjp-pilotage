import { Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

export const BarGraph = function <
  F extends {
    anneeN: {
      libelleAnnee: string;
      filtered?: number;
      nationale?: number;
    };
    anneeNMoins1: {
      libelleAnnee: string;
      filtered?: number;
      nationale?: number;
    };
  }
>({
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

  const option = useMemo<EChartsOption>(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        left: "10%",
        bottom: 10,
        icon: "square",
        itemStyle: {
          color: "inherit",
        },
        textStyle: {
          color: "#96A6D8",
        },
        itemGap: 25,
      },
      xAxis: {
        type: "category",
        data: [
          graphData?.anneeNMoins1.libelleAnnee,
          graphData?.anneeN.libelleAnnee,
        ],
        axisLabel: {
          color: "#000091",
          fontWeight: 700,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value} %",
          color: "#000091",
          fontWeight: 700,
        },
        splitNumber: 2,
      },
      series: [
        {
          name: "NATIONAL",
          data: [
            graphData?.anneeNMoins1.nationale ?? 0,
            graphData?.anneeN.nationale ?? 0,
          ],
          type: "bar",
          color: "#000091",
          barMaxWidth: 50,
          itemStyle: {
            borderRadius: [15, 15, 0, 0],
          },
        },
        {
          name: libelleRegion?.toUpperCase(),
          data: isFiltered
            ? [
                graphData?.anneeNMoins1.filtered ?? 0,
                graphData?.anneeN.filtered ?? 0,
              ]
            : [],
          type: "bar",
          color: "#0974F6",
          barMaxWidth: 50,
          itemStyle: {
            borderRadius: [15, 15, 0, 0],
          },
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
        height={350}
      ></Box>
    </Box>
  );
};
