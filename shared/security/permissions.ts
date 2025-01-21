export type Scope = "national" | "region" | "uai" | "user" | "role";
export type Role = keyof typeof PERMISSIONS;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyOfUnion<T> = T extends any ? keyof T : never;
export type Permission = KeyOfUnion<(typeof PERMISSIONS)[keyof typeof PERMISSIONS]>;

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
    "intentions-perdir/lecture": { default: "national", draft: "national" },
    "intentions-perdir/ecriture": { default: "national", draft: "national" },
    "intentions-perdir-statut/ecriture": { default: "national" },
    "intentions-perdir-statut/lecture": { default: "national" },
    "intentions-perdir-avis/ecriture": { default: "national" },
    "intentions-perdir-avis/lecture": { default: "national" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  pilote: {
    "intentions/lecture": { default: "national", draft: "national" },
    "pilotage_reforme/lecture": { default: "national" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "national", draft: "national" },
    "intentions-perdir-statut/lecture": { default: "national" },
    "intentions-perdir-avis/lecture": { default: "national" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  admin_region: {
    "intentions/lecture": { default: "national", draft: "national" },
    "intentions/ecriture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
    "intentions-perdir/ecriture": { default: "region" },
    "users/lecture": { default: "region" },
    "users/ecriture": { default: "region" },
    "intentions-perdir-statut/ecriture": { default: "region" },
    "intentions-perdir-statut/lecture": { default: "region" },
    "intentions-perdir-avis/ecriture": { default: "region" },
    "intentions-perdir-avis/lecture": { default: "region" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "region" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
    "intentions-perdir-statut/lecture": { default: "region" },
    "intentions-perdir-avis/ecriture": { default: "region" },
    "intentions-perdir-avis/lecture": { default: "region" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  pilote_region: {
    "intentions/lecture": { default: "national", draft: "national" },
    "intentions/ecriture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "national" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "national", draft: "national" },
    "intentions-perdir/ecriture": { default: "region" },
    "intentions-perdir-statut/ecriture": { default: "region" },
    "intentions-perdir-statut/lecture": { default: "region" },
    "intentions-perdir-avis/ecriture": { default: "region" },
    "intentions-perdir-avis/lecture": { default: "region" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  gestionnaire_region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "intentions/ecriture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "region" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
    "intentions-perdir/ecriture": { default: "region" },
    "intentions-perdir-statut/ecriture": { default: "region" },
    "intentions-perdir-statut/lecture": { default: "region" },
    "intentions-perdir-avis/ecriture": { default: "region" },
    "intentions-perdir-avis/lecture": { default: "region" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  expert_region: {
    "intentions/lecture": { default: "region", draft: "region" },
    "restitution-intentions/lecture": { default: "region" },
    "pilotage-intentions/lecture": { default: "national" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
    "intentions-perdir-statut/lecture": { default: "region" },
    "intentions-perdir-avis/ecriture": { default: "region" },
    "intentions-perdir-avis/lecture": { default: "region" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  perdir: {
    "intentions/lecture": { default: "uai", draft: "uai" },
    "intentions-perdir/lecture": { default: "uai", draft: "uai" },
    "intentions-perdir/ecriture": { default: "uai", draft: "uai" },
    "restitution-intentions/lecture": { default: "uai" },
    "pilotage-intentions/lecture": { default: "uai" },
    "intentions-perdir-statut/lecture": { default: "uai" },
    "intentions-perdir-avis/lecture": { default: "uai" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
  invite: {
    "intentions/lecture": { default: "role", draft: "role" },
    "restitution-intentions/lecture": { default: "role" },
    "intentions-perdir/lecture": { default: "region", draft: "region" },
    "intentions-perdir-statut/lecture": { default: "region" },
    "intentions-perdir-avis/lecture": { default: "region" },
    "enregistrement-requete/lecture": { default: "national" },
    "enregistrement-requete/ecriture": { default: "national" },
  },
} satisfies {
  [R: string]: {
    [s: string]: Record<string, Scope>;
  };
};

export enum RoleEnum {
  admin = "admin",
  pilote = "pilote",
  admin_region = "admin_region",
  region = "region",
  pilote_region = "pilote_region",
  gestionnaire_region = "gestionnaire_region",
  expert_region = "expert_region",
  perdir = "perdir",
  invite = "invite",
}

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
    sub: ["gestionnaire_region", "pilote_region", "expert_region", "region", "invite"],
    scope: "region",
  },
  region: {
    sub: [],
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
  invite: {
    sub: [],
    scope: "region",
  },
};
