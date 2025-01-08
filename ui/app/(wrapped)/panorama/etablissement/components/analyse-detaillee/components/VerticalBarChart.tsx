import { AspectRatio, Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";
import { CURRENT_IJ_MILLESIME } from "shared";
import { getMillesime } from "shared/utils/getMillesime";

import { formatMillesime } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";

export const VerticalBarChart = ({
  title,
  data,
}: {
  title: string;
  data: {
    label: string;
    value: number;
  }[];
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const g425 = useToken("colors", "grey.425");
  const bf113 = useToken("colors", "bluefrance.113");
  const be850a = useToken("colors", "bluefrance.850_active");
  const be850 = useToken("colors", "bluefrance.850");

  const colors: Record<string, string> = {
    [formatMillesime(getMillesime({ millesimeSortie: CURRENT_IJ_MILLESIME, offset: -2 }))]: be850,
    [formatMillesime(getMillesime({ millesimeSortie: CURRENT_IJ_MILLESIME, offset: -1 }))]: be850a,
    [formatMillesime(CURRENT_IJ_MILLESIME)]: bf113,
  };

  const getXAxisData = () => {
    if (data !== undefined) {
      return data.map((data) => data.label).reverse();
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
      toolbox: {
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
        data: getXAxisData(),
        icon: "square",
        orient: "vertical",
        right: 0,
        bottom: 15,
        padding: 0,
        itemWidth: 15,
        itemStyle: {
          color: "inherit",
        },
        textStyle: {
          color: g425,
          fontSize: 12,
        },
      },
      grid: {
        left: -30,
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
        .map((serie) => ({
          data: [serie.value],
          name: serie.label,
          type: "bar",
          color: colors[serie.label],
          barWidth: 18.5,
          barGap: "50%",
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            distance: 10,
            show: true,
            position: "top",
            formatter: "{c}{percent|%}",
            rich: {
              percent: {
                fontSize: "11px",
              },
            },
            fontSize: "13px",
            fontWeight: 700,
          },
          tooltip: {
            valueFormatter: (value) => value + "%",
          },
        })),
    }),
    [data],
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option, true);
  }, [data]);

  return (
    <AspectRatio ratio={1.3} w={"100%"}>
      <Box position="relative" overflow="visible !important">
        <Box ref={containerRef} h={"100%"} w={"100%"}></Box>
      </Box>
    </AspectRatio>
  );
};
