"use client";
import { Box, chakra } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useRef, useState } from "react";

export const Cadran = chakra(({ className }: { className?: string }) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [option, setOption] = useState<
    Parameters<echarts.ECharts["setOption"]>[0]
  >({
    width: 400,
    height: 400,
    xAxis: [
      {
        type: "value",
        name: "Taux de poursuite d'étude",
        min: 0,
        max: 100,
        position: "bottom",
        nameLocation: "middle",
        nameGap: -18,
        splitNumber: 10,
        splitLine: { show: false },
        nameTextStyle: {
          fontWeight: "bold",
        },
        offset: 25,
        axisLabel: {
          formatter: "{value}%",
          fontWeight: "bold",
        },
        axisLine: {
          onZero: false,
          symbol: ["none", "arrow"],
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Taux d'emploi 12 mois",
        min: 0,
        max: 100,
        position: "left",
        nameLocation: "middle",
        nameGap: -18,
        splitNumber: 10,
        splitLine: { show: false },
        nameTextStyle: {
          fontWeight: "bold",
        },
        offset: 25,
        axisLabel: {
          formatter: "{value}%",
          fontWeight: "bold",
        },
        axisLine: {
          onZero: false,
          symbol: ["none", "arrow"],
        },
      },
    ],
    series: [
      {
        data: [
          [49.2, 51.6],
          [16.5, 59.0],
          [80.5, 59.0],
        ],
        type: "scatter",
        symbolSize: () => Math.random() * 20 + 8,
        markLine: {
          silent: true,
          label: { show: false },
          lineStyle: {
            type: "solid",
          },
          symbol: ["none", "arrow"],
          animation: false,
          data: [
            { type: "average", name: "Average", valueDim: "x" },
            { type: "average", name: "Average", valueDim: "y" },
          ],
        },
        markArea: {
          silent: true,
          animation: false,
          data: [
            [
              { coord: [0, 0], itemStyle: { color: "#ffe2e1" } },
              { coord: ["average", "average"] },
            ],
            [
              {
                coord: ["average", "average"],
                itemStyle: { color: "#E5F9DB" },
              },
              { coord: [100, 100] },
            ],
            [
              {
                coord: [0, "average"],
                itemStyle: { color: "rgba(0,0,0,0.04)" },
              },
              { coord: ["average", 100] },
            ],
            [
              {
                coord: ["average", 0],
                itemStyle: { color: "rgba(0,0,0,0.04)" },
              },
              { coord: [100, "average"] },
            ],
          ],
        },
      },
    ],
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option);
  }, [option]);

  return (
    <div className={className}>
      <Box ref={containerRef} style={{ width: "100%", height: "100%" }}></Box>
    </div>
  );
});
