import { format } from "date-fns";

export const formatExportFilename = (filename: string, suffixs?: string[]) => {
  const timestamp = format(new Date(), "yyyyMMddHHmmss");
  const suffix = suffixs ? `_${suffixs.join("_")}` : "";
  return `${filename}${suffix}_${timestamp}`;
};
