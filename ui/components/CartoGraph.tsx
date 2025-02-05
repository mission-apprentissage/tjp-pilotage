import { AspectRatio, Box, useToken } from "@chakra-ui/react";
import type { EChartsOption } from "echarts";
import * as echarts from "echarts";
import { findKey, isEqual, partial } from "lodash";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ScopeZone } from "shared";
import { ScopeEnum } from "shared";

import type { SelectedScope } from "@/app/(wrapped)/intentions/pilotage/types";
import CarteFranceAcademies from "@/public/fond_carte_academies.json";
import CarteFranceDepartements from "@/public/fond_carte_departements.json";
import CarteFranceRegions from "@/public/fond_carte_regions.json";
import { frenchLocale } from "@/utils/echarts/frenchLocale";
import { formatPercentage } from "@/utils/formatUtils";

const useColorPalette = (customColorPalette?: string[], objectif?: "haut" | "bas") => {
  const lowColorPalette = [
    useToken("colors", "pinkmacaron.950"),
    useToken("colors", "pinkmacaron.925"),
    useToken("colors", "pinkmacaron.850"),
    useToken("colors", "pinkmacaron.689"),
  ];

  const defaultColorPalette = [
    useToken("colors", "blueecume.925"),
    useToken("colors", "blueecume.675_hover"),
    useToken("colors", "blueecume.400_hover"),
    useToken("colors", "bluefrance.113"),
  ];

  if (customColorPalette) {
    return customColorPalette;
  }

  if (objectif === "bas") {
    return lowColorPalette;
  }

  return defaultColorPalette;
};

interface CartoGraphProps {
  graphData?: {
    name?: string;
    parentName?: string;
    value?: number;
    code?: string;
  }[];
  scope?: ScopeZone;
  objectif?: "haut" | "bas";
  customPiecesSteps?: number[][];
  customColorPalette?: string[];
  handleClick?: (dataCode: string | undefined) => void;
  codeRegionSelectionne?: string;
  selectedScope?: SelectedScope;
}

export const CartoGraph = ({
  graphData,
  scope = ScopeEnum["région"],
  objectif = "haut",
  customPiecesSteps,
  customColorPalette,
  handleClick,
  selectedScope,
  codeRegionSelectionne,
}: CartoGraphProps) => {
  const colorPalette = useColorPalette(customColorPalette, objectif);
  const bluefrance525 = useToken("colors", "bluefrance.525");
  const bluefrance113 = useToken("colors", "bluefrance.113");
  const chartRef = useRef<echarts.ECharts>();
  const containerRef = useRef<HTMLDivElement>(null);

  const getGeoMap = () => {
    switch (scope) {
    case ScopeEnum["région"]:
      return JSON.parse(JSON.stringify(CarteFranceRegions));
    case ScopeEnum["académie"]:
      return JSON.parse(JSON.stringify(CarteFranceAcademies));
    case ScopeEnum["département"]:
      return JSON.parse(JSON.stringify(CarteFranceDepartements));
    case ScopeEnum["national"]:
    default:
      return JSON.parse(JSON.stringify(CarteFranceRegions));
    }
  };

  const getNameProperty = (): string => {
    switch (scope) {
    case ScopeEnum["région"]:
      return "reg";
    case ScopeEnum["académie"]:
      return "code_academie";
    case ScopeEnum["département"]:
      return "dep";
    case ScopeEnum["national"]:
    default:
      return "reg";
    }
  };

  const getNameMap = (): Record<string, string> => {
    switch (scope) {
    case ScopeEnum["région"]:
      return REGIONS_LABEL_MAPPING;
    case ScopeEnum["académie"]:
      return ACADEMIES_LABEL_MAPPING;
    case ScopeEnum["département"]:
      return DEPARTEMENTS_LABEL_MAPPING;
    case ScopeEnum["national"]:
    default:
      return REGIONS_LABEL_MAPPING;
    }
  };

  echarts.registerMap(scope, getGeoMap());

  //TODO : améliorer la gestion de la graduation dynamique
  const getPieces = (): {
    min: number;
    max: number;
    label: string;
    color: string;
}[] => {
    if(customPiecesSteps) {
      const colorRange = colorPalette;

      return customPiecesSteps.map((step, index, steps) => {
        const isLastStep = index + 1 === steps.length;
        return {
          min: step[0],
          max: step[1],
          label: isLastStep ? `> ${step[0]}%` : `< ${step[1]}%`,
          color: colorRange[index],
        };
      });
    }

    // Filtrer les valeurs valides et les trier
    const validData = Array.from(graphData?.map((it) => it.value ?? -1) ?? [])
      .filter((value) => value !== -1)
      .sort((a, b) => a - b);

    if (validData.length === 0) return [];

    // Cas où toutes les valeurs sont identiques
    if (validData[0] === validData[validData.length - 1]) {
      return [{
        min: validData[0],
        max: validData[0],
        label: `${validData[0]}%`,
        color: colorPalette[0]
      }];
    }

    // Obtenir les valeurs uniques
    const uniqueValues = Array.from(new Set(validData));

    // Si nous avons 4 valeurs uniques ou moins, créer un ensemble pour chaque valeur
    if (uniqueValues.length <= 4) {
      return uniqueValues.map((value, index) => ({
        min: value,
        max: value,
        label: `${value}%`,
        color: colorPalette[index]
      }));
    }

    // Pour plus de 4 valeurs, créer 4 quartiles
    const getQuartileValue = (arr: number[], quartile: number): number => {
      const position = (arr.length - 1) * (quartile / 4);
      const base = Math.floor(position);
      const rest = position - base;

      if (rest === 0) {
        return arr[base];
      } else {
        return arr[base] + rest * (arr[base + 1] - arr[base]);
      }
    };

    // Calculer les quartiles
    const q1 = getQuartileValue(validData, 1); // 25%
    const q2 = getQuartileValue(validData, 2); // 50%
    const q3 = getQuartileValue(validData, 3); // 75%

    return [
      {
        min: validData[0],
        max: q1,
        label: `≤ ${q1}%`,
        color: colorPalette[0]
      },
      {
        min: q1,
        max: q2,
        label: `≤ ${q2}%`,
        color: colorPalette[1]
      },
      {
        min: q2,
        max: q3,
        label: `≤ ${q3}%`,
        color: colorPalette[2]
      },
      {
        min: q3,
        max: validData[validData.length - 1],
        label: `> ${q3}%`,
        color: colorPalette[3]
      }
    ];
  };

  const option = useMemo<EChartsOption>(
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
        trigger: "item",
        showDelay: 0,
        transitionDuration: 0.2,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          if (params?.data?.value !== undefined) {
            if (params.data.parentName) {
              return `${params.name} : ${formatPercentage(params.data?.value / 100, 1)}
                  <br>
                  (<span style="font-style:italic">${params.data.parentName}</span>)`;
            }
            return `${params.name} : ${formatPercentage(params.data?.value / 100, 1)}`;
          }
          return `Aucune donnée disponible pour ${params.name}`;
        },
        fontFamily: "Marianne, Arial",
        fontWeight: 600,
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
          animation: false,
          emphasis: {
            label: {
              show: false,
              color: bluefrance113,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: "Marianne, Arial",
              backgroundColor: "white",
              height: 20,
              lineHeight: 15,
              formatter: "  {b}  ",
            },
            itemStyle: {
              areaColor: "inherit",
              borderColor: bluefrance525,
              borderWidth: 1,
            },
          },
          selectedMode: "single",
          select: {
            disabled: false,
            label: {
              color: bluefrance113,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: "Marianne, Arial",
              backgroundColor: "white",
              height: 20,
              lineHeight: 15,
              formatter: "  {b}  ",
            },
            itemStyle: {
              areaColor: "white",
              borderColor: bluefrance113,
            },
          },
          nameProperty: getNameProperty(),
          nameMap: getNameMap(),
          itemStyle: {
            borderColor: "white",
          },
          data: graphData,
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphData, scope, getNameMap, getNameProperty]
  );

  const handleClickOnSeries = (name: string) => {
    if (handleClick)
      switch (scope) {
      case ScopeEnum["région"]:
        handleClick(findKey(REGIONS_LABEL_MAPPING, partial(isEqual, name)));
        break;
      case ScopeEnum["académie"]:
        handleClick(findKey(ACADEMIES_LABEL_MAPPING, partial(isEqual, name)));
        break;
      case ScopeEnum["département"]:
        handleClick(findKey(DEPARTEMENTS_LABEL_MAPPING, partial(isEqual, name)));
        break;
      case ScopeEnum["national"]:
      default:
        break;
      }
  };

  const unSelectAll = useCallback(() => {
    chartRef.current?.dispatchAction({
      type: "unselect",
      dataIndex: new Array(graphData?.length ?? 0).fill(0).map((_, index) => index),
    });
  }, [chartRef, graphData]);

  const handleClickOnBlankSpace = () => {
    if (handleClick) {
      handleClick(undefined);
      unSelectAll();
    }
  };

  const selectRegion = (codeRegion: string) => {
    if (!chartRef.current) return;

    const regionLabelKey = Object.keys(REGIONS_LABEL_MAPPING).find((region) => region === codeRegion) as unknown as
      | keyof typeof REGIONS_LABEL_MAPPING
      | undefined;

    if (regionLabelKey) {
      const regionLabel = REGIONS_LABEL_MAPPING[regionLabelKey];

      chartRef.current.dispatchAction({
        type: "select",
        dataIndex: graphData?.findIndex((data) => data.name == regionLabel),
      });
    } else {
      unSelectAll();
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      echarts.registerLocale("fr", frenchLocale);
      chartRef.current = echarts.init(containerRef.current, null, { locale: "fr" });
    }
    console.log({option});
    chartRef.current.setOption(option);
    chartRef.current.on("click", "series", (params) => {
      handleClickOnSeries(params.name);
    });
    chartRef.current.getZr().on("click", (event) => {
      if (!event.target) {
        handleClickOnBlankSpace();
      }
    });
    if (codeRegionSelectionne) {
      selectRegion(codeRegionSelectionne);
    } else {
      unSelectAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, graphData, codeRegionSelectionne, chartRef, handleClickOnSeries, handleClickOnBlankSpace]);

  useEffect(() => {
    if (selectedScope?.value) {
      const currentIndex = graphData?.findIndex((data) => data.code === selectedScope.value);

      if (currentIndex !== -1) {
        chartRef.current?.dispatchAction({
          type: "select",
          dataIndex: currentIndex,
        });
      }
    } else {
      unSelectAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScope, chartRef]);

  return (
    <AspectRatio ratio={1}>
      <Box ref={containerRef} w="100%" height="100%" role="figure" />
    </AspectRatio>
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
