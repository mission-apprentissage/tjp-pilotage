import * as he from "he";

export function escapeString(string: string | undefined) {
  if (typeof string === "undefined") {
    return undefined;
  }

  return he.encode(string);
}

export function unEscapeString(string: string | undefined) {
  if (typeof string === "undefined") {
    return undefined;
  }

  return he.decode(string);
}
