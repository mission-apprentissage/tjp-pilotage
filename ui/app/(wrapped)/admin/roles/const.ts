import type { Role } from "shared";
import { CODES_REGIONS_EXPE_2024 } from "shared";
import type {Permission} from "shared/enum/permissionEnum";
import { PermissionEnum } from "shared/enum/permissionEnum";

export const ROLES_LABELS: Record<Role, (filter?: string) => {
    label: string;
    description: string;
  }> = {
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
      "Il se situe en Région académique. Il est chargé de mission auprès du DRAFPIC et a une très bonne connaissance des acteurs de la carte, ce qui lui permet de pouvoir administrer les différents niveaux de permission dans Orion. Il a les mêmes permissions qu'un gestionnaire pour ce qui concerne la gestion des demandes.",
    }),
    gestionnaire_region: () => ({
      label: "Gestionnaire RA",
      description:
      "Il se situe en académie. Il est chargé de mission ou conseiller à la formation. Il a un rôle opérationnel. Il a accès à tous les champs en saisie afin de pouvoir effectuer les saisies pour les différents acteurs si besoin.",
    }),
    pilote_region: () => ({
      label: "Pilote RA",
      description:
      "Il a un rôle d’analyse et de décision. Il peut saisir des projets, valider les demandes. Il a accès à la console de restitution et à la page de pilotage. En région Occitanie et AURA : il peut émettre un avis Pilote (dont avis obligatoire DRAFPIC et décision Recteur) ; il voit tous les avis déposés par les pilotes et les experts.",
    }),
    expert_region: () => ({
      label: "Expert RA",
      description:
      "Il a un rôle d'expertise et de conseil. Il peut consulter les propositions et projets émis sur toute la région académique, il a accès à la console de restitution et à la page de pilotage. En région Occitanie et AURA il peut émettre un avis Expert ; il voit tous les avis déposés par les experts uniquement et les avis pilotes rendus publics.",
    }),
    perdir: (codeRegion) => {
      if (codeRegion && CODES_REGIONS_EXPE_2024.includes(codeRegion)) {
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
      "Membre du conseil régional en Occitanie ou AURA il a un rôle d'analyse et de décision. Il émet un avis préalable sur les propositions puis sur les projets de demande. Il peut consulter les avis des Experts, l'avis du DRAFPIC et la décision du Recteur.",
    }),
    invite: () => ({
      label: "Invité",
      description:
      "Il a un rôle dans la formation professionnelle initiale, en région ou en académie (membre du conseil régional, directeur de CMQ…). Il peut visualiser les demandes validées ou refusées.",
    }),
  };

export const PERMISSION_GROUP_LABELS: {
  [key: string]: string;
} = {
  "enregistrement-requete": "Enregistrement de requêtes",
  pilotage_reforme: "Pilotage de la réforme",
  intentions: "Demandes",
  "restitution-intentions": "Restitution des demandes",
  "pilotage-intentions": "Pilotage des demandes",
  users: "Utilisateurs",
  campagnes: "Campagnes",
  "intentions-perdir": "Saisie par les perdirs",
  "intentions-perdir-avis": "Avis sur les intentions",
  "intentions-perdir-statut": "Changement de statut sur les intentions",
};

export const OVERRIDES:
Partial<
  Record<
    Role,
    Partial<Record<Permission, (filter?: string) => boolean>>
  >
> = {
  perdir: {
    [PermissionEnum["intentions-perdir/ecriture"]]: (codeRegion) => {
      if (codeRegion && CODES_REGIONS_EXPE_2024.includes(codeRegion)) {
        return true;
      }

      return false;
    },
    [PermissionEnum["intentions-perdir/lecture"]]: (codeRegion) => {
      if (codeRegion && CODES_REGIONS_EXPE_2024.includes(codeRegion)) {
        return true;
      }

      return false;
    },
  },
};
