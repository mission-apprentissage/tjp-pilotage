export type Scope = "national" | "region" | "uai" | "user";
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
    "campagnes/lecture": {},
    "campagnes/ecriture": {},
    "intentions-perdir/lecture": { default: "national" },
    "intentions-perdir/ecriture": { default: "national" },
  },
  pilote: {
    "intentions/lecture": { default: "national", draft: "national" },
    "pilotage_reforme/lecture": { default: "national" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "national", draft: "national" },
    "intentions-perdir/ecriture": { default: "national" },
  },
  pilote_region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions/ecriture": { default: "region" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
    "intentions-perdir/ecriture": { default: "region" },
  },
  gestionnaire_region: {
    "intentions/lecture": { draft: "user", default: "region" },
    "intentions/ecriture": { default: "user" },
    "restitution-intentions/lecture": { default: "region" },
    "intentions-perdir/lecture": { default: "region" },
    "intentions-perdir/ecriture": { default: "region" },
  },
  perdir: {
    "intentions-perdir/lecture": { draft: "uai", default: "uai" },
    "intentions-perdir/ecriture": { default: "uai" },
    "restitution-intentions/lecture": { default: "uai" },
  },
} satisfies {
  [R: string]: {
    [s: string]: Record<string | "defaultScope", Scope>;
  };
};
