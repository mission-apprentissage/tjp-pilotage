import { Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

export const VerticalBarChart = ({
  data,
}: {
  data: {
    label: string;
    value: number;
  }[];
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf113 = useToken("colors", "bluefrance.113");
  const be850a = useToken("colors", "blueecume.850_active");
  const be850 = useToken("colors", "bluefrance.850");

  const colors = [be850, be850a, bf113];

  const getXAxisData = () => {
    if (data !== undefined) {
      return data.map((data) => data.label);
    }
    return [];
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      animationDelay: 0.5,
      responsive: true,
      maintainAspectRatio: true,
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: "{a} : {c}%",
      },
      legend: {
        data: getXAxisData(),
        icon: "rectangle",
        orient: "vertical",
        right: 0,
        bottom: 15,
        itemStyle: {
          color: "inherit",
        },
        textStyle: {
          color: "inherit",
          fontSize: 12,
        },
      },
      grid: {
        left: 0,
        right: "40%",
        bottom: 1,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "black",
            width: 0.5,
          },
          onZero: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        show: false, // Hide Y-axis
      },
      series: data
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((serie, index) => ({
          data: [serie.value],
          name: serie.label,
          type: "bar",
          color: colors[index],
          barWidth: 25,
          barGap: "50%",
          barCategoryGap: "10%",
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            distance: 10,
            show: true,
            position: "top",
            formatter: "{c}%",
            fontSize: "16px",
            fontWeight: 700,
          },
          tooltip: {
            valueFormatter: (value) => value + "%",
          },
        })),
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
      <Box ref={containerRef} height={150} width={225}></Box>
    </Box>
  );
};
