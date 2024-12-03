import { parse } from "csv-parse";
import { chain, isEmpty } from "lodash-es";

export const getStreamParser = () => {
  let lineNumber = 1;
  return parse({
    quote: "",
    trim: true,
    delimiter: ";",
    columns: true,
    on_record: (record) => {
      lineNumber++;
      return {
        line: chain(record)
          .mapKeys((_, key: string) => key.trim())
          .pickBy((value) => !isEmpty(value) && value.trim().length)
          .value(),
        lineNumber,
      };
    },
  });
};
