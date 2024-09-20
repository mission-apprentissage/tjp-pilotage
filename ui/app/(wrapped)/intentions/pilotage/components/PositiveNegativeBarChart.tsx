import { AspectRatio, Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { formatPercentage } from "../../../../../utils/formatUtils";
import {
  RepartitionPilotageIntentionsDomaines,
  RepartitionPilotageIntentionsNiveauxDiplome,
  RepartitionPilotageIntentionsZonesGeographiques,
} from "../types";

export const PositiveNegativeBarChart = ({
  title,
  type,
  data,
}: {
  title: string;
  type: string;
  data?:
    | RepartitionPilotageIntentionsDomaines
    | RepartitionPilotageIntentionsZonesGeographiques
    | RepartitionPilotageIntentionsNiveauxDiplome;
}) => {
  if (!data) return <></>;

  const limit = 10;
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf113 = useToken("colors", "bluefrance.113");
  const bf850 = useToken("colors", "bluefrance.850");
  const bf850_active = useToken("colors", "bluefrance.850_active");
  const grey425 = useToken("colors", "grey.425");

  const getYAxisTitle = () => {
    return Object.keys(data)
      .filter((key) => key !== "Total")
      .slice(0, limit)
      .reverse();
  };

  const getSolde = () => {
    return Object.keys(data)
      .filter((key) => key !== "Total")
      .map((key) => (data[key].solde > 0 ? "+" : "") + data[key].solde)
      .slice(0, limit)
      .reverse();
  };

  const placesOuvertes = Object.keys(data)
    .filter((key) => key !== "Total")
    .map((key) => data[key].placesOuvertes)
    .slice(0, limit)
    .reverse();

  const placesFermees = Object.keys(data)
    .filter((key) => key !== "Total")
    .map((key) => -data[key].placesFermees ?? null)
    .slice(0, limit)
    .reverse();

  const placesColorees = Object.keys(data)
    .filter((key) => key !== "Total")
    .map((key) => data[key].placesColorees)
    .slice(0, limit)
    .reverse();

  const seriesOption: echarts.BarSeriesOption = {
    type: "bar",
    barGap: 0.5,
    barCategoryGap: "20%",
    label: {
      show: false,
    },
    itemStyle: {
      borderRadius: 8,
    },
    yAxisIndex: 0,
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      animationDelay: 0.5,
      responsive: true,
      maintainAspectRatio: true,
      title: {
        text: title,
        show: true,
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
              <span>${params[0]?.name} :</span>
              ${
                data[params[0]?.name].tauxTransformation
                  ? `
                <div>
                  (taux de transformation :
                  ${formatPercentage(
                    data[params[0]?.name].tauxTransformation,
                    2
                  )})
                </div>
                `
                  : ""
              }
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="width:15px; height:15px; background-color:${params[0]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>${params[0]?.seriesName} : ${params[0]?.data}</span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="width:15px; height:15px; background-color:${params[1]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span >${params[1]?.seriesName} : ${params[1]?.data}</span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="width:15px; height:15px; background-color:${params[2]
                  ?.color}; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>${params[2]?.seriesName} : ${params[2]?.data}</span>
              </div>
            </div>
            `;
          },
        },
        {
          trigger: "item",
          axisPointer: {
            type: "shadow",
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) =>
            `${params?.name} : ${
              params?.data > 0 ? params?.data : -params?.data
            } place${
              (params?.data > 0 ? params?.data : -params?.data) > 1 ? "s" : ""
            } ${params?.seriesName}${
              (params?.data > 0 ? params?.data : -params?.data) > 1 ? "s" : ""
            }`,
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
            name: title,
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
        margin: 15,
        bottom: "5%",
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
            name: "Place(s) fermée(s)",
            icon: "square",
          },
          {
            name: "Place(s) ouverte(s)",
            icon: "square",
          },
        ],
      },
      grid: {
        id: 1,
        left: "35%",
        top: "20%",
      },
      xAxis: {
        type: "value",
        show: false,
        nameGap: 0,
        boundaryGap: false,
        limit: 10,
      },
      yAxis: [
        {
          name: type,
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12,
            color: grey425,
            fontFamily: "Marianne",
            margin: 0,
            align: "left",
          },
          type: "category",
          show: true,
          data: getYAxisTitle(),
          offset: 170,
          axisLabel: {
            show: true,
            fontSize: 14,
            fontWeight: 400,
            color: "black",
            align: "left",
            width: 150,
            overflow: "truncate",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            onZero: false,
          },
          splitArea: {
            show: false,
          },
        },
        {
          name: "solde",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12,
            color: grey425,
            fontFamily: "Marianne",
            align: "left",
          },
          type: "category",
          show: true,
          data: getSolde(),
          axisLabel: {
            show: true,
            fontSize: 14,
            fontWeight: 400,
            color: "black",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            onZero: false,
          },
        },
      ],
      series: [
        {
          data: placesColorees,
          position: "right",
          color: bf850,
          itemStyle: {
            borderRadius: 4,
          },
          barWidth: 5,
          name: "Place(s) colorée(s)",
          ...seriesOption,
        },
        {
          data: placesFermees,
          position: "left",
          stack: "placesTransformées",
          stackStrategy: "all",
          color: bf113,
          itemStyle: {
            borderRadius: [4, 0, 0, 4],
          },
          barWidth: 12,
          name: "Place(s) fermée(s)",
          formatter: (value: number) => `${-value}`,
          ...seriesOption,
        },
        {
          data: placesOuvertes,
          position: "right",
          stack: "placesTransformées",
          color: bf850_active,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },
          barWidth: 12,
          name: "Place(s) ouverte(s)",
          ...seriesOption,
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
    chartRef.current.setOption(option, true);
  }, [data]);

  return (
    <AspectRatio ratio={2}>
      <Box position="relative" overflow={"visible !important"}>
        <Box ref={containerRef} h={"100%"} w={"100%"}></Box>
      </Box>
    </AspectRatio>
  );
};
