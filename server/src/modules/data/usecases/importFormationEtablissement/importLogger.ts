import fs from "fs";

import { Logs } from "./types/Logs";

let logs: Logs = [];

export const logger = {
  reset: () => (logs = []),
  log: (log: Logs[number]) => {
    // console.log(`log ${log.type} ${JSON.stringify(log.log, undefined, "")}`);
    logs.push(log);
  },
  write: () => {
    fs.writeFileSync("logs/uais", JSON.stringify(logs, undefined, " "));
  },
};
