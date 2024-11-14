import fs from "node:fs";

import { logspath } from "@/basepath";
import { __dirname } from "@/utils/esmUtils";

type Logs = string[];
let logsReg: Logs = [];
let logsUai: Logs = [];

export const logResolve = (url: string) => {
  if (url === "/login") return;
  const type = url.split("/")[1];
  const code = url.split("/")[2];
  const millesime = url.split("/")[4];
  const date = new Date().toLocaleString();

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  type === "UAI"
    ? loggerUai.log(`${date};${code};${millesime};OK;200;`)
    : loggerReg.log(`${date};${code};${millesime};OK;200;`);
};

export const logError = (
  response: {
    status?: number;
    data?: {
      msg?: string;
      message?: string;
    };
  },
  url: string
) => {
  const type = url.split("/")[1];
  const code = url.split("/")[2];
  const millesime = url.split("/")[4];
  const date = new Date().toLocaleString();
  if (code === "500") console.log(response);

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  type === "UAI"
    ? loggerUai.log(
        `${date};${code};${millesime};NOK;${response.status};${response.data?.msg ?? response.data?.message}`
      )
    : loggerReg.log(
        `${date};${code};${millesime};NOK;${response.status};${response.data?.msg ?? response.data?.message}`
      );
};

export const loggerReg = {
  set: () => fs.writeFileSync(`${logspath}/reg.csv`, "time;codeRegion;millesimes;OK/NOK;status;details\n"),
  reset: () => {
    logsReg = [];
  },
  log: (log: Logs[number]) => {
    logsReg.push(log);
  },
  write: () => {
    fs.appendFileSync(`${logspath}/reg.csv`, logsReg.join("\n").concat("\r\n"));
  },
};

export const loggerUai = {
  set: () => fs.writeFileSync(`${logspath}/uai.csv`, "time;uai;millesimes;OK/NOK;status;details\n"),
  reset: () => {
    logsUai = [];
  },
  log: (log: Logs[number]) => {
    logsUai.push(log);
  },
  write: () => {
    fs.appendFileSync(`${logspath}/uai.csv`, logsUai.join("\n").concat("\r\n"));
  },
};
