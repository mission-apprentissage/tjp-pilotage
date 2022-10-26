import { parse as parseUrl } from "url"; // eslint-disable-line node/no-deprecated-api
import https from "https";
import oleoduc from "oleoduc";
import { logger } from "../logger.js";
import config from "../../config.js";
import { COOKIE_NAME } from "../constants/cookieName.js";

const IS_OFFLINE = Boolean(config.isOffline);

export async function createRequestStream(url, httpOptions = {}) {
  return new Promise((resolve, reject) => {
    let options = {
      ...parseUrl(url),
      method: "GET",
      ...httpOptions,
    };

    logger.info(`Send http request [${options.method}] ${url}...`);
    let req = https.request(options, (res) => {
      if (res.statusCode >= 400) {
        reject(new Error(`Unable to get ${url}. Status code ${res.statusCode}`));
      }

      resolve(res);
    });
    req.end();
  });
}

export function createUploadStream(url, httpOptions = {}) {
  let options = {
    ...parseUrl(url),
    method: "PUT",
    ...httpOptions,
  };

  logger.info(`Uploading ${url}...`);
  return https.request(options);
}

export function responseWithCookie({ res, token }) {
  return res.cookie(COOKIE_NAME, token, {
    maxAge: 30 * 24 * 3600000,
    httpOnly: !IS_OFFLINE,
    sameSite: "lax",
    secure: !IS_OFFLINE,
  });
}

export function sendHTML(html, res) {
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(html));
}

export function sendJsonStream(stream, res) {
  res.setHeader("Content-Type", "application/json");
  oleoduc(stream, res);
}
