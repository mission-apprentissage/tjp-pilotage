import { number as numberFormatter } from "@json2csv/formatters";
import { Parser } from "@json2csv/plainjs";
import Excel from "exceljs";
import { saveAs } from "file-saver";

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

/**
 *
 * @param filename filename with or without extension
 * @param data rows of the csv
 * @param columns headers of the csv
 */
export function downloadCsv<D extends object>(
  filename: string,
  data: D[],
  columns: ExportColumns<D>
) {
  const filenameWithExtension =
    filename.indexOf(".csv") !== -1 ? filename : `${filename}.csv`;
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
  downloadCsvFromString(filenameWithExtension, csv);
}

function downloadCsvFromString(filename: string, text: string) {
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

export async function downloadExcel<D extends object>(
  filename: string,
  data: D[],
  columns: ExportColumns<D>
) {
  const filenameWithExtension =
    filename.indexOf(".xlsx") !== -1 ? filename : `${filename}.xlsx`;

  const workbook = new Excel.Workbook();

  const worksheet = workbook.addWorksheet(filename);

  worksheet.columns = Object.entries(columns).map(([key, value]) => ({
    header: value as string,
    key,
  }));

  const setColumnWrapText = (columnName: string) => {
    worksheet.getColumn(columnName).eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { wrapText: true };
    });
  };

  const setColumnWrapNumber = (columnName: string) => {
    worksheet.getColumn(columnName).numFmt = "#,##0.00";
  };

  Object.entries(columns).forEach(([key, _value]) => {
    switch (typeof data[0][key as keyof D]) {
      case "string":
        setColumnWrapText(key);
        break;
      case "number":
        setColumnWrapNumber(key);
        break;
      default:
        break;
    }
  });

  for (const dataRow of data) {
    worksheet.addRow(
      Object.keys(columns).reduce(
        (acc, key) => {
          acc[key as keyof D] = dataRow[key as keyof D];
          return acc;
        },
        {} as Record<keyof D, D[keyof D]>
      )
    );
  }

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filenameWithExtension);
  });
}
