import { extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

import { BreadcrumbTheme } from "@/theme/Breadcrumb.theme";
import { tableTheme } from "@/theme/Table.theme";
import { tabsTheme } from "@/theme/Tabs.theme";
import { tooltipTheme } from "@/theme/Tooltip.theme";

import { buttonTheme } from "./Button.theme";

export const theme = extendBaseTheme(chakraTheme, {
  styles: {
    global: {
      "html, body": {
        fontSize: `16px`,
        fontFamily: "Marianne, Arial",
        background: "white",
      },
    },
  },
  fonts: { heading: "Marianne, Arial", body: "Marianne, Arial" },
  colors: {
    bluefrance: {
      113: "#000091",
      "113_hover": "#1212ff",
      "113_active": "#2323ff",
      525: "#6a6af4",
      "525_hover": "#b1b1f9",
      "525_active": "#c6c6fb",
      925: "#e3e3fd",
      "925_hover": "#c1c1fb",
      "925_active": "#adadf9",
    },
    redmarianne: {
      625: "#f95c5e",
      "625_hover": "#fa9293",
      "625_active": "#fbabac",
    },
    grey: {
      1000: "#ffffff",
      "1000_hover": "#f6f6f6",
      "1000_active": "#ededed",
      950: "#eeeeee",
      "950_hover": "#d2d2d2",
      "950_active": "#c1c1c1",
      900: "#dddddd",
      "900_hover": "#bbbbbb",
      "900_active": "#a7a7a7",
      200: "#3a3a3a",
      "200_hover": "#616161",
      "200_active": "#777777",
      425: "#666666",
      "425_hover": "#919191",
      "425_active": "#a6a6a6",
      525: "#7b7b7b",
      "525_hover": "#a6a6a6",
      "525_active": "#bababa",
    },
  },
  components: {
    Button: buttonTheme,
    Tabs: tabsTheme,
    Breadcrumb: BreadcrumbTheme,
    Table: tableTheme,
    Tooltip: tooltipTheme,
  },
});
