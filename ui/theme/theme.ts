import { extendBaseTheme,theme as chakraTheme } from "@chakra-ui/react";

import { badgeTheme } from "./Badge.theme";
import { breadcrumbTheme } from "./Breadcrumb.theme";
import { buttonTheme } from "./Button.theme";
import { cardTheme } from "./Card.theme";
import { checkboxTheme } from "./Checkbox.theme";
import { formStyle } from "./Label.theme";
import { linkTheme } from "./Link.theme";
import { modalTheme } from "./Modal.theme";
import { radioTheme } from "./Radio.theme";
import { selectTheme } from "./Select.theme";
import { sliderTheme } from "./Slider.theme";
import { tableTheme } from "./Table.theme";
import { tabsTheme } from "./Tabs.theme";
import { tagTheme } from "./Tag.theme";
import { textareaTheme } from "./Textarea.theme";
import { themeColors } from "./themeColors";
import { tooltipTheme } from "./Tooltip.theme";

export const themeDefinition = {
  styles: {
    global: {
      "html, body": {
        fontSize: `14px`,
        fontFamily: "Marianne, Arial",
        background: "white",
      },
      ".react-markdown> *:not(:last-child)": {
        marginBottom: "24px",
      },
    },
  },
  fonts: { heading: "Marianne, Arial", body: "Marianne, Arial" },
  colors: themeColors,
  components: {
    Button: buttonTheme,
    Tabs: tabsTheme,
    Breadcrumb: breadcrumbTheme,
    Table: tableTheme,
    Tooltip: tooltipTheme,
    Select: selectTheme,
    Card: cardTheme,
    Radio: radioTheme,
    Slider: sliderTheme,
    Link: linkTheme,
    Form: formStyle,
    Tag: tagTheme,
    Checkbox: checkboxTheme,
    Badge: badgeTheme,
    Textarea: textareaTheme,
    Modal: modalTheme,
  },
};

export const theme = extendBaseTheme(chakraTheme, themeDefinition);
