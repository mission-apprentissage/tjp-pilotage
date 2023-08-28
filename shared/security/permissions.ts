export const roles = ["admin"] as const;

export const permissions = ["intentions/envoie"] as const;

export const PERMISSIONS: {
  [R in typeof roles[number]]: { permissions: typeof permissions[number][] };
} = {
  admin: {
    permissions: ["intentions/envoie"],
  },
};
