export type Scope = "national" | "region" | "user";
export type Role = keyof typeof PERMISSIONS;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyOfUnion<T> = T extends any ? keyof T : never;
export type Permission = KeyOfUnion<
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
>;

export const PERMISSIONS = {
  admin: {
    "pilotage_reforme/lecture": { default: "national" },
    "intentions/lecture": { default: "national", draft: "national" },
    "intentions/ecriture": { default: "national" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "users/lecture": {},
    "users/ecriture": {},
  },
  pilote: {
    "intentions/lecture": { default: "national", draft: "national" },
    "pilotage_reforme/lecture": { default: "national" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
  },
  pilote_region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions/ecriture": { default: "region" },
  },
  gestionnaire_region: {
    "intentions/lecture": { draft: "user", default: "region" },
    "intentions/ecriture": { default: "user" },
    "restitution-intentions/lecture": { default: "region" },
  },
  perdir: {
    "pilotage-intentions/lecture": { default: "national" },
  },
} satisfies {
  [R: string]: {
    [s: string]: Record<string | "defaultScope", Scope>;
  };
};
