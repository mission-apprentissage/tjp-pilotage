import _ from "lodash";
export const formatDate = ({
  date,
  options,
  dateTimeSeparator,
  nullValue = ""
}: {
  date?: string;
  options?: {
    dateStyle?: "short" | "medium" | "long" | "full";
    timeStyle?: "short" | "medium" | "long" | "full";
  };
  dateTimeSeparator?: string;
  nullValue?: string;
}) => {
  if (!date) return nullValue;
  if (!dateTimeSeparator) return new Date(date).toLocaleString("fr-FR", options);
  const [datePart, timePart] = new Date(date).toLocaleString("fr-FR", options).split(" ");
  return `${datePart}${dateTimeSeparator}${timePart ?? ""}`;
};

export const formatBoolean = (value?: boolean) => {
  if (value) return "Oui";
  return "Non";
};

export const formatArray = (values?: Array<string | number | undefined>, capitalize: boolean = false): string => {
  if (!values) return "Aucun(e)";
  if (capitalize) {
    if (values.length === 1 && values[0]) return _.capitalize(values[0].toString());
    return _.capitalize(
      values
        .filter((value) => value)
        .join(", ")
        .toLowerCase()
    );
  }
  if (values.length === 1 && values[0]) return values[0].toString();
  return values.filter((value) => value).join(", ");
};

export const formatNumber = (
  value?: number,
  numberOfDigits: number = 0,
  nullValue: number = 0
): number => {
  if (value === undefined || value === null || Number.isNaN(value)) return nullValue;
  return Number.parseFloat(value.toFixed(numberOfDigits));
};

export const formatNumberToString = (
  value?: number | null,
  numberOfDigits: number = 0,
  nullValue: string = "0"
): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return nullValue;
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: numberOfDigits,
  }).format(value);
};

export const formatNumberToMonetaryString = (
  value?: number | null,
  numberOfDigits: number = 0,
  nullValue: string = "0"
): string => `${formatNumberToString(value, numberOfDigits, nullValue)} €`;

export const formatPercentage = (
  value?: number | null,
  numberOfDigits: number = 0,
  nullValue: string = "0 %"
): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return nullValue;
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: numberOfDigits,
  }).format(value);
};

export const formatPercentageFixedDigits = (
  value?: number | null,
  numberOfDigits: number = 0,
  nullValue: string = "0 %"
): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return nullValue;
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: numberOfDigits,
    minimumFractionDigits: numberOfDigits,
  }).format(value);
};

export const formatPercentageWithoutSign = (
  value?: number,
  numberOfDigits: number = 0,
  nullValue: number = 0
): number => {
  if (value === undefined || value === null) return nullValue;
  return formatNumber(value * 100, numberOfDigits);
};

export const formatLargeNumber = (
  value?: number,
  thousandSeparator: string = "\u00A0",
  nullValue: string = "0"
): string => {
  if (value === undefined || value === null) return nullValue;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
};

export const formatDistance = (distance: number) => {
  return `${formatNumber(distance, 1)} km`;
};
