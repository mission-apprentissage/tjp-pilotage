import { chakra, Tag } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import React from "react";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

import { formatStatut } from "@/app/(wrapped)/intentions/utils/statutUtils";

const TagIcon = chakra(({ statut }: { statut: DemandeStatutType }) => {
  switch (statut) {
    case DemandeStatutEnum["refusée"]:
    case DemandeStatutEnum["dossier incomplet"]:
      return <Icon icon={"ri:close-circle-fill"} />;
    case DemandeStatutEnum["demande validée"]:
    case DemandeStatutEnum["dossier complet"]:
    case DemandeStatutEnum["prêt pour le vote"]:
      return <Icon icon={"ep:success-filled"} />;
    default:
      return <></>;
  }
});

export const StatutTag = chakra(
  ({
    statut,
    className,
    size = "sm",
    hasIcon = false,
  }: {
    statut: DemandeStatutType;
    className?: string;
    size?: "sm" | "md" | "lg";
    hasIcon?: boolean;
  }) => {
    const getColor = (statut: DemandeStatutType) => {
      switch (statut) {
        case DemandeStatutEnum["proposition"]:
          return "purpleGlycine.319";
        case DemandeStatutEnum["projet de demande"]:
          return "yellowTournesol.407";
        case DemandeStatutEnum["demande validée"]:
        case DemandeStatutEnum["dossier complet"]:
        case DemandeStatutEnum["prêt pour le vote"]:
          return "success.425";
        case DemandeStatutEnum["refusée"]:
        case DemandeStatutEnum["dossier incomplet"]:
          return "error.425";
        case DemandeStatutEnum["brouillon"]:
        default:
          return "grey.425";
      }
    };

    const getBgColor = (statut: DemandeStatutType) => {
      switch (statut) {
        case DemandeStatutEnum["proposition"]:
          return "purpleGlycine.950";
        case DemandeStatutEnum["projet de demande"]:
          return "yellowTournesol.950";
        case DemandeStatutEnum["demande validée"]:
        case DemandeStatutEnum["dossier complet"]:
        case DemandeStatutEnum["prêt pour le vote"]:
          return "success.950";
        case DemandeStatutEnum["refusée"]:
        case DemandeStatutEnum["dossier incomplet"]:
          return "error.950";
        case DemandeStatutEnum["brouillon"]:
        default:
          return "grey.925";
      }
    };

    return (
      <Tag
        className={className}
        size={size}
        color={getColor(statut)}
        bgColor={getBgColor(statut)}
      >
        {hasIcon && <TagIcon statut={statut} />}
        {formatStatut(statut)}
      </Tag>
    );
  }
);
