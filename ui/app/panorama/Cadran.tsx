"use client";
import {
  Box,
  Card,
  CardBody,
  chakra,
  HStack,
  useOutsideClick,
  usePopper,
} from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from "react";

import { api } from "@/api.client";

import { InfoBlock } from "../../components/InfoBlock";

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

    const popperInstance = usePopper({
      modifiers: [
        {
          name: "preventOverflow",
          options: { padding: 10 },
        },
      ],
    });

    const [displayedDetail, setDisplayedDetail] = useState<{
      x: number;
      y: number;
      formation: CadranFormations[number];
    }>();

    useLayoutEffect(() => {
      if (!containerRef.current) return;
      if (!displayedDetail) return;

      popperInstance.referenceRef({
        getBoundingClientRect: () => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (!containerRect) return new DOMRect();
          return new DOMRect(
            displayedDetail.x + containerRect.x - 10,
            displayedDetail.y + containerRect.y - 10,
            20,
            20
          );
        },
        // contextElement: containerRef.current,
      });
    }, [containerRef.current, popperInstance, displayedDetail]);

    const series = data.map((formation) => [
      formation.tauxPoursuiteEtudes,
      formation.tauxInsertion12mois,
    ]);

    const option = useMemo<EChartsOption>(
      () => ({
        grid: { top: 10, right: 15, bottom: 50, left: 65 },
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
                50: 6,
                200: 10,
                500: 14,
                1000: 18,
                500000: 22,
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

      const handler = (event: {
        dataIndex: number;
        data: [number, number];
      }) => {
        setDisplayedDetail({
          x: chartRef.current?.convertToPixel("grid", event.data[0]) ?? 0,
          y: chartRef.current?.convertToPixel("grid", event.data[1]) ?? 0,
          formation: data[event.dataIndex],
        });
        return true;
      };
      //@ts-ignore
      chartRef.current.on("click", "series", handler);
      return () => {
        chartRef.current?.off("click", handler);
      };
    }, [option, data]);

    return (
      <Box position="relative" className={className}>
        <Box
          ref={containerRef}
          position="absolute"
          right="-15px"
          top="0"
          left="0"
          bottom="0"
        ></Box>
        <Tooltip
          ref={popperInstance.popperRef}
          formation={displayedDetail?.formation}
          clickOutside={() => setDisplayedDetail(undefined)}
          {...popperInstance.getPopperProps()}
        />
      </Box>
    );
  }
);

const Tooltip = forwardRef<
  HTMLDivElement,
  { formation?: CadranFormations[number]; clickOutside: () => void }
>(({ formation, clickOutside, ...props }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: cardRef,
    handler: clickOutside,
  });

  return (
    <div hidden={!formation} ref={ref} {...props}>
      <Card ref={cardRef} width={"250px"} bg="white">
        <CardBody fontSize="xs" p="4">
          <InfoBlock
            mb="2"
            label="Formation concernée:"
            value={formation?.libelleDiplome}
          />
          <InfoBlock
            mb="2"
            label="Dispositif concerné:"
            value={formation?.libelleDispositif}
          />
          <HStack mb="2" spacing={4}>
            <InfoBlock label="Effectif:" value={formation?.effectif} />
            <InfoBlock
              label="Nb Etablissements:"
              value={formation?.nbEtablissement}
            />
          </HStack>
          <InfoBlock
            mb="2"
            label="Tx de pression:"
            value={
              formation?.tauxPression ? formation?.tauxPression / 100 : "-"
            }
          />
          <InfoBlock
            mb="2"
            label="Tx d'emploi:"
            value={`${formation?.tauxInsertion12mois}%`}
          />
          <InfoBlock
            label="Tx de pousuite d'études:"
            value={`${formation?.tauxPoursuiteEtudes}%`}
          />
        </CardBody>
      </Card>
    </div>
  );
});
