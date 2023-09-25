export type Scope = "national" | "region" | "user";
export type Role = keyof typeof PERMISSIONS;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyOfUnion<T> = T extends any ? keyof T : never;
export type Permission = KeyOfUnion<
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
>;

export const PERMISSIONS = {
  pilote: {},
  pilote_national: {
    "intentions/lecture": { default: "national", draft: "national" },
    "pilotage_reforme/lecture": { default: "national" },
  },
  expert_region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "intentions/suppression": { default: "region" },
    "intentions/envoi": { default: "region" },
  },
  pilote_region: {
    "intentions/lecture": { default: "region", draft: "region" },
  },
  gestionnaire: {
    "intentions/lecture": { draft: "user", default: "region" },
    "intentions/suppression": { default: "user" },
    "intentions/envoi": { default: "user" },
  },
  gestionnaire_region: {
    "intentions/lecture": { draft: "user", default: "region" },
    "intentions/suppression": { default: "user" },
    "intentions/envoi": { default: "user" },
  },
  admin: {
    "pilotage_reforme/lecture": { default: "national" },
    "intentions/lecture": { default: "national", draft: "national" },
    "intentions/suppression": { default: "national" },
    "intentions/envoi": { default: "national" },
  },
} satisfies {
  [R: string]: {
    [s: string]: Record<string | "defaultScope", Scope>;
  };
};
