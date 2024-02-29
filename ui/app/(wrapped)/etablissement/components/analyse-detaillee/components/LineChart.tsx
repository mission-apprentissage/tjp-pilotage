import { Box } from "@chakra-ui/react";
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

  // const getXAxisData = () => {
  //   if (data !== undefined) {
  //     return data.map((data) => data.label);
  //   }
  //   return [];
  // };

  // const getYAxisData = () => {
  //   if (data !== undefined) {
  //     return data.map((data) => data.value * 100);
  //   }
  //   return [];
  // };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      animationDelay: 1,
      responsive: true,
      maintainAspectRatio: true,
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
        top: 10,
        right: 10,
        itemStyle: {
          color: "inherit",
        },
        textStyle: {
          color: "inherit",
          fontSize: 12,
        },
      },
      grid: {
        left: "-20%",
        right: "40%",
        bottom: "0",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["2021", "2022", "2023"],
        show: false,
      },
      yAxis: {
        show: false, // Hide Y-axis
        scale: true,
        type: "value",
        axisLabel: {
          formatter: "{value}%",
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
          },
          lineStyle: {
            opacity: 0.75,
            width: key === mainKey ? 3 : 2,
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
    <Box position="relative" overflow="visible !important">
      <Box ref={containerRef} height={200} w={700}></Box>
    </Box>
  );
};
