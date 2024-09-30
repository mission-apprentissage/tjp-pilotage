import { AspectRatio, Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { formatPercentage } from "../../../../../utils/formatUtils";
import { RepartitionPilotageIntentionsPositionQuadrant } from "../types";

type PositionQuadrant = "Q1" | "Q2" | "Q3" | "Q4" | "Hors quadrant";

export const BarChart = ({
  positionsQuadrant,
}: {
  positionsQuadrant?: RepartitionPilotageIntentionsPositionQuadrant;
}) => {
  if (!positionsQuadrant) return <></>;

  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf113 = useToken("colors", "bluefrance.113");
  const bf850 = useToken("colors", "bluefrance.850");
  const bf850_active = useToken("colors", "bluefrance.850_active");
  const grey425 = useToken("colors", "grey.425");

  const positionsQuadrantOptions: PositionQuadrant[] = [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Hors quadrant",
  ];

  const seriesOption: echarts.BarSeriesOption = {
    type: "bar",
    barWidth: 100,
    yAxisIndex: 0,
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      animationDelay: 0.5,
      responsive: true,
      maintainAspectRatio: true,
      title: {
        text: "Répartition des places transformées par section du quadrant",
        show: false,
        textStyle: {
          color: bf113,
          fontFamily: "Marianne",
          fontSize: 16,
          fontWeight: 500,
          texttransform: "uppercase",
        },
      },
      tooltip: [
        {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          textStyle: {
            width: "fit-content",
          },

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            return `
            <div style="min-width: fit-content;">
              <span style="font-weight: 700;">${params[0]?.name} :</span>
              <br />
              Ratio de fermetures :
              <span style="font-weight: 700;">
                ${formatPercentage(
                  positionsQuadrant[params[0]?.name as PositionQuadrant]
                    .ratioFermeture,
                  0,
                  "-"
                )}
              </span>
              <br />
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${params[2]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. colorées :
                  <span style="font-weight: 700;">${params[2]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${params[1]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. ouvertes :
                  <span style="font-weight: 700;">${params[1]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${params[0]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. fermées :
                  <span style="font-weight: 700;"> ${params[0]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 15px;">
                <span>
                  Pl. transformées :
                  <span style="font-weight: 700;"> ${
                    positionsQuadrant[params[0]?.name as PositionQuadrant]
                      .placesTransformees
                  }</span>
                </span>
              </div>
            </div>
            `;
          },
        },
      ],
      toolbox: {
        showTitle: false,
        tooltip: {
          show: true,
          textStyle: {
            color: bf113,
            backgroundColor: "transparent",
            fontSize: 12,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => `${params.title}`,
        },
        feature: {
          saveAsImage: {
            title: "Télécharger sous format .png",
            name: "Répartition des places transformées par section du quadrant",
            type: "png",
            backgroundColor: "transparent",
            textStyle: {
              color: bf113,
            },
            iconStyle: {
              color: bf113,
              width: 20,
            },
            icon: "image://../icons/download.svg",
          },
        },
      },
      legend: {
        show: true,
        orient: "vertical",
        bottom: "20%",
        right: 0,
        itemGap: 15,
        itemWidth: 15,
        selectedMode: false,
        formatter: (value: string) =>
          `${value.replace("Place(s) ", "Pl. ").replace("(s)", "s")}`,
        data: [
          {
            name: "Place(s) colorée(s)",
            icon: "square",
          },
          {
            name: "Place(s) ouverte(s)",
            icon: "square",
          },
          {
            name: "Place(s) fermée(s)",
            icon: "square",
          },
        ],
      },
      grid: {
        id: 1,
        left: 200,
        right: "15%",
        bottom: 0,
      },
      xAxis: {
        data: positionsQuadrantOptions,
        type: "category",
        show: true,
        axisLabel: {
          show: false,
          fontSize: 14,
          color: grey425,
          fontWeight: 700,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          onZero: true,
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          data: positionsQuadrantOptions.map(
            (positionQuadrant) =>
              positionsQuadrant[positionQuadrant].placesFermees
          ),
          stack: "placesTransformées",
          color: bf113,
          name: "Place(s) fermée(s)",
          ...seriesOption,
        },
        {
          data: positionsQuadrantOptions.map(
            (positionQuadrant) =>
              positionsQuadrant[positionQuadrant].placesOuvertes
          ),
          stack: "placesTransformées",
          color: bf850_active,
          name: "Place(s) ouverte(s)",
          ...seriesOption,
        },
        {
          data: positionsQuadrantOptions.map(
            (positionQuadrant) =>
              positionsQuadrant[positionQuadrant].placesColorees
          ),
          stack: "placesTransformées",
          color: bf850,
          barWidth: 45,
          name: "Place(s) colorée(s)",
          ...seriesOption,
        },
      ],
    }),
    [positionsQuadrant]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option, true);
  }, [positionsQuadrant]);

  return (
    <>
      <Box width={"100%"}>
        <Box>
          <AspectRatio ratio={4}>
            <Box position="relative" overflow={"visible !important"}>
              <Box ref={containerRef} h={300} w={"100%"}></Box>
            </Box>
          </AspectRatio>
        </Box>
      </Box>
    </>
  );
};
