import { number as numberFormatter } from "@json2csv/formatters";
import { Parser } from "@json2csv/plainjs";

export type ExportColumns<T extends object> = {
  [K in keyof T as T[K] extends string | string[] | number | boolean | undefined
    ? K
    : T[K] extends
        | {
            [Te in infer K2]?: string | string[] | number | boolean | undefined;
          }
        | undefined
    ? `${Exclude<K, symbol>}.${Exclude<K2, symbol>}`
    : never]?: string;
};

export function downloadCsv<D extends object>(
  filename: string,
  data: D[],
  columns: ExportColumns<D>
) {
  const parser = new Parser({
    fields: Object.entries(columns).map(([value, label]) => ({
      label: label as string,
      value: value,
    })),
    formatters: {
      number: numberFormatter({
        separator: ",",
      }),
    },
    delimiter: ";",
  });
  const csv = parser.parse(data);
  download(filename, csv);
}

function download(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
