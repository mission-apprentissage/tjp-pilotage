import _ from "lodash";
export const formatDate = ({
  date,
  options,
  dateTimeSeparator,
}: {
  date?: string;
  options?: {
    dateStyle?: "short" | "medium" | "long" | "full";
    timeStyle?: "short" | "medium" | "long" | "full";
  };
  dateTimeSeparator?: string;
}) => {
  if (!date) return "";
  if (!dateTimeSeparator)
    return new Date(date).toLocaleString("fr-FR", options);
  const [datePart, timePart] = new Date(date)
    .toLocaleString("fr-FR", options)
    .split(" ");
  return `${datePart}${dateTimeSeparator}${timePart ?? ""}`;
};

export const formatBoolean = (value?: boolean) => {
  if (value) return "Oui";
  return "Non";
};

export const formatArray = (
  values?: Array<string | number | undefined>,
  capitalize: boolean = false
): string => {
  if (!values) return "Aucun(e)";
  if (capitalize) {
    if (values.length === 1 && values[0])
      return _.capitalize(values[0].toString());
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
  numberOfDigits: number = 0
): number => {
  if (!value) return 0;
  return Number.parseFloat(value.toFixed(numberOfDigits));
};

export const formatPercentage = (
  value?: number,
  numberOfDigits: number = 0
): string => {
  if (!value) return "0 %";
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: numberOfDigits,
  }).format(value);
};
