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

export async function downloadExcel<D extends object>(
  filename: string,
  data: D[],
  columns: ExportColumns<D>
) {
  const workbook = new Excel.Workbook();

  const worksheet = workbook.addWorksheet(filename);

  worksheet.columns = Object.entries(columns).map(([key, value]) => ({
    header: value as string,
    key,
  }));

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
    saveAs(blob, filename);
  });
}
