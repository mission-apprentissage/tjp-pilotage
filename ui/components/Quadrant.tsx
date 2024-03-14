"use client";
import { QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
  usePopper,
  useToken,
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

const quadrantLabelStyle = {
  show: true,
  distance: 14,
  fontSize: 14,
  color: "rgba(0,0,0,0.3)",
  fontWeight: "bold",
} as const;

export const Quadrant = function <
  F extends {
    effectif?: number;
    tauxPoursuite: number;
    tauxInsertion: number;
    positionQuadrant?: string;
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
  dimensions = ["tauxInsertion", "tauxPoursuite"],
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
  dimensions?: Array<"tauxInsertion" | "tauxPoursuite">;
}) {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const greenColor = useToken("colors", "green.submitted");
  const redColor = useToken("colors", "redmarianne.925");

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

  const series = useMemo(() => {
    return data.map((formation) => ({
      value: [
        dimensions?.includes("tauxPoursuite")
          ? formation.tauxPoursuite * 100
          : 50,
        dimensions?.includes("tauxInsertion")
          ? formation.tauxInsertion * 100
          : 50,
      ],
      name: itemId(formation),
    }));
  }, [data]);

  const moyennes = useMemo(() => {
    const moyenneInsertion = (() => {
      if (dimensions?.includes("tauxInsertion")) {
        if (meanInsertion) return meanInsertion * 100;
        return undefined;
      }
      return 50;
    })();

    const moyennePoursuite = (() => {
      if (dimensions?.includes("tauxPoursuite")) {
        if (meanPoursuite) return meanPoursuite * 100;
        return undefined;
      }
      return 50;
    })();

    return {
      insertion: moyenneInsertion,
      poursuite: moyennePoursuite,
    };
  }, [meanPoursuite, meanInsertion, dimensions]);

  const repartitionsQuadrants = useMemo(() => {
    if (!meanInsertion || !meanPoursuite) return;
    return {
      q1: data.filter((item) => item.positionQuadrant === "Q1" && item.effectif)
        .length,
      q2: data.filter((item) => item.positionQuadrant === "Q2" && item.effectif)
        .length,
      q3: data.filter((item) => item.positionQuadrant === "Q3" && item.effectif)
        .length,
      q4: data.filter((item) => item.positionQuadrant === "Q4" && item.effectif)
        .length,
    };
  }, [data, meanInsertion, meanPoursuite, dimensions]);

  const option = useMemo<EChartsOption>(
    () => ({
      grid: { top: 0, right: 0, bottom: 50, left: 60 },

      xAxis: [
        {
          type: "value",
          name: "Taux de poursuite d'étude",
          show: dimensions?.includes("tauxPoursuite"),
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
            show: dimensions?.includes("tauxInsertion"),
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Taux d'emploi 6 mois",
          show: dimensions?.includes("tauxInsertion"),
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
            show: dimensions?.includes("tauxInsertion"),
          },
        },
      ],
      series: [
        {
          itemStyle: {
            color: ({ dataIndex }) => {
              const formation = data[dataIndex];
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
            const formation = data[dataIndex];
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
              ...(moyennes.poursuite ? [{ xAxis: moyennes.poursuite }] : []),
              ...(moyennes.insertion ? [{ yAxis: moyennes.insertion }] : []),
            ],
          },
          markArea:
            moyennes.poursuite && moyennes.insertion
              ? {
                  silent: true,
                  animation: false,
                  data: [
                    [
                      {
                        coord: [0, 0],
                        itemStyle: {
                          color:
                            dimensions?.includes("tauxPoursuite") &&
                            dimensions?.includes("tauxInsertion")
                              ? redColor
                              : "#F5F5F5",
                        },
                        name: `Q4 - ${repartitionsQuadrants?.q4} formations`,
                        label: {
                          ...quadrantLabelStyle,
                          position: "insideBottomLeft",
                        },
                      },
                      { coord: [moyennes.poursuite, moyennes.insertion] },
                    ],
                    [
                      {
                        coord: [moyennes.poursuite, moyennes.insertion],
                        itemStyle: {
                          color:
                            dimensions?.includes("tauxPoursuite") &&
                            dimensions?.includes("tauxInsertion")
                              ? greenColor
                              : "#F5F5F5",
                        },
                        name: `Q1 - ${repartitionsQuadrants?.q1} formations`,
                        label: {
                          ...quadrantLabelStyle,
                          position: "insideTopRight",
                        },
                      },
                      { coord: [100, 100] },
                    ],
                    [
                      {
                        coord: [0, moyennes.insertion],
                        itemStyle: { color: "#FAFAFA" },
                        name: `Q2 - ${repartitionsQuadrants?.q2} formations`,
                        label: {
                          ...quadrantLabelStyle,
                          position: "insideTopLeft",
                        },
                      },
                      { coord: [moyennes.poursuite, 100] },
                    ],
                    [
                      {
                        coord: [moyennes.poursuite, 0],
                        itemStyle: { color: "#FAFAFA" },
                        name: `Q3 - ${repartitionsQuadrants?.q3} formations`,
                        label: {
                          ...quadrantLabelStyle,
                          position: "insideBottomRight",
                        },
                      },
                      { coord: [100, moyennes.insertion] },
                    ],
                  ],
                }
              : undefined,
        },
      ],
    }),
    [data, moyennes, itemColor, itemId, dimensions]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option);

    const handler = (event: {
      dataIndex: number;
      data: { value: [number, number] };
    }) => {
      const [x, y] = chartRef.current?.convertToPixel(
        "grid",
        event.data.value
      ) ?? [0, 0];
      chartRef.current?.setOption(option);
      onClick?.(data[event.dataIndex]);
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
        right="0"
        top="0"
        left="0"
        bottom="0"
      ></Box>

      {InfoTootipContent && (
        <Box position={"absolute"} top="10px" bottom="0" right="-20px">
          <InfoTooltip>
            <InfoTootipContent />
          </InfoTooltip>
        </Box>
      )}

      {displayedDetail && TooltipContent && (
        <FormationTooltipWrapper
          ref={popperInstance.popperRef}
          clickOutside={() => setDisplayedDetail(undefined)}
          {...popperInstance.getPopperProps()}
        >
          {TooltipContent && displayedDetail && (
            <Flex ref={tooltipRef}>
              <TooltipContent formation={displayedDetail?.formation} />
            </Flex>
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
