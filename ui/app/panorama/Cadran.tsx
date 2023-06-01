"use client";
import { Box, chakra } from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { api } from "@/api.client";

type CadranFormations = Awaited<
  ReturnType<ReturnType<typeof api.getRegionStatsForCadran>["call"]>
>["formations"];

export const Cadran = chakra(
  ({
    className,
    data,
    meanPoursuite,
    meanInsertion,
  }: {
    className?: string;
    data: CadranFormations;
    meanPoursuite?: number;
    meanInsertion?: number;
  }) => {
    const chartRef = useRef<echarts.ECharts>();
    const containerRef = useRef<HTMLDivElement>(null);

    console.log(data);

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
              color: "rgba(58, 85, 209, 0.4)",
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
                color: "grey",
              },
              symbol: ["none", "arrow"],
              animation: false,
              data: [
                ...(meanPoursuite ? [{ xAxis: meanPoursuite }] : []),
                ...(meanInsertion ? [{ yAxis: meanInsertion }] : []),
              ],
            },
            markArea:
              meanPoursuite && meanInsertion
                ? {
                    silent: true,
                    animation: false,
                    data: [
                      [
                        { coord: [0, 0], itemStyle: { color: "#ffe2e1" } },
                        { coord: [meanPoursuite, meanInsertion] },
                      ],
                      [
                        {
                          coord: [meanPoursuite, meanInsertion],
                          itemStyle: { color: "#E5F9DB" },
                        },
                        { coord: [100, 100] },
                      ],
                      [
                        {
                          coord: [0, meanInsertion],
                          itemStyle: { color: "rgba(0,0,0,0.04)" },
                        },
                        { coord: [meanPoursuite, 100] },
                      ],
                      [
                        {
                          coord: [meanPoursuite, 0],
                          itemStyle: { color: "rgba(0,0,0,0.04)" },
                        },
                        { coord: [100, meanInsertion] },
                      ],
                    ],
                  }
                : undefined,
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
