import { Box, Flex, Heading, Img, useToken, VStack } from "@chakra-ui/react";
import { init, registerLocale } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import type {
  PilotageDomaines,
  PilotageNiveauxDiplome,
  PilotageZonesGeographiques,
} from "@/app/(wrapped)/demandes/pilotage/types";
import { themeDefinition } from "@/theme/theme";
import { themeColors } from "@/theme/themeColors";
import { frenchLocale } from "@/utils/echarts/frenchLocale";
import { formatPercentage } from "@/utils/formatUtils";

export const PositiveNegativeBarChart = ({
  title,
  type,
  data,
}: {
  title: string;
  type: string;
  data?:
    | PilotageDomaines
    | PilotageZonesGeographiques
    | PilotageNiveauxDiplome;
}) => {

  const limit = 10;
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);
  const bf113 = useToken("colors", "bluefrance.113");
  const bf850 = useToken("colors", "bluefrance.850");
  const bf850_active = useToken("colors", "bluefrance.850_active");
  const grey925 = useToken("colors", "grey.925");
  const grey425 = useToken("colors", "grey.425");
  const pilotageGreen2 = useToken("colors", "pilotage.green.2");
  const pilotageRed = useToken("colors", "pilotage.red");

  if (!data || !Object.keys(data).filter((key) => key !== "Total").length)
    return (
      <VStack mt={16} mb={5} width="100%" backgroundColor={themeColors.grey[975]} color={themeColors.grey[625]} p={8}>
        <Heading as="h3">Aucune donnée à afficher</Heading>
        <Heading as="h4" size="md">
          pour les filtres sélectionnés
        </Heading>
        <Flex flex={1} backgroundColor={themeDefinition.colors.bluefrance[975]}>
          <Img src="/illustrations/search.svg" alt="Icône rechercher"/>
        </Flex>
      </VStack>
    );

  const getYAxisTitle = () => {
    return Object.keys(data)
      .filter((key) => key !== "Total")
      .slice(0, limit)
      .reverse();
  };

  const getSolde = () => {
    return Object.keys(data)
      .filter((key) => key !== "Total")
      .map((key) => (data[key].solde > 0 ? "+" : "") + data[key].solde)
      .slice(0, limit)
      .reverse();
  };

  const placesOuvertes = Object.keys(data)
    .filter((key) => key !== "Total")
    .map((key) => data[key].placesOuvertes)
    .slice(0, limit)
    .reverse();

  const placesFermees = Object.keys(data)
    .filter((key) => key !== "Total")
    .map((key) => -data[key].placesFermees)
    .slice(0, limit)
    .reverse();

  const placesColorees = Object.keys(data)
    .filter((key) => key !== "Total")
    .map((key) => data[key].placesColorees)
    .slice(0, limit)
    .reverse();

  const seriesOption: echarts.BarSeriesOption = {
    type: "bar",
    barGap: 0.5,
    barCategoryGap: "20%",
    label: {
      show: false,
    },
    yAxisIndex: 0,
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
      animationDelay: 0.5,
      responsive: true,
      maintainAspectRatio: true,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        textStyle: {
          width: "fit-content",
          color: grey425,
          fontSize: 14,
          fontFamily: "Marianne",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          return `
            <div style="min-width: fit-content;">
              <span>${params[0]?.name} :</span>
              ${
      data[params[0]?.name].tauxTransformation
        ? `
                <div>
                  (taux de transformation :
                  ${formatPercentage(data[params[0]?.name].tauxTransformation, 1)})
                </div>
                `
        : ""
      }
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${
      params[0]?.color
      }; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Colorations :
                  <span style="font-weight: 700;">${params[0]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${
      params[2]?.color
      }; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. ouvertes :
                  <span style="font-weight: 700;">${params[2]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 5px;">
                <span style="border-radius: 100%; width:15px; height:15px; background-color:${
      params[1]?.color
      }; margin-right: 6px; margin-top: 1px; float: left;"></span>
                <span>
                  Pl. fermées :
                  <span style="font-weight: 700;"> ${-params[1]?.data}</span>
                </span>
              </div>
              <br />
              <div style="display: inline-block; margin-top: 15px;">
                <span>
                  Pl. transformées :
                  <span style="font-weight: 700;"> ${data[params[0]?.name].placesTransformees}</span>
                </span>
              </div>
            </div>
            `;
        },
      },
      toolbox: {
        z: 2,
        showTitle: false,
        tooltip: {
          show: true,
          textStyle: {
            color: bf113,
            backgroundColor: "transparent",
            fontSize: 12,
            fontFamily: "Marianne",
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => `${params.title}`,
        },
        feature: {
          saveAsImage: {
            title: "Télécharger sous format .png",
            name: title,
            type: "png",
            backgroundColor: "transparent",
            zIndex: 2,
            textStyle: {
              color: bf113,
              fontFamily: "Marianne",
            },
            iconStyle: {
              color: bf113,
              width: 20,
            },
            icon: "image://../icons/download.svg",
          },
        },
      },
      legend: {
        show: true,
        margin: 15,
        bottom: "5%",
        right: 0,
        itemGap: 15,
        itemWidth: 15,
        selectedMode: false,
        textStyle: {
          color: grey425,
          fontSize: 14,
          fontFamily: "Marianne",
        },
        formatter: (value: string) => `${value.replace("Place(s) ", "Pl. ").replace("(s)", "s")}`,
        data: [
          {
            name: "Coloration(s)",
            icon: "square",
          },
          {
            name: "Place(s) ouverte(s)",
            icon: "square",
          },
          {
            name: "Place(s) fermée(s)",
            icon: "square",
          },
        ],
      },
      grid: {
        id: 1,
        left: "35%",
        top: "20%",
      },
      xAxis: {
        type: "value",
        show: false,
        nameGap: 0,
        boundaryGap: false,
        limit: 10,
      },
      yAxis: [
        {
          name: type,
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 14,
            color: grey425,
            fontFamily: "Marianne",
            margin: 0,
            align: "left",
          },
          type: "category",
          show: true,
          data: getYAxisTitle(),
          offset: 400,
          axisLabel: {
            show: true,
            fontSize: 12,
            fontWeight: 400,
            color: grey425,
            align: "left",
            width: 350,
            overflow: "truncate",
            fontFamily: "Marianne",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            onZero: false,
          },
          splitArea: {
            show: false,
          },
        },
        {
          name: "Solde",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 14,
            color: grey425,
            fontFamily: "Marianne",
            margin: 0,
            align: "left",
          },
          type: "category",
          show: true,
          data: getSolde(),
          axisLabel: {
            show: true,
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "Marianne",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (value: any) => {
              if ((value as number) > 0) {
                return "{green|" + value + "}"; // Texte en vert si > 0
              } else {
                return "{red|" + value + "}"; // Texte en rouge si <= 0
              }
            },
            rich: {
              green: {
                color: pilotageGreen2,
                fontSize: 14,
                fontWeight: 400,
              },
              red: {
                color: pilotageRed,
                fontSize: 14,
                fontWeight: 400,
              },
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            onZero: false,
          },
        },
      ],
      series: [
        {
          data: placesColorees,
          position: "right",
          color: bf850,
          itemStyle: {
            borderRadius: 4,
          },
          barWidth: 5,
          name: "Coloration(s)",
          ...seriesOption,
        },
        {
          data: placesFermees,
          stack: "placesTransformées",
          stackStrategy: "all",
          color: bf113,
          itemStyle: {
            borderRadius: [4, 0, 0, 4],
          },
          barWidth: 12,
          name: "Place(s) fermée(s)",
          formatter: (value: number) => `${-value}`,
          ...seriesOption,
        },
        {
          data: placesOuvertes,
          stack: "placesTransformées",
          color: bf850_active,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },
          barWidth: 12,
          name: "Place(s) ouverte(s)",
          ...seriesOption,
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    <Box position="relative" overflow={"visible !important"} h="400px" border={`1px solid ${grey925}`} borderRadius="md" p={3}>
      <Box ref={containerRef} h={"100%"} w={"100%"} role="figure" />
    </Box>
  );
};
