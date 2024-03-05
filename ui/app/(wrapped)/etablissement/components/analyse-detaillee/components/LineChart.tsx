import { AspectRatio, Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";
export const LineChart = ({
  data,
  colors,
  mainKey,
}: {
  data: Record<string, number[]>;
  colors: Record<string, string>;
  mainKey?: string;
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      animationDelay: 1,
      tooltip: {
        trigger: "axis",
        textStyle: {
          color: "inherit",
        },
      },
      legend: {
        data: Object.keys(data),
        icon: "none",
        orient: "vertical",
        right: 0,
        bottom: 0,
        itemGap: 15,
        itemStyle: {
          color: "inherit",
        },
        textStyle: {
          color: "inherit",
          fontSize: 12,
          rich: {
            bold: {
              fontWeight: 700,
              fontSize: 14,
            },
          },
        },
        formatter: (name) => {
          if (name === mainKey) {
            return `{bold|${name.charAt(0).toUpperCase() + name.slice(1)}}`;
          }
          return name.charAt(0).toUpperCase() + name.slice(1);
        },
      },
      grid: {
        left: "-20%",
        top: 0,
        right: "20%",
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["2021", "2022", "2023"],
        show: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          alignWithLabel: true,
          show: false,
          fontSize: 14,
        },
      },
      yAxis: {
        show: false, // Hide Y-axis
        scale: true,
        type: "value",
        axisLabel: {
          formatter: "{value}%",
          align: "left",
        },
      },
      series: Object.keys(data).map((key) => {
        return {
          type: "line",
          name: key,
          data: Object.values(data[key]).map((value) => value),
          color: colors[key] ?? "inherit",
          showSymbol: true,
          symbolSize: 0,
          label: {
            show: key === mainKey,
            position: "top",
            color: "inherit",
            distance: 5,
            formatter: "{c}%",
            fontSize: 14,
            fontWeight: 700,
          },
          lineStyle: {
            opacity: 0.75,
            width: key === mainKey ? 2.5 : 1.5,
            cap: "round",
          },
          tooltip: {
            valueFormatter: (value) => value + "%",
          },
          connectNulls: true,
        };
      }),
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
    <AspectRatio ratio={2.7} w={"100%"}>
      <Box position="relative" overflow="visible !important">
        <Box ref={containerRef} height={"100%"} w={"100%"}></Box>
      </Box>
    </AspectRatio>
  );
};
