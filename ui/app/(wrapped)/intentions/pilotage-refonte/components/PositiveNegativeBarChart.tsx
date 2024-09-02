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
    return Object.keys(data).slice(0, limit);
  };

  const getTauxTransformation = () => {
    return Object.keys(data)
      .map((key) =>
        data[key].tauxTransformation
          ? formatPercentage(data[key].tauxTransformation, 2)
          : "-"
      )
      .slice(0, limit);
  };

  const getSolde = () => {
    return Object.keys(data)
      .map((key) => (data[key].solde > 0 ? "+" : "") + data[key].solde)
      .slice(0, limit);
  };

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
      axisPointer: {
        type: "shadow",
      },
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
            // icon: `data:image/svg+xml;base64,${btoa(downloadIcon)}`,
            // icon: `path://M8.66667 7.99955H10.6667L8 10.6662L5.33333 7.99955H7.33333V5.33289H8.66667V7.99955ZM10 2.66622H3.33333V13.3329H12.6667V5.33289H10V2.66622ZM2 1.99422C2 1.62889 2.298 1.33289 2.666 1.33289H10.6667L14 4.66622V13.9949C14.0006 14.0824 13.984 14.1692 13.951 14.2504C13.9181 14.3315 13.8695 14.4053 13.808 14.4677C13.7466 14.53 13.6734 14.5796 13.5928 14.6137C13.5121 14.6478 13.4255 14.6656 13.338 14.6662H2.662C2.48692 14.665 2.31934 14.595 2.19548 14.4712C2.07161 14.3475 2.0014 14.18 2 14.0049V1.99422Z`,
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
            name: "Place(s) fermée(s)",
            icon: "square",
          },
          {
            name: "Place(s) ouverte(s)",
            icon: "square",
          },
          {
            name: "Place(s) colorée(s)",
            icon: "square",
          },
        ],
      },
      grid: [
        {
          id: 1,
          width: type === "domaines" ? "40%" : "50%",
          left: type === "domaines" ? "40%" : "30%",
          right: 0,
        },
      ],
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
          nameTextStyle: {
            fontSize: 12,
            color: grey425,
            fontFamily: "Marianne",
            align: "left",
          },
          yAxisIndex: 0,
          type: "category",
          left: 0,
          offset: type === "domaines" ? 300 : 200,
          show: true,
          data: getYAxisTitle(),
          axisLabel: {
            show: true,
            fontSize: 14,
            fontWeight: 400,
            color: "black",
            align: "left",

            formatter: (value: string) => {
              // Truncate label if too long and add ellipsis
              return value.length > 30 ? value.substring(0, 30) + "..." : value;
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            onZero: false,
          },
        },
        {
          name: "taux de transfo.",
          nameTextStyle: {
            fontSize: 12,
            color: grey425,
            fontFamily: "Marianne",
          },
          yAxisIndex: 1,
          position: "left",
          type: "category",
          show: true,
          data: getTauxTransformation(),
          axisLabel: {
            show: true,
            fontSize: 14,
            fontWeight: 400,
            color: "black",
            overflow: "break",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            onZero: false,
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
          yAxisIndex: 3,
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
          data: Object.keys(data)
            .map((key) => data[key].placesColorees ?? null)
            .slice(0, limit),
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
          data: Object.keys(data)
            .map((key) => -data[key].placesFermees ?? null)
            .slice(0, limit),
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
          data: Object.keys(data)
            .map((key) => data[key].placesOuvertes ?? null)
            .slice(0, limit),
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
    <AspectRatio ratio={4} w={"100%"}>
      <Box position="relative" overflow={"visible !important"}>
        <Box ref={containerRef} height={"100%"} w={"100%"}></Box>
      </Box>
    </AspectRatio>
  );
};
