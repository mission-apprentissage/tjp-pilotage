import { format } from "date-fns";

const formatSuffixs = (suffixs: string[] | Record<string, string | Array<string> | boolean | number>) => {
  if (Array.isArray(suffixs)) return suffixs.join("_");
  return Object.entries(suffixs)
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}=(${value.join(",")})`;
      return `${key}=${value}`;
    })
    .join("_");
};

export const formatExportFilename = (
  filename: string,
  suffixs?: string[] | Record<string, string | Array<string> | boolean | number>,
) => {
  const timestamp = format(new Date(), "yyyyMMddHHmmss");
  const suffix = suffixs ? `_${formatSuffixs(suffixs)}` : "";
  return `${filename}${suffix}_${timestamp}`;
};
