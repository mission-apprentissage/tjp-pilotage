import { parse } from "csv-parse/sync";
import _, { isEmpty } from "lodash";
export const parseSync = (content: string) =>
  parse(content, {
    quote: "",
    trim: true,
    delimiter: ";",
    columns: true,
    on_record: (record) =>
      _.chain(record)
        .mapKeys((_, key: string) => key.trim())
        .pickBy((value) => !isEmpty(value) && value.trim().length)
        .value(),
  });
