import type { Role } from "shared";
import type { UserFonction } from "shared/enum/userFonctionEnum";

export type RequestUser = {
  email: string;
  id: string;
  role?: Role;
  codeRegion?: string;
  uais?: string[];
  fonction?: UserFonction;
};
