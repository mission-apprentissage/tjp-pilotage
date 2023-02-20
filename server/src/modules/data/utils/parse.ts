import { parse } from "csv-parse";
import _, { isEmpty } from "lodash";
export const getStreamParser = () => {
  return parse({
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
};
