import he from "he";

const { encode, decode } = he;

export function escapeString(string: string | undefined) {
  if (typeof string === "undefined") {
    return undefined;
  }

  return encode(string);
}

export function unEscapeString(string: string | undefined) {
  if (typeof string === "undefined") {
    return undefined;
  }

  return decode(string);
}
