import { AspectRatio, Box, Flex } from "@chakra-ui/react";
import { init, registerLocale } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import { themeDefinition } from "@/theme/theme";
import { frenchLocale } from "@/utils/echarts/frenchLocale";
import { formatNumber, formatNumberToString, formatPercentage, formatPercentageWithoutSign } from "@/utils/formatUtils";

import { TableEvolution } from "./TableEvolution";

type GraphData = Record<string, number | undefined>;

export const GraphEvolution = ({
  title,
  data,
  isPercentage = false,
  keys
}: {
  title: string;
  data: GraphData;
  isPercentage?: boolean;
  keys: string[];
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
        data: data ? keys : [],
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
          data: keys.map((key) => {
            if(data[key] === undefined) return undefined;
            return isPercentage ?
              formatPercentageWithoutSign(data[key], 2) :
              formatNumber(data[key],2);
          }),
          lineStyle: {
            width: 2
          },
          animation: false,
          showSymbol: false,
          color: themeDefinition.colors.bluefrance[925],
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
    <Flex gap={2} ms={4}>
      <TableEvolution
        data={data}
        isPercentage={isPercentage}
        keys={keys}
      />
      <AspectRatio ratio={4.5} w="100%" textAlign={"right"}>
        <Box position="relative" overflow="visible !important">
          <Box ref={containerRef} height={"100%"} w={"100%"} role="figure" />
        </Box>
      </AspectRatio>
    </Flex>
  );
};
