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

const cadranLabelStyle = {
  show: true,
  distance: 14,
  fontSize: 14,
  color: "rgba(0,0,0,0.3)",
  fontWeight: "bold",
} as const;

export const Cadran = function <
  F extends {
    effectif?: number;
    tauxPoursuiteEtudes: number;
    tauxInsertion6mois: number;
  },
>({
  className,
  data,
  meanPoursuite,
  meanInsertion,
  TooltipContent,
  InfoTootipContent,
  effectifSizes,
  onClick,
  itemColor = "rgba(58, 85, 209, 0.6)",
  itemId,
}: {
  className?: string;
  data: F[];
  meanPoursuite?: number;
  meanInsertion?: number;
  TooltipContent?: FC<{ formation: F }>;
  InfoTootipContent?: FC;
  effectifSizes: { max: number; size: number }[];
  onClick?: (_: F) => void;
  itemColor?: string | ((_: F) => string | undefined);
  itemId: (_: F) => string;
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

  const prev = useRef<Record<string, number>>();
  const orderedData = useMemo(() => {
    const temp = data.reduce((acc, cur, i) => {
      const prevIndex = prev.current?.[itemId(cur)];
      if (prevIndex) {
        acc[prevIndex] = cur;
        return acc;
      }
      acc[1000 + i] = cur;
      return acc;
    }, [] as F[]);

    prev.current = temp.reduce(
      (acc, cur, i) => ({ ...acc, [itemId(cur)]: i }),
      {}
    );
    return temp;
  }, [JSON.stringify(data)]);

  const series = useMemo(() => {
    return orderedData.map((formation) => [
      formation.tauxPoursuiteEtudes,
      formation.tauxInsertion6mois,
    ]);
  }, [orderedData]);

  const repartitionCadrans = useMemo(() => {
    if (!meanInsertion || !meanPoursuite) return;
    return {
      q1: orderedData.filter(
        (item) =>
          item.tauxInsertion6mois >= meanInsertion &&
          item.tauxPoursuiteEtudes < meanPoursuite
      ).length,
      q2: orderedData.filter(
        (item) =>
          item.tauxInsertion6mois >= meanInsertion &&
          item.tauxPoursuiteEtudes > meanPoursuite
      ).length,
      q3: orderedData.filter(
        (item) =>
          item.tauxInsertion6mois < meanInsertion &&
          item.tauxPoursuiteEtudes >= meanPoursuite
      ).length,
      q4: orderedData.filter(
        (item) =>
          item.tauxInsertion6mois < meanInsertion &&
          item.tauxPoursuiteEtudes < meanPoursuite
      ).length,
    };
  }, [orderedData, meanInsertion, meanPoursuite]);

  const option = useMemo<EChartsOption>(
    () => ({
      grid: { top: 0, right: 0, bottom: 50, left: 60 },

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
            showMaxLabel: false,
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
          name: "Taux d'emploi 6 mois",
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
            showMaxLabel: false,
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
            color: ({ dataIndex }) => {
              const formation = orderedData[dataIndex];
              if (!formation) return "";
              if (typeof itemColor === "string") return itemColor;
              return itemColor(formation) ?? "rgba(58, 85, 209, 0.6)";
            },
          },
          animation: true,
          animationDuration: 200,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: series as any,
          type: "scatter",
          symbolSize: (_, { dataIndex }) => {
            const formation = orderedData[dataIndex];
            if (!formation) return 0;
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
                      {
                        coord: [0, 0],
                        itemStyle: { color: "#ffe2e1" },
                        name: `Q4 - ${repartitionCadrans?.q4} formations`,
                        label: {
                          ...cadranLabelStyle,
                          position: "insideBottomLeft",
                        },
                      },
                      { coord: [meanPoursuite, meanInsertion] },
                    ],
                    [
                      {
                        coord: [meanPoursuite, meanInsertion],
                        itemStyle: { color: "#E5F9DB" },
                        name: `Q2 - ${repartitionCadrans?.q2} formations`,
                        label: {
                          ...cadranLabelStyle,
                          position: "insideTopRight",
                        },
                      },
                      { coord: [100, 100] },
                    ],
                    [
                      {
                        coord: [0, meanInsertion],
                        itemStyle: { color: "rgba(0,0,0,0.04)" },
                        name: `Q1 - ${repartitionCadrans?.q1} formations`,
                        label: {
                          ...cadranLabelStyle,
                          position: "insideTopLeft",
                        },
                      },
                      { coord: [meanPoursuite, 100] },
                    ],
                    [
                      {
                        coord: [meanPoursuite, 0],
                        itemStyle: { color: "rgba(0,0,0,0.04)" },
                        name: `Q3 - ${repartitionCadrans?.q3} formations`,
                        label: {
                          ...cadranLabelStyle,
                          position: "insideBottomRight",
                        },
                      },
                      { coord: [100, meanInsertion] },
                    ],
                  ],
                }
              : undefined,
        },
      ],
    }),
    [orderedData, meanPoursuite, meanInsertion, itemColor, itemId]
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
      chartRef.current?.setOption(option);
      onClick?.(orderedData[event.dataIndex]);
      setDisplayedDetail({
        x,
        y,
        formation: orderedData[event.dataIndex],
      });
      return true;
    };
    //@ts-ignore
    chartRef.current.on("click", "series", handler);
    return () => {
      chartRef.current?.off("click", handler);
    };
  }, [option, orderedData]);

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

      {displayedDetail && TooltipContent && (
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
      <Card width={"280px"} ref={cardRef}>
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
