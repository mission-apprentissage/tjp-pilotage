import { Parser } from "@json2csv/plainjs";

export function downloadCsv<D>(
  filename: string,
  data: D[],
  columns: { [K in keyof D]?: string }
) {
  const parser = new Parser({
    fields: Object.entries(columns).map(([value, label]) => ({
      label: label as string,
      value,
    })),
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
