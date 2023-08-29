export const roles = ["admin", "pilote"] as const;

export const permissions = [
  "pilotage_reforme/lecture",
  "intentions/envoi",
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
};
