"use client";
import { QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
  usePopper,
} from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import {
  FC,
  forwardRef,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const Cadran = function <
  F extends {
    effectif?: number;
    tauxPoursuiteEtudes: number;
    tauxInsertion12mois: number;
  }
>({
  className,
  data,
  meanPoursuite,
  meanInsertion,
  TooltipContent,
  InfoTootipContent,
  effectifSizes,
}: {
  className?: string;
  data: F[];
  meanPoursuite?: number;
  meanInsertion?: number;
  TooltipContent?: FC<{ formation: F }>;
  InfoTootipContent?: FC;
  effectifSizes: { max: number; size: number }[];
}) {
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
    formation: F;
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
          //@ts-ignore
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
    [data, meanPoursuite, meanInsertion]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option);

    const handler = (event: { dataIndex: number; data: [number, number] }) => {
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

      {InfoTootipContent && (
        <InfoTooltip>
          <InfoTootipContent />
        </InfoTooltip>
      )}

      {displayedDetail && (
        <FormationTooltipWrapper
          ref={popperInstance.popperRef}
          clickOutside={() => setDisplayedDetail(undefined)}
          {...popperInstance.getPopperProps()}
        >
          {TooltipContent && displayedDetail && (
            <TooltipContent formation={displayedDetail?.formation} />
          )}
        </FormationTooltipWrapper>
      )}
    </Box>
  );
};

export const FormationTooltipWrapper = forwardRef<
  HTMLDivElement,
  { children: ReactNode; clickOutside: () => void }
>(({ clickOutside, children, ...props }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: cardRef,
    handler: clickOutside,
  });

  return (
    <Box zIndex={10} ref={ref} {...props}>
      <Card width={"250px"} ref={cardRef}>
        <CardBody p="4">{children}</CardBody>
      </Card>
    </Box>
  );
});

const InfoTooltip = ({ children }: { children: ReactNode }) => (
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
      {children}
    </PopoverContent>
  </Popover>
);
