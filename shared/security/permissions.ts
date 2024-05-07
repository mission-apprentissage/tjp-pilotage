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
    "users/lecture": { default: "national" },
    "users/ecriture": { default: "national" },
    "campagnes/lecture": { default: "national" },
    "campagnes/ecriture": { default: "national" },
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
  admin_region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions/ecriture": { default: "region" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
    "intentions-perdir/ecriture": { default: "region" },
    "users/lecture": { default: "region" },
    "users/ecriture": { default: "region" },
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
  expert_region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
  },
  perdir: {
    "intentions-perdir/lecture": { draft: "uai", default: "region" },
    "intentions-perdir/ecriture": { default: "uai" },
    "restitution-intentions/lecture": { default: "uai" },
    "pilotage-intentions/lecture": { default: "uai" },
  },
} satisfies {
  [R: string]: {
    [s: string]: Record<string, Scope>;
  };
};

export const HIERARCHY: {
  [key in Role]: {
    sub: Array<Role>;
    scope: Scope;
  };
} = {
  admin: {
    sub: Object.keys(PERMISSIONS) as Array<Role>,
    scope: "national",
  },
  pilote: {
    sub: [],
    scope: "national",
  },
  admin_region: {
    sub: ["gestionnaire_region", "pilote_region", "expert_region"],
    scope: "region",
  },
  pilote_region: {
    sub: [],
    scope: "region",
  },
  gestionnaire_region: {
    sub: [],
    scope: "region",
  },
  expert_region: {
    sub: [],
    scope: "region",
  },
  perdir: {
    sub: [],
    scope: "uai",
  },
};
