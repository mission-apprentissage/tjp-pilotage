import { AspectRatio, Box, useToken } from "@chakra-ui/react";
import { init, registerLocale } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { frenchLocale } from "@/utils/echarts/frenchLocale";

export const HorizontalBarChart = ({
  title,
  data,
}: {
  title: string;
  data: Record<
    string,
    Array<{
      label: string;
      value: number;
    }>
  >;
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf525 = useToken("colors", "bluefrance.525");
  const warning = useToken("colors", "warning.525");
  const success = useToken("colors", "success.425");
  const marianneFont = useToken("fonts", "body");

  const getDelta = (valueName?: string) => {
    const current = data[CURRENT_RENTREE]?.find((data) => data.label === valueName)?.value;
    const previous = data[getRentreeScolairePrecedente(CURRENT_RENTREE)]?.find(
      (data) => data.label === valueName
    )?.value;
    if (current && previous) {
      if (current > previous) {
        return `{arrowUp|}{deltaUp|+${current - previous} vs ${getRentreeScolairePrecedente(CURRENT_RENTREE)}}`;
      } else if (current < previous) {
        return ` {arrowDown|}{deltaDown|-${previous - current} vs ${getRentreeScolairePrecedente(CURRENT_RENTREE)}}`;
      }
      return `{noDelta| +0 vs ${getRentreeScolairePrecedente(CURRENT_RENTREE)}}`;
    }
    return "";
  };

  const getXAxisData = () => {
    if (data && data[CURRENT_RENTREE]) {
      return data[CURRENT_RENTREE]?.map((data) => data.label);
    }
    return [];
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      aria: {
        label: {
          enabled: true,
          data: {
            maxCount: 100
          }
        },
      },
      animationDelay: 0.5,
      responsive: true,
      maintainAspectRatio: true,
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => `${params?.name} : ${params?.data} élève${params?.data > 1 ? "s" : ""}`,
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
      grid: {
        containLabel: true,
        bottom: 20,
        left: 5,
        right: "30%",
      },
      xAxis: {
        type: "value",
        show: false,
      },
      yAxis: {
        type: "category",
        inverse: true,
        show: true,
        data: getXAxisData(),
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
        },
      },
      series: {
        data: data[CURRENT_RENTREE]?.map((serie) => serie.value),
        type: "bar",
        color: bf525,
        barWidth: 20,
        barCategoryGap: 5,
        barGap: 1,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          distance: 10,
          show: true,
          position: "right",
          formatter: (value) => value.data + getDelta(value.name),
          rich: {
            deltaDown: {
              color: warning,
              fontFamily: marianneFont,
              fontSize: "12px",
              fontWeight: 700,
            },
            deltaUp: {
              color: success,
              fontFamily: marianneFont,
              fontSize: "12px",
              fontWeight: 700,
            },
            noDelta: {
              fontFamily: marianneFont,
              fontSize: "12px",
              fontWeight: 700,
              paddingLeft: "5px",
            },
            arrowDown: {
              backgroundColor: {
                image: "/arrow_down.svg",
              },
            },
            arrowUp: {
              backgroundColor: {
                image: "/arrow_up.svg",
              },
            },
          },
          fontSize: "14px",
          fontWeight: 700,
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
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
    <AspectRatio ratio={3.5} w={"100%"}>
      <Box position="relative" overflow="visible !important">
        <Box ref={containerRef} height={"100%"} w={"100%"} role="figure"></Box>
      </Box>
    </AspectRatio>
  );
};
