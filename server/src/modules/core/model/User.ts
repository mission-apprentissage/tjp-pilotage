import type { Role } from "shared";

export type RequestUser = {
  email: string;
  id: string;
  role?: Role;
  codeRegion?: string;
  uais?: string[];
};
