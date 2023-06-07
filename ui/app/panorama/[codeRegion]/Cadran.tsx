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
  VStack,
} from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { FormationTooltip } from "./FormationTooltip";
import { PanoramaFormation, PanoramaFormations } from "./type";

const effectifSizes = [
  { max: 50, size: 6 },
  { max: 200, size: 10 },
  { max: 500, size: 14 },
  { max: 1000, size: 18 },
  { max: 1000000, size: 22 },
];

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
              const size = effectifSizes.find(
                ({ max }) => formation.effectif && formation.effectif < max
              )?.size;
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
      <VStack align="flex-start" spacing={2}>
        {effectifSizes.map(({ max, size }, i) => (
          <Flex key={max} align="center">
            <Box
              borderRadius={100}
              width={`${size}px`}
              height={`${size}px`}
              mx={22 - size / 2}
              border="1px solid black"
            />
            <Text flex={1} ml="4" fontSize="sm">
              {max !== 1000000 && (
                <>
                  Effectif {"<"} {max}
                </>
              )}
              {max === 1000000 && (
                <>
                  Effectif {">"} {effectifSizes[i - 1].max}
                </>
              )}
            </Text>
          </Flex>
        ))}
      </VStack>
    </PopoverContent>
  </Popover>
);
