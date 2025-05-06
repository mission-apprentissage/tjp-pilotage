import { chakra, Tag } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { formatStatut } from "@/app/(wrapped)/demandes/utils/statutUtils";

const TagIcon = chakra(({ statut }: { statut: DemandeStatutType }) => {
  switch (statut) {
  case DemandeStatutEnum["refusée"]:
  case DemandeStatutEnum["dossier incomplet"]:
    return <Icon icon={"ri:close-circle-fill"} />;
  case DemandeStatutEnum["demande validée"]:
  case DemandeStatutEnum["dossier complet"]:
  case DemandeStatutEnum["prêt pour le vote"]:
    return <Icon icon={"ep:success-filled"} />;
  case DemandeStatutEnum["brouillon"]:
  case DemandeStatutEnum["proposition"]:
  case DemandeStatutEnum["projet de demande"]:
  case DemandeStatutEnum["supprimée"]:
  default:
    return <></>;
  }
});


export const getStatutColor = (statut: DemandeStatutType) => {
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
  case DemandeStatutEnum["supprimée"]:
  default:
    return "grey.425";
  }
};

export const getStatutBgColor = (statut: DemandeStatutType) => {
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
  case DemandeStatutEnum["supprimée"]:
  default:
    return "grey.925";
  }
};

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

    return (
      <Tag className={className} size={size} color={getStatutColor(statut)} bgColor={getStatutBgColor(statut)}>
        {hasIcon && <TagIcon statut={statut} />}
        {formatStatut(statut)}
      </Tag>
    );
  }
);
