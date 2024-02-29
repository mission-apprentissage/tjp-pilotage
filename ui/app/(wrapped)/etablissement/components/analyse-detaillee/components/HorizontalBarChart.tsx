import { Box, useToken } from "@chakra-ui/react";
import * as echarts from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

export const HorizontalBarChart = ({
  data,
  rentreeScolaire,
}: {
  data: Record<
    string,
    {
      label: string;
      value: number;
    }[]
  >;
  rentreeScolaire: string;
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf113 = useToken("colors", "bluefrance.113");
  const be850a = useToken("colors", "blueecume.850_active");
  const be850 = useToken("colors", "bluefrance.850");
  const warning = useToken("colors", "warning.525");
  const success = useToken("colors", "success.425");
  const marianneFont = useToken("fonts", "body");

  const colors = [bf113, be850a, be850];

  const getDelta = (current?: number, previous?: number) => {
    if (current && previous) {
      if (current > previous) {
        return ` {arrowUp|}{deltaUp|+${current - previous}}`;
      } else if (current < previous) {
        return ` {arrowDown|}{deltaDown|-${previous - current}}`;
      }
    }
    return "";
  };

  const getXAxisData = () => {
    if (data && data[rentreeScolaire]) {
      return data[rentreeScolaire].map((data) => data.label);
    }
    return [];
  };

  const option = useMemo<echarts.EChartsOption>(
    () => ({
      animationDelay: 1,
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
        right: 10,
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
        left: "-20%",
        right: "40%",
        bottom: "0%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        show: false, // Hide X-axis
      },
      yAxis: {
        type: "category",
        show: false, // Hide Y-axis
      },
      series: data[rentreeScolaire].map((serie, index) => ({
        data: [serie.value],
        name: serie.label,
        type: "bar",
        color: colors[index],
        // colorBy: "data",
        barWidth: 30,
        barGap: "50%",
        barCategoryGap: "10%",
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          distance: 10,
          show: true,
          position: "right",
          formatter: (value) =>
            value.data +
            getDelta(value.data as number, data[2022][index].value),
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
      <Box ref={containerRef} height={300} width={1000}></Box>
    </Box>
  );
};
