import { Box } from "@chakra-ui/react";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import _ from "lodash";
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
  handleClick,
}: {
  graphData?: { name?: string; parentName?: string; value: number }[];
  scope?: "national" | "regions" | "academies" | "departements";
  objectif?: "haut" | "bas";
  customPiecesSteps?: number[][];
  customColorPalette?: string[];
  handleClick?: (dataCode: string | undefined) => void;
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
        return REGIONS_LABEL_MAPPING;
      case "academies":
        return ACADEMIES_LABEL_MAPPING;
      case "departements":
        return DEPARTEMENTS_LABEL_MAPPING;
      default:
        return REGIONS_LABEL_MAPPING;
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
        formatter: (params: any) => {
          if (params.data && params.data?.value) {
            if (params.data.parentName) {
              return `${params.name} : ${params.data?.value}%
                  <br>
                  (<span style="font-style:italic">${params.data.parentName}</span>)`;
            }
            return `${params.name} : ${params.data?.value}%`;
          }
          return `Aucune donnée disponible pour ${params.name}`;
        },
      },
      visualMap: {
        type: "piecewise",
        splitNumber: 6,
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

  const handleClickOnSeries = (name: string) => {
    if (handleClick)
      switch (scope) {
        case "regions":
          handleClick(
            _.findKey(REGIONS_LABEL_MAPPING, _.partial(_.isEqual, name))
          );
          break;
        case "academies":
          handleClick(
            _.findKey(ACADEMIES_LABEL_MAPPING, _.partial(_.isEqual, name))
          );
          break;
        case "departements":
          handleClick(
            _.findKey(DEPARTEMENTS_LABEL_MAPPING, _.partial(_.isEqual, name))
          );
          break;
      }
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }
    chartRef.current.setOption(option);
    chartRef.current.on("click", "series", (params) =>
      handleClickOnSeries(params.name)
    );
    chartRef.current.getZr().on("click", () => {
      if (handleClick) handleClick(undefined);
    });
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

const REGIONS_LABEL_MAPPING = {
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

const ACADEMIES_LABEL_MAPPING = {
  "41": "Polynésie Française",
  "44": "Saint Pierre et Miquelon",
  "54": "Service interacadémique des examens et concours ile de France",
  "01": "Paris",
  "27": "Corse",
  "05": "Caen",
  "70": "Normandie",
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

const DEPARTEMENTS_LABEL_MAPPING = {
  "987": "Polynésie Française",
  "975": "Saint-Pierre-et-Miquelon",
  "061": "Orne",
  "042": "Loire",
  "078": "Yvelines",
  "02A": "Corse-du-Sud",
  "02B": "Haute-Corse",
  "001": "Ain",
  "088": "Vosges",
  "977": "Saint-Barthélemy",
  "018": "Cher",
  "068": "Haut-Rhin",
  "067": "Bas-Rhin",
  "015": "Cantal",
  "076": "Seine-Maritime",
  "036": "Indre",
  "052": "Haute-Marne",
  "034": "Hérault",
  "988": "Nouvelle Calédonie",
  "026": "Drôme",
  "985": "Mayotte",
  "092": "Hauts-de-Seine",
  "976": "Mayotte",
  "986": "Wallis-et-Futuna",
  "038": "Isère",
  "057": "Moselle",
  "082": "Tarn-et-Garonne",
  "087": "Haute-Vienne",
  "007": "Ardèche",
  "049": "Maine-et-Loire",
  "041": "Loir-et-Cher",
  "046": "Lot",
  "045": "Loiret",
  "033": "Gironde",
  "006": "Alpes-Maritimes",
  "086": "Vienne",
  "069": "Rhône",
  "051": "Marne",
  "074": "Haute-Savoie",
  "084": "Vaucluse",
  "002": "Aisne",
  "029": "Finistère",
  "005": "Hautes-Alpes",
  "972": "Martinique",
  "058": "Nièvre",
  "094": "Val-de-Marne",
  "024": "Dordogne",
  "019": "Corrèze",
  "055": "Meuse",
  "080": "Somme",
  "079": "Deux-Sèvres",
  "012": "Aveyron",
  "003": "Allier",
  "081": "Tarn",
  "017": "Charente-Maritime",
  "077": "Seine-et-Marne",
  "063": "Puy-de-Dôme",
  "060": "Oise",
  "971": "Guadeloupe",
  "075": "Paris",
  "025": "Doubs",
  "004": "Alpes-de-Haute-Provence",
  "035": "Ille-et-Vilaine",
  "037": "Indre-et-Loire",
  "073": "Savoie",
  "032": "Gers",
  "040": "Landes",
  "021": "Côte-d'Or",
  "016": "Charente",
  "011": "Aude",
  "083": "Var",
  "093": "Seine-St-Denis",
  "047": "Lot-et-Garonne",
  "062": "Pas-de-Calais",
  "030": "Gard",
  "014": "Calvados",
  "027": "Eure",
  "043": "Haute-Loire",
  "065": "Hautes-Pyrénées",
  "022": "Côtes d'Armor",
  "028": "Eure-et-Loir",
  "059": "Nord",
  "095": "Val-D'Oise",
  "072": "Sarthe",
  "031": "Haute-Garonne",
  "053": "Mayenne",
  "978": "Saint-Martin",
  "066": "Pyrénées-Orientales",
  "130": "Andorre",
  "050": "Manche",
  "974": "La Réunion",
  "039": "Jura",
  "044": "Loire-Atlantique",
  "008": "Ardennes",
  "973": "Guyane",
  "089": "Yonne",
  "064": "Pyrénées-Atlantiques",
  "013": "Bouches-du-Rhône",
  "070": "Haute-Saône",
  "071": "Saône-et-Loire",
  "023": "Creuse",
  "090": "Territoire de Belfort",
  "056": "Morbihan",
  "054": "Meurthe-et-Moselle",
  "010": "Aube",
  "990": "Autre pays",
  "048": "Lozère",
  "009": "Ariège",
  "091": "Essonne",
  "085": "Vendée",
};
