import { z } from "zod";

import type { Role } from "../enum/roleEnum";

const roleDNEZodType = z.enum([
  "DRAFPIC",
  "DRAFPIC_ETUDE",
  "DRAIO",
  "SGASGRA",
  "DOS",
  "SSA",
  "RDSI",
  "CFP",
  "CMQ",
  "DGESCO",
  "IGESR",
  "RECTEUR",
  "INS",
  "DASEN",
  "PERDIR"
]);
export const RoleDNEEnum = roleDNEZodType.Enum;
export type RoleDNE = z.infer<typeof roleDNEZodType>;

export const supportedLDAPGroupsZodType = z.enum([
  "GRP_ORIONIJ_DRAFPIC",
  "GRP_ORIONIJ_DRAFPIC_ETUDE",
  "GRP_ORIONIJ_DRAIO",
  "GRP_ORIONIJ_SGASGRA",
  "GRP_ORIONIJ_DOS",
  "GRP_ORIONIJ_SSA",
  "GRP_ORIONIJ_RDSI",
  "GRP_ORIONIJ_CFP",
  "GRP_ORIONIJ_CMQ",
  "GRP_ORIONIJ_DGESCO",
  "GRP_ORIONIJ_IGESR",
  "GRP_ORIONIJ_RECTEUR"
]);

export const supportedLDAPGroupsEnum = supportedLDAPGroupsZodType.Enum;
export type SupportedLDAPGroups = z.infer<typeof supportedLDAPGroupsZodType>;

export const LDAP_GROUP_ROLES_DNE_CORRESPONDANCE: Record<SupportedLDAPGroups, RoleDNE> = {
  "GRP_ORIONIJ_DRAFPIC": "DRAFPIC",
  "GRP_ORIONIJ_DRAFPIC_ETUDE": "DRAFPIC_ETUDE",
  "GRP_ORIONIJ_DRAIO": "DRAIO",
  "GRP_ORIONIJ_SGASGRA": "SGASGRA",
  "GRP_ORIONIJ_DOS": "DOS",
  "GRP_ORIONIJ_SSA": "SSA",
  "GRP_ORIONIJ_RDSI": "RDSI",
  "GRP_ORIONIJ_CFP": "CFP",
  "GRP_ORIONIJ_CMQ": "CMQ",
  "GRP_ORIONIJ_DGESCO": "DGESCO",
  "GRP_ORIONIJ_IGESR": "IGESR",
  "GRP_ORIONIJ_RECTEUR": "RECTEUR",
};

export const ROLE_DNE_ROLE_ORION_CORRESPONDANCE: Record<RoleDNE, Role> = {
  DRAFPIC: "pilote_region",
  DRAFPIC_ETUDE: "gestionnaire_region",
  DRAIO: "expert_region",
  SGASGRA: "pilote_region",
  DOS: "invite",
  SSA: "invite",
  RDSI: "invite",
  CFP: "invite",
  CMQ: "invite",
  DGESCO: "admin",
  IGESR:"pilote",
  INS: "expert_region",
  PERDIR: "perdir",
  // ???
  RECTEUR: "invite",
  DASEN: "invite",
};
