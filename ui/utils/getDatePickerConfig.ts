import type { DatepickerConfigs } from "chakra-dayzed-datepicker";

const DATE_PICKER_CONFIG = {
  dateFormat: "dd/MM/yyyy",
  dayNames: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  monthNames: [
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
  firstDayOfWeek: 1,
} as DatepickerConfigs;

export const getDatePickerConfig = () => DATE_PICKER_CONFIG;
