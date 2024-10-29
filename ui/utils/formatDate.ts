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
  if (!dateTimeSeparator) return new Date(date).toLocaleString("fr-FR", options);
  const [datePart, timePart] = new Date(date).toLocaleString("fr-FR", options).split(" ");
  return `${datePart}${dateTimeSeparator}${timePart ?? ""}`;
};
