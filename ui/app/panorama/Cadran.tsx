"use client";
import { Box, chakra } from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { api } from "@/api.client";

type FormationsCadran = Awaited<
  ReturnType<ReturnType<typeof api.getFormationsForCadran>["call"]>
>["formations"];

export const Cadran = chakra(
  ({ className, data }: { className?: string; data: FormationsCadran }) => {
    const chartRef = useRef<echarts.ECharts>();
    const containerRef = useRef<HTMLDivElement>(null);

    const series = data.map((formation) => [
      formation.tauxPoursuiteEtudes,
      formation.tauxInsertion12mois,
    ]);

    const option = useMemo<EChartsOption>(
      () => ({
        width: 540,
        height: 480,
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
            itemStyle: {
              color: ({ value }) => {
                const [txPoursuite, txEmploi] = value as number[];
                if (txPoursuite + txEmploi < 100) return "red";
                return "green";
              },
            },
            data: series as any,
            type: "scatter",
            symbolSize: (_, { dataIndex }) => {
              const formation = data[dataIndex];
              const effs = {
                50: 5,
                200: 10,
                500: 15,
                1000: 20,
                500000: 30,
              };
              const size = Object.entries(effs).find(
                ([eff]) =>
                  formation.effectif && formation.effectif < parseInt(eff)
              )?.[1];
              return size ?? 0;
            },
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
      }),
      [data]
    );

    useLayoutEffect(() => {
      if (!containerRef.current) return;
      if (!chartRef.current) {
        chartRef.current = echarts.init(containerRef.current);
      }
      chartRef.current.setOption(option);

      const handler = (a, b) => {
        console.log(a, b);
      };
      chartRef.current.on("click", handler);
      return () => {
        chartRef.current?.off("click", handler);
      };
    }, [option, data]);

    return (
      <div className={className}>
        <Box ref={containerRef} style={{ width: "100%", height: "100%" }}></Box>
      </div>
    );
  }
);
