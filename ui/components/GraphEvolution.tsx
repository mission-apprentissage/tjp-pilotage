import { AspectRatio, Box } from "@chakra-ui/react";
import { init, registerLocale } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { themeDefinition } from "@/theme/theme";
import { frenchLocale } from "@/utils/echarts/frenchLocale";
import { formatNumber, formatNumberToString, formatPercentage, formatPercentageWithoutSign } from "@/utils/formatUtils";

type GraphData = Record<string, number | undefined>;

const getEvolutionColor = ({
  data
} : {
  data: GraphData;
}) => {
  const values = Object.values(data).filter((value) => value !== undefined);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];

  if (firstValue > lastValue) {
    return themeDefinition.colors.redmarianne[625];
  }
  if (firstValue < lastValue) {
    return themeDefinition.colors.greenArchipel[557];
  }
  return themeDefinition.colors.bluefrance[625];
};

export const GraphEvolution = ({
  title,
  data,
  isPercentage = false
}: {
  title: string;
  data: GraphData;
  isPercentage?: boolean;
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

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
      tooltip: {
        trigger: "axis",
        textStyle: {
          color: "inherit",
        },
        position: (pos) => {
          return [pos[0], '10%'];
        },
        formatter: `{b0}: {c0}${isPercentage ? "%" : ""}`
      },
      grid: {
        bottom: 5,
        left: 0,
        right: 0,
        top: 5,
      },
      xAxis: {
        type: "category",
        data: data ? Object.keys(data) : [],
        silent: true,
        show: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          alignWithLabel: true,
          show: false,
          fontSize: 14,
        },
        axisLabel: {
          show:false
        },
        tooltip: {
          show: false,
        },
      },
      yAxis: {
        show: false,
        silent: true,
        type: "value",
        axisLabel: {
          show: false,
          formatter: (_value) => ""
        },
        scale: true,
      },
      series: [
        {
          type: "line",
          data: Object.values(data).map((value) => isPercentage ?
            formatPercentageWithoutSign(value, 2) :
            formatNumber(value,2)
          ),
          lineStyle: {
            width: 2
          },
          animation: false,
          showSymbol: false,
          color: getEvolutionColor({ data }),
          connectNulls: true,
          label: {
            position: "top",
            color: "inherit",
            distance: 5,
            formatter: ({ value }) =>
              isPercentage
                ? formatPercentage(value as number, 2)
                : formatNumberToString(value as number, 2),
            fontSize: 14,
            fontWeight: 700,
          },
          tooltip: {
            valueFormatter: (value) => isPercentage
              ? (value?.toString().replace(".", ",") ?? "").concat(" %")
              : value?.toString().replace(".", ",") ?? ""
          },
        }
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, title]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      registerLocale("fr", frenchLocale);
      chartRef.current = init(containerRef.current, null, { locale: "fr" });
    }
    chartRef.current.setOption(option, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AspectRatio ratio={4.5} w={"100%"}>
      <Box position="relative" overflow="visible !important">
        <Box ref={containerRef} height={"100%"} w={"100%"} role="figure" />
      </Box>
    </AspectRatio>
  );
};
