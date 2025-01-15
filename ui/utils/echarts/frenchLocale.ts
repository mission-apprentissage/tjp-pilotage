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
      inverse: "Inverser",
    },
  },
  toolbox: {
    brush: {
      title: {
        rect: "Sélection par rectangle",
        polygon: "Sélection par lasso",
        lineX: "Sélection horizontale",
        lineY: "Sélection verticale",
        keep: "Garder les sélections",
        clear: "Effacer les sélections",
      },
    },
    dataView: {
      title: "Vue des données",
      lang: ["Vue des données", "Fermer", "Rafraîchir"],
    },
    dataZoom: {
      title: {
        zoom: "Zoom",
        back: "Réinitialiser le zoom",
      },
    },
    magicType: {
      title: {
        line: "Passer au graphique en ligne",
        bar: "Passer au graphique en barres",
        stack: "Empiler",
        tiled: "Carreler",
      },
    },
    restore: {
      title: "Restaurer",
    },
    saveAsImage: {
      title: "Enregistrer comme image",
      lang: ["Clic droit pour enregistrer l'image"],
    },
  },
  series: {
    typeNames: {
      pie: "Graphique circulaire",
      bar: "Histogramme",
      line: "Graphique en ligne",
      scatter: "Graphique en nuage de points",
      effectScatter: "Graphique de dispersion",
      radar: "Graphique radar",
      tree: "Arbre",
      treemap: "Carte arborescente",
      boxplot: "Boîte à moustaches",
      candlestick: "Chandelier",
      k: "Graphique K-line",
      heatmap: "Carte thermique",
      map: "Carte",
      parallel: "Carte de coordonnées parallèles",
      lines: "Graphique en lignes",
      graph: "Graphique de relations",
      sankey: "Diagramme de Sankey",
      funnel: "Graphique en entonnoir",
      gauge: "Jauge",
      pictorialBar: "Barre picturale",
      themeRiver: "Carte de rivière thématique",
      sunburst: "Rayonnement",
      custom: "Graphique personnalisé",
      chart: "Graphique",
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
        withName: " avec {seriesType} nommé {seriesName}. ",
        withoutName: " avec type {seriesType}. ",
      },
      multiple: {
        prefix: ". Il se compose de {seriesCount} séries",
        withName: " La série {seriesId} est un {seriesType} représentant {seriesName}. ",
        withoutName: " La série {seriesId} est un {seriesType}.",
        separator: {
          middle: ", ",
          end: ". ",
        },
      },
    },
    data: {
      allData: "Les données sont les suivantes : ",
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
