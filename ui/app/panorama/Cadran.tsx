"use client";
import { InfoIcon, QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  chakra,
  Flex,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  usePopper,
} from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { FormationTooltip } from "./FormationTooltip";
import { PanoramaFormation, PanoramaFormations } from "./type";

export const Cadran = chakra(
  ({
    className,
    data,
    meanPoursuite,
    meanInsertion,
  }: {
    className?: string;
    data: PanoramaFormations;
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
      formation: PanoramaFormation;
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
              color: "rgba(58, 85, 209, 0.6)",
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
        const [x, y] = chartRef.current?.convertToPixel("grid", event.data) ?? [
          0, 0,
        ];

        setDisplayedDetail({
          x,
          y,
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
      <Box
        position="relative"
        className={className}
        overflow="visible !important"
      >
        <Box
          ref={containerRef}
          position="absolute"
          right="-15px"
          top="0"
          left="0"
          bottom="0"
        ></Box>

        <InfoTooltip />

        <FormationTooltip
          ref={popperInstance.popperRef}
          formation={displayedDetail?.formation}
          clickOutside={() => setDisplayedDetail(undefined)}
          {...popperInstance.getPopperProps()}
        />
      </Box>
    );
  }
);

const InfoTooltip = () => (
  <Popover>
    <PopoverTrigger>
      <QuestionIcon
        color="info.525"
        position="absolute"
        right="20px"
        top="25px"
        fontSize="20px"
        cursor="pointer"
      />
    </PopoverTrigger>
    <PopoverContent _focusVisible={{ outline: "none" }} p="3">
      <PopoverCloseButton />
      <Text mb="2" fontSize="sm" fontWeight="bold">
        Effectif:
      </Text>
      <Flex align="center">
        <Center p="4">
          <InfoIcon fontSize={30} />
        </Center>
        <Text flex={1} ml="4" fontSize="sm">
          Les formations inférieures à 20 élèves ne sont pas représentées dans
          ce quadrant.
        </Text>
      </Flex>
      <Text mt="4" mb="2" fontSize="sm" fontWeight="bold">
        Légende:
      </Text>
      <Flex align="center">
        <Box
          borderRadius={100}
          width={"22px"}
          height={"22px"}
          border="1px solid black"
        />
        <Text flex={1} ml="4" fontSize="sm">
          Seuil effectif 50000
        </Text>
      </Flex>
      <Flex mt="2" align="center">
        <Box
          borderRadius={100}
          width={"18px"}
          height={"18px"}
          mx="2px"
          border="1px solid black"
        />
        <Text flex={1} ml="4" fontSize="sm">
          Seuil effectif 500
        </Text>
      </Flex>
      <Flex mt="2" align="center">
        <Box
          borderRadius={100}
          width={"14px"}
          height={"14px"}
          mx="4px"
          border="1px solid black"
        />
        <Text flex={1} ml="4" fontSize="sm">
          Seuil effectif 200
        </Text>
      </Flex>
      <Flex mt="2" align="center">
        <Box
          borderRadius={100}
          width={"10px"}
          height={"10px"}
          mx="6px"
          border="1px solid black"
        />
        <Text flex={1} ml="4" fontSize="sm">
          Seuil effectif 2000
        </Text>
      </Flex>
      <Flex mt="2" align="center">
        <Box
          borderRadius={100}
          width={"6px"}
          height={"6px"}
          mx="8px"
          border="1px solid black"
        />
        <Text flex={1} ml="4" fontSize="sm">
          Seuil effectif 50
        </Text>
      </Flex>
    </PopoverContent>
  </Popover>
);
