import type { Role } from "shared";

export const castRole = (role?: string | null): Role => {
  return role as Role;
};
