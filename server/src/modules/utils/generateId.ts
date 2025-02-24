import { v4 as uuidv4 } from "uuid";

export const generateId = () => uuidv4().replace(/-/g, "");

export const generateShortId = () => uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase();
