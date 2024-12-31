export const frenchLocale = {
  time: {
    month: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthAbbr: ["Jan.", "Fév.", "Mar.", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sep.", "Oct.", "Nov.", "Déc."],
    dayOfWeek: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    dayOfWeekAbbr: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  },
  legend: {
    selector: {
      all: "Tous",
      inverse: "Inv",
    },
  },
  toolbox: {
    brush: {
      title: {
        rect: "Box Select",
        polygon: "Lasso Select",
        lineX: "Horizontally Select",
        lineY: "Vertically Select",
        keep: "Keep Selections",
        clear: "Clear Selections",
      },
    },
    dataView: {
      title: "Data View",
      lang: ["Data View", "Close", "Refresh"],
    },
    dataZoom: {
      title: {
        zoom: "Zoom",
        back: "Zoom Reset",
      },
    },
    magicType: {
      title: {
        line: "Switch to Line Chart",
        bar: "Switch to Bar Chart",
        stack: "Stack",
        tiled: "Tile",
      },
    },
    restore: {
      title: "Restore",
    },
    saveAsImage: {
      title: "Save as Image",
      lang: ["Right Click to Save Image"],
    },
  },
  series: {
    typeNames: {
      pie: "Graphique circulaire",
      bar: "Histogramme",
      line: "Line chart",
      scatter: "Graphique en nuage de points",
      effectScatter: "Ripple scatter plot",
      radar: "Radar chart",
      tree: "Tree",
      treemap: "Treemap",
      boxplot: "Boxplot",
      candlestick: "Candlestick",
      k: "K line chart",
      heatmap: "Heat map",
      map: "Map",
      parallel: "Parallel coordinate map",
      lines: "Line graph",
      graph: "Relationship graph",
      sankey: "Sankey diagram",
      funnel: "Funnel chart",
      gauge: "Gauge",
      pictorialBar: "Pictorial bar",
      themeRiver: "Theme River Map",
      sunburst: "Sunburst",
      custom: "Custom chart",
      chart: "Chart",
    },
  },
  aria: {
    general: {
      withTitle: 'Ce graphique est à propos de "{title}"',
      withoutTitle: "Ceci est un graphique",
    },
    series: {
      single: {
        prefix: "",
        withName: " avec {seriesType} nommé {seriesName}.",
        withoutName: " with type {seriesType}.",
      },
      multiple: {
        prefix: ". It consists of {seriesCount} series count",
        withName: " The {seriesId} series is a {seriesType} representing {seriesName}.",
        withoutName: " The {seriesId} series is a {seriesType}.",
        separator: {
          middle: ", ",
          end: ". ",
        },
      },
    },
    data: {
      allData: "La donnée est comme suit : ",
      partialData: "Les {displayCnt} premiers éléments sont : ",
      withName: "la donnée pour {name} est {value}",
      withoutName: "{value}",
      separator: {
        middle: ", ",
        end: ". ",
      },
    },
  },
};
