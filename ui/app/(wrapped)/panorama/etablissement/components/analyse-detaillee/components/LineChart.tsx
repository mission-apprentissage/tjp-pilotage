import { AspectRatio, Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
export const LineChart = ({
  data,
  categories,
  colors,
  defaultMainKey,
}: {
  data: Record<string, number[]>;
  categories?: string[];
  colors: Record<string, string>;
  defaultMainKey?: string;
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [mainKey, setMainKey] = useState<string>(defaultMainKey ?? "");

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
        right: "0%",
        bottom: 0,
        itemGap: 15,
        itemStyle: {
          color: "inherit",
        },
        align: "left",
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
        left: "-10%",
        top: "20%",
        right: "20%",
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
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
        show: false,
        scale: true,
        type: "value",
        axisLabel: {
          formatter: "{value}",
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
          symbol: "circle",
          symbolSize: categories?.length && categories.length > 1 ? 0 : 6,
          label: {
            show: key === mainKey,
            position: "top",
            color: "inherit",
            distance: 5,
            formatter: (value) => value.data.toString().replace(".", ","),
            fontSize: 14,
            fontWeight: 700,
          },
          lineStyle: {
            opacity: 0.75,
            width: key === mainKey ? 2.5 : 1.5,
            cap: "round",
          },
          tooltip: {
            valueFormatter: (value) => value.toString().replace(".", ","),
          },
          connectNulls: true,
        };
      }),
    }),
    [data, mainKey]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option, true);
    chartRef.current.on("click", { dataType: "legend" }, (event) => {
      console.log("1", event);
    });

    chartRef.current.on("legendselectchanged", (params) => {
      //@ts-ignore
      setMainKey(params.name);
    });
  }, [data, mainKey]);

  return (
    <AspectRatio ratio={3.5} w={"100%"}>
      <Box position="relative" overflow="visible !important">
        <Box ref={containerRef} height={"100%"} w={"100%"}></Box>
      </Box>
    </AspectRatio>
  );
};
