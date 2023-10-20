import { Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import { useLayoutEffect, useMemo, useRef } from "react";

import CarteFranceAcademies from "../public/fond_carte_academies.json";
import CarteFranceDepartements from "../public/fond_carte_departements.json";
import CarteFranceRegions from "../public/fond_carte_regions.json";

export const CartoGraph = ({
  graphData,
  scope = "regions",
  objectif = "haut",
  customPiecesSteps,
  customColorPalette,
}: {
  graphData?: { name?: string; value: number }[];
  scope?: "national" | "regions" | "academies" | "departements";
  objectif?: "haut" | "bas";
  customPiecesSteps?: number[][];
  customColorPalette?: string[];
}) => {
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const getGeoMap = () => {
    switch (scope) {
      case "regions":
        return JSON.parse(JSON.stringify(CarteFranceRegions));
      case "academies":
        return JSON.parse(JSON.stringify(CarteFranceAcademies));
      case "departements":
        return JSON.parse(JSON.stringify(CarteFranceDepartements));
      default:
        return JSON.parse(JSON.stringify(CarteFranceRegions));
    }
  };

  const getNameProperty = (): string => {
    switch (scope) {
      case "regions":
        return "reg";
      case "academies":
        return "code_academie";
      case "departements":
        return "dep";
      default:
        return "reg";
    }
  };

  const getNameMap = (): Record<string, string> => {
    switch (scope) {
      case "regions":
        return REGION_LABEL_MAPPING;
      case "academies":
        return ACADEMIES_LABEL_MAPPING;
      case "departements":
        return DEPARTEMENTS_LABEL_MAPPING;
      default:
        return REGION_LABEL_MAPPING;
    }
  };

  echarts.registerMap(scope, getGeoMap());

  // Utilisée pour supprimer les valeurs extrèmes
  const removeMin = (array: number[]): number[] => {
    const min = Math.min(...array);
    return array.filter((value) => value != min);
  };

  const removeMax = (array: number[]): number[] => {
    const max = Math.max(...array);
    return array.filter((value) => value != max);
  };

  //TODO : améliorer la gestion de la graduation dynamique
  const getPieces = (): {
    min: number;
    max: number;
    label: string;
    color: string;
  }[] => {
    const data = Array.from(
      graphData?.map((it) => it.value ?? -1) ?? []
    ).filter((value) => value != -1);
    const min = Math.min(...removeMin(data));
    const max = Math.max(...removeMax(data));
    const diff = max - min;

    const colorRange = customColorPalette
      ? customColorPalette
      : objectif === "bas"
      ? ["#FEE9E6", "#FDDFDA", "#FCC0B4", "#E18B76"]
      : ["#D5DBEF", "#ABB8DE", "#5770BE", "#000091"];

    const piecesStep = customPiecesSteps
      ? customPiecesSteps
      : [
          [0, min],
          [min, Math.ceil(max - diff / 4)],
          [Math.ceil(max - diff / 4), max],
          [max, 100],
        ];

    return piecesStep.map((step, index, steps) => {
      const isLastStep = index + 1 === steps.length;
      return {
        min: step[0],
        max: step[1],
        label: isLastStep ? `> ${step[0]}%` : `< ${step[1]}%`,
        color: colorRange[index],
      };
    });
  };

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "item",
        showDelay: 0,
        transitionDuration: 0.2,
        //@ts-ignore
        formatter: function (params: any) {
          if (params.data && params.data?.value)
            return `${params.name} : ${params.data?.value}%`;
          return `Aucune donnée disponible pour ${params.name}`;
        },
      },
      visualMap: {
        type: "piecewise",
        splitNumber: 4,
        pieces: getPieces(),
        left: "left",
        min: 0,
        max: 100,
        orient: "horizontal",
      },
      // permet de supprimer l'aspect "écrasé" de la carte
      projection: {
        project: (point: [number, number]): [number, number] => [
          (point[0] / 180) * Math.PI,
          -Math.log(Math.tan((Math.PI / 2 + (point[1] / 180) * Math.PI) / 2)),
        ],
        unproject: (point: [number, number]): [number, number] => [
          (point[0] * 180) / Math.PI,
          ((2 * 180) / Math.PI) * Math.atan(Math.exp(point[1])) - 90,
        ],
      },
      series: [
        {
          name: scope,
          type: "map",
          map: scope,
          emphasis: {
            label: {
              show: false,
              color: "#000091",
              fontWeight: 700,
            },
            itemStyle: {
              areaColor: "white",
              borderColor: objectif === "bas" ? "#E18B76" : "#000091",
            },
          },
          select: {
            disabled: true,
          },
          nameProperty: getNameProperty(),
          nameMap: getNameMap(),
          itemStyle: {
            borderColor: "#FFF",
          },
          data: graphData,
        },
      ],
    }),
    [graphData]
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option);
  }, [option, graphData]);

  return (
    <Box position="relative" overflow="visible !important">
      <Box
        ref={containerRef}
        position="absolute"
        right="0"
        top="0"
        left="0"
        bottom="0"
        height={"540"}
      ></Box>
    </Box>
  );
};

const REGION_LABEL_MAPPING = {
  "52": "Pays de la Loire",
  "24": "Centre-Val de Loire",
  "03": "Guyane",
  "93": "Provence-Alpes-Côte d'Azur",
  "94": "Corse",
  "32": "Hauts-de-France",
  "11": "Île-de-France",
  "01": "Guadeloupe",
  "44": "Grand Est",
  "02": "Martinique",
  "04": "La Réunion",
  "84": "Auvergne-Rhône-Alpes",
  "76": "Occitanie",
  "28": "Normandie",
  "75": "Nouvelle-Aquitaine",
  "27": "Bourgogne-Franche-Comté",
  "53": "Bretagne",
  "06": "Mayotte",
};

const DEPARTEMENTS_LABEL_MAPPING = {
  "987": "Polynésie Française",
  "975": "Saint-Pierre-et-Miquelon",
  "61": "Orne",
  "42": "Loire",
  "78": "Yvelines",
  "2A": "Corse-du-Sud",
  "2B": "Haute-Corse",
  "01": "Ain",
  "88": "Vosges",
  "977": "Saint-Barthélemy",
  "18": "Cher",
  "68": "Haut-Rhin",
  "67": "Bas-Rhin",
  "15": "Cantal",
  "76": "Seine-Maritime",
  "36": "Indre",
  "52": "Haute-Marne",
  "34": "Hérault",
  "988": "Nouvelle Calédonie",
  "26": "Drôme",
  "985": "Mayotte",
  "92": "Hauts-de-Seine",
  "976": "Mayotte",
  "986": "Wallis-et-Futuna",
  "38": "Isère",
  "57": "Moselle",
  "82": "Tarn-et-Garonne",
  "87": "Haute-Vienne",
  "07": "Ardèche",
  "49": "Maine-et-Loire",
  "41": "Loir-et-Cher",
  "46": "Lot",
  "45": "Loiret",
  "33": "Gironde",
  "06": "Alpes-Maritimes",
  "86": "Vienne",
  "69": "Rhône",
  "51": "Marne",
  "74": "Haute-Savoie",
  "84": "Vaucluse",
  "02": "Aisne",
  "29": "Finistère",
  "05": "Hautes-Alpes",
  "972": "Martinique",
  "58": "Nièvre",
  "94": "Val-de-Marne",
  "24": "Dordogne",
  "19": "Corrèze",
  "55": "Meuse",
  "80": "Somme",
  "79": "Deux-Sèvres",
  "12": "Aveyron",
  "03": "Allier",
  "81": "Tarn",
  "17": "Charente-Maritime",
  "77": "Seine-et-Marne",
  "63": "Puy-de-Dôme",
  "60": "Oise",
  "971": "Guadeloupe",
  "75": "Paris",
  "25": "Doubs",
  "04": "Alpes-de-Haute-Provence",
  "35": "Ille-et-Vilaine",
  "37": "Indre-et-Loire",
  "73": "Savoie",
  "32": "Gers",
  "40": "Landes",
  "21": "Côte-d'Or",
  "16": "Charente",
  "11": "Aude",
  "83": "Var",
  "93": "Seine-St-Denis",
  "47": "Lot-et-Garonne",
  "62": "Pas-de-Calais",
  "30": "Gard",
  "14": "Calvados",
  "27": "Eure",
  "43": "Haute-Loire",
  "65": "Hautes-Pyrénées",
  "22": "Côtes d'Armor",
  "28": "Eure-et-Loir",
  "59": "Nord",
  "95": "Val-D'Oise",
  "72": "Sarthe",
  "31": "Haute-Garonne",
  "53": "Mayenne",
  "978": "Saint-Martin",
  "66": "Pyrénées-Orientales",
  "130": "Andorre",
  "50": "Manche",
  "974": "La Réunion",
  "39": "Jura",
  "44": "Loire-Atlantique",
  "08": "Ardennes",
  "973": "Guyane",
  "89": "Yonne",
  "64": "Pyrénées-Atlantiques",
  "13": "Bouches-du-Rhône",
  "70": "Haute-Saône",
  "71": "Saône-et-Loire",
  "23": "Creuse",
  "90": "Territoire de Belfort",
  "56": "Morbihan",
  "54": "Meurthe-et-Moselle",
  "10": "Aube",
  "990": "Autre pays",
  "48": "Lozère",
  "09": "Ariège",
  "91": "Essonne",
  "85": "Vendée",
};

const ACADEMIES_LABEL_MAPPING = {
  "41": "Polynésie Française",
  "44": "Saint Pierre et Miquelon",
  "54": "Service interacadémique des examens et concours ile de France",
  "01": "Paris",
  "27": "Corse",
  "05": "Caen",
  "00": "Etranger",
  "15": "Strasbourg",
  "40": "Nouvelle Calédonie",
  "91": "Union européenne",
  "43": "Mayotte",
  "42": "Wallis et Futuna",
  "63": "Collectivités d'Outre-Mer",
  "09": "Lille",
  "32": "Guadeloupe",
  "18": "Orléans-Tours",
  "23": "Nice",
  "28": "La Réunion",
  "61": "France métropolitaine",
  "10": "Lyon",
  "08": "Grenoble",
  "33": "Guyane",
  "31": "Martinique",
  "02": "Aix-Marseille",
  "07": "Dijon",
  "24": "Créteil",
  "03": "Besançon",
  "14": "Rennes",
  "04": "Bordeaux",
  "22": "Limoges",
  "12": "Nancy-Metz",
  "19": "Reims",
  "20": "Amiens",
  "99": "Non définie ou sans objet",
  "66": "France métropolitaine et DOM",
  "11": "Montpellier",
  "25": "Versailles",
  "06": "Clermont-Ferrand",
  "16": "Toulouse",
  "67": "France entière",
  "13": "Poitiers",
  "17": "Nantes",
  "62": "Départements d'Outre-Mer",
  "21": "Rouen",
};
