import { AspectRatio, Box } from "@chakra-ui/react";
import { init, registerLocale } from "echarts";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { frenchLocale } from "@/utils/echarts/frenchLocale";
import { formatNumberToString, formatPercentage } from "@/utils/formatUtils";

export const TauxPressionRemplissageGraph = ({
  title,
  data,
  categories,
  colors,
  defaultMainKey,
  isPercentage = false,
}: {
  title: string;
  data: Record<string, Array<number | undefined>>;
  categories?: string[];
  colors: Record<string, string>;
  defaultMainKey?: string;
  isPercentage?: boolean;
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [mainKey, setMainKey] = useState<string>(defaultMainKey ?? "");

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      aria: {
        label: {
          enabled: true,
          data: {
            maxCount: 100
          }
        }
      },
      textStyle: {
        fontFamily: "Marianne, Arial",
      },
      animationDelay: 1,
      tooltip: {
        trigger: "axis",
        textStyle: {
          color: "inherit",
        },
      },
      toolbox: {
        top: -5,
        feature: {
          saveAsImage: {
            title: "Télécharger sous format .png",
            name: title,
            type: "png",
            backgroundColor: "transparent",
          },
        },
      },
      legend: {
        selected: {
          [mainKey]: true,
        },
        data: Object.keys(data),
        icon: "none",
        orient: "vertical",
        right: "0%",
        bottom: 0,
        itemGap: 8,
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
            formatter: ({ value }) =>
              isPercentage ? formatPercentage(value as number, 2, "-") : formatNumberToString(value as number, 2, "-"),
            fontSize: 14,
            fontWeight: 700,
          },
          lineStyle: {
            opacity: 0.75,
            width: key === mainKey ? 2.5 : 1.5,
            cap: "round",
          },
          tooltip: {
            valueFormatter: (value) =>
              isPercentage ? formatPercentage(value as number, 2, "-") : formatNumberToString(value as number, 2, "-"),
          },
          connectNulls: true,
        };
      }),
    }),
    [data, mainKey, categories, colors, isPercentage, title]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      registerLocale("fr", frenchLocale);
      chartRef.current = init(containerRef.current, null, { locale: "fr" });
    }
    chartRef.current.setOption(option, true);
    chartRef.current.on("legendselectchanged", (params) => {
      if (typeof params === "object" && params !== null && "name" in params && typeof params.name === "string") {
        setMainKey(params.name);
      }
    });
  }, [data, mainKey, option]);

  return (
    <AspectRatio ratio={3.5} w={"100%"}>
      <Box position="relative" overflow="visible !important">
        <Box ref={containerRef} height={"100%"} w={"100%"} role="figure"></Box>
      </Box>
    </AspectRatio>
  );
};
