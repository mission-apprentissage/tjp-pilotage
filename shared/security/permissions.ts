export const roles = ["admin", "recteur"] as const;

export const permissions = ["console/formation", "panorama/region"] as const;

export const PERMISSIONS: {
  [R in typeof roles[number]]: { permissions: typeof permissions[number][] };
} = {
  admin: {
    permissions: ["panorama/region"],
  },
  recteur: {
    permissions: ["panorama/region"],
  },
};
