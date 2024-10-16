import { AspectRatio, Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

export const SoldeDePlacesTransformeesGraph = ({
  xAxisData,
  series,
}: {
  title: string;
  xAxisData: string[];
  series: echarts.BarSeriesOption[];
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      textStyle: {
        fontFamily: "Marianne, Arial",
      },
      legend: {
        show: true,
        icon: "square",
        orient: "vertical",
        left: 0,
        bottom: 0,
        padding: 0,
        itemWidth: 25,
        textStyle: {
          color: "black",
          fontSize: 14,
        },
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLabel: {
          color: "black",
          margin: 15,
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      grid: {
        containLabel: true,
        width: "65%",
        bottom: 0,
        right: 0,
        top: 25,
      },
      series: series.map((s) => ({
        ...s,
        type: "bar",
        barMaxWidth: 50,
        label: {
          distance: 5,
          show: true,
          position: "outside",
          rich: {
            percent: {
              fontSize: "11px",
            },
          },
          fontSize: "13px",
          fontWeight: 700,
        },
      })),
    }),
    [series, xAxisData]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option, true);
  }, [series, xAxisData]);

  return (
    <AspectRatio ratio={1.7} w={"100%"}>
      <Box position="relative" overflow="visible !important">
        <Box ref={containerRef} h={"100%"} w={"100%"}></Box>
      </Box>
    </AspectRatio>
  );
};
