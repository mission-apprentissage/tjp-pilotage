import { number as numberFormatter } from "@json2csv/formatters";
import { Parser } from "@json2csv/plainjs";
// eslint-disable-next-line import/no-extraneous-dependencies, import/default
import type { Worksheet } from "exceljs";
// eslint-disable-next-line import/no-extraneous-dependencies, import/default
import { Workbook } from "exceljs";
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from "file-saver";
import _ from "lodash";

const setColumnWrapText = ({
  worksheet,
  columnName
}: {
  worksheet: Worksheet;
  columnName: string
}) => {
  worksheet.getColumn(columnName).eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { wrapText: true };
  });
};

const setColumnWrapNumber = ({
  worksheet,
  columnName
}: {
  worksheet: Worksheet;
  columnName: string
}) => {
  worksheet.getColumn(columnName).numFmt = "#,##0.00";
};

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

export type MultipleData = Record<string, Array<object>>;
export type MultipleColumns = Record<string, ExportColumns<object>>;

/**
 *
 * @param filename filename with or without extension
 * @param data rows of the csv
 * @param columns headers of the csv
 */
export function downloadCsv<D extends object>(filename: string, data: Array<D>, columns: ExportColumns<D>) {
  const filenameWithExtension = filename.indexOf(".csv") !== -1 ? filename : `${filename}.csv`;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const objectFormatter = (value: any) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return "";
      return value.join(", ");
    }
    return value.toString();
  };

  const parser = new Parser({
    fields: Object.entries(columns).map(([value, label]) => ({
      label: label as string,
      value: value,
    })),
    formatters: {
      string: (str: string) => `"${str.replace(/"/g, '\\"').replace(/(\r\n|\r|\n)/g, " ")}"`,
      number: numberFormatter({
        separator: ",",
        decimals: 2,
      }),
      object: objectFormatter,
      undefined: () => "",
    },
    delimiter: ";",
  });
  const csv = parser.parse(data);
  downloadCsvFromString(filenameWithExtension, csv);
}

const downloadCsvFromString = (filename: string, text: string) => {
  const element = document.createElement("a");
  const universalBOM = "\uFEFF";
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(universalBOM + text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export async function downloadExcel<D extends object>(
  filename: string,
  data: Array<D> | MultipleData,
  columns: ExportColumns<D> | MultipleColumns
) {
  const hasMultipleSheets = Object.values(data).every((value) => Array.isArray(value));
  if (hasMultipleSheets) {
    downloadExcelMultipleSheets(
      filename,
      data as Record<string, Array<D>>,
      columns as Record<string, ExportColumns<D>>
    );
  } else if (Array.isArray(data)) {
    const filenameWithExtension = filename.indexOf(".xlsx") !== -1 ? filename : `${filename}.xlsx`;

    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet(filename);

    worksheet.columns = Object.entries(columns).map(([key, value]) => ({
      header: value as string,
      key,
    }));

    Object.entries(columns).forEach(([key, _value]) => {
      switch (typeof _.get(data[0], key)) {
      case "string":
        setColumnWrapText({worksheet, columnName: key});
        break;
      case "number":
        setColumnWrapNumber({worksheet, columnName: key});
        break;
      case "bigint":
      case "boolean":
      case "symbol":
      case "undefined":
      case "object":
      case "function":
      default:
        setColumnWrapText({worksheet, columnName: key});
        break;
      }
    });

    for (const dataRow of data) {
      worksheet.addRow(
        Object.keys(columns).reduce(
          (acc, key) => {
            acc[key as keyof D] = _.get(dataRow, key);
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
    return;
  }
}

function downloadExcelMultipleSheets<D extends object>(
  filename: string,
  data: Record<string, Array<D>>,
  columns: Record<string, ExportColumns<D>>
) {
  const filenameWithExtension = filename.indexOf(".xlsx") !== -1 ? filename : `${filename}.xlsx`;

  const workbook = new Workbook();

  Object.entries(data).forEach(([key, sheetData]) => {
    const worksheet = workbook.addWorksheet(`${key}`);

    worksheet.columns = Object.entries(columns[key]).map(([key, value]) => ({
      header: value as string,
      key,
    }));

    Object.entries(columns[key]).forEach(([key, _value]) => {
      switch (typeof _.get(sheetData[0], key)) {
      case "string":
        setColumnWrapText({worksheet, columnName: key});
        break;
      case "number":
        setColumnWrapNumber({worksheet, columnName: key});
        break;
      case "bigint":
      case "boolean":
      case "symbol":
      case "undefined":
      case "object":
      case "function":
      default:
        setColumnWrapText({worksheet, columnName: key});
        break;
      }
    });

    for (const dataRow of sheetData) {
      worksheet.addRow(
        Object.keys(columns[key]).reduce(
          (acc, key) => {
            acc[key as keyof D] = _.get(dataRow, key);
            return acc;
          },
          {} as Record<keyof D, D[keyof D]>
        )
      );
    }
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filenameWithExtension);
  });
}
