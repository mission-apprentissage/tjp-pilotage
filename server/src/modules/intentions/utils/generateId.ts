import * as uuid from "uuid";

export const generateId = () =>
  uuid.v4().replace(/-/g, "").slice(0, 8).toUpperCase();
