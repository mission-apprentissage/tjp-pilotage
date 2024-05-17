import { CODES_REGIONS_EXPE, Permission, PERMISSIONS, Role } from "shared";

export const ROLES_LABELS: {
  [key in keyof typeof PERMISSIONS]: (filter?: string) => {
    label: string;
    description: string;
  };
} = {
  admin: () => ({
    label: "Super Admin",
    description: "Équipe Orion",
  }),
  pilote: () => ({
    label: "Pilote National",
    description:
      "Il se situe dans les administrations centrales ou dans un cabinet ministériel. Il a un rôle de pilotage et de supervision. Il a accès à toutes les demandes en consultation mais il ne peut ni modifier, ni émettre un avis. Il a un rôle de supervision, de pilotage. Il s’assure que les actions menées en région permettent d’atteindre les objectifs fixés par la réforme.",
  }),
  admin_region: () => ({
    label: "Admin RA",
    description:
      "Il se situe en académie. Il est chargé de mission ou conseiller à la formation. Il a un rôle opérationnel. Il a accès à tous les champs en saisie afin de pouvoir effectuer les saisies pour les différents acteurs si besoin.",
  }),
  gestionnaire_region: () => ({
    label: "Gestionnaire RA",
    description:
      "Il se situe en académie. Il est chargé de mission ou conseiller à la formation. Il a un rôle opérationnel. Il a accès à tous les champs en saisie afin de pouvoir effectuer les saisies pour les différents acteurs si besoin.",
  }),
  pilote_region: () => ({
    label: "Pilote RA",
    description:
      "Il a un rôle d’analyse et de décision. Il peut saisir des projets, valider les demandes. Il peut émettre un avis Pilote (dont avis obligatoire DRAFPIC et décision Recteur) ; il voit tous les avis déposés par les pilotes et les experts. Il a accès à la console de restitution et à la page de pilotage.",
  }),
  expert_region: () => ({
    label: "Expert RA",
    description:
      "Il a un rôle d'expertise et de conseil. Il peut consulter les propositions et projets émis sur toute la région académique, il peut émettre un avis Expert ; il voit tous les avis déposés par les experts uniquement. Il a accès à la console de restitution et à la page de pilotage.",
  }),
  perdir: (codeRegion) => {
    if (codeRegion && CODES_REGIONS_EXPE.includes(codeRegion)) {
      return {
        label: "Perdir RA Test",
        description: "PERDIR des régions AURA et Occitanie",
      };
    }

    return {
      label: "Perdir",
      description: "PERDIR",
    };
  },
  region: () => ({
    label: "Région",
    description:
      "Membres du Conseil régional, il a un rôle d'analyse et de décision. Il émet un avis préalable sur les propositions puis les sur les projets de demande. Il peut consulter les avis des Experts, l'avis du DRAFPIC et la décision du Recteur.",
  }),
};

export const PERMISSION_GROUP_LABELS: {
  [key: string]: string;
} = {
  pilotage_reforme: "Pilotage de la réforme",
  intentions: "Demandes",
  "restitution-intentions": "Restitution des demandes",
  "pilotage-intentions": "Pilotage des demandes",
  users: "Utilisateurs",
  campagnes: "Campagnes",
  "intentions-perdir": "Saisie par les perdirs",
};

export const OVERRIDES: {
  [key in Role]?: {
    [p in Permission]?: (filter?: string) => boolean;
  };
} = {
  perdir: {
    "intentions-perdir/ecriture": (codeRegion) => {
      if (codeRegion && CODES_REGIONS_EXPE.includes(codeRegion)) {
        return true;
      }

      return false;
    },
    "intentions-perdir/lecture": (codeRegion) => {
      if (codeRegion && CODES_REGIONS_EXPE.includes(codeRegion)) {
        return true;
      }

      return false;
    },
  },
};
