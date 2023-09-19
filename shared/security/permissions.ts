export const roles = ["admin", "pilote", "gestionnaire"] as const;

export type Role = typeof roles[number];

export const permissions = [
  "pilotage_reforme/lecture",
  "intentions/envoi",
  "intentions/lecture",
] as const;

export const PERMISSIONS: {
  [R in typeof roles[number]]: { permissions: typeof permissions[number][] };
} = {
  admin: {
    permissions: ["pilotage_reforme/lecture", "intentions/envoi"],
  },
  pilote: {
    permissions: ["pilotage_reforme/lecture"],
  },
  gestionnaire: { permissions: ["intentions/envoi", "intentions/lecture"] },
};
