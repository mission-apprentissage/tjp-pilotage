import { chakra, Tag } from "@chakra-ui/react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

export const CampagneStatutTag = chakra(({ statut, className }: { statut?: string, className?: string }) => {
  switch (statut) {
  case CampagneStatutEnum["en cours"]:
    return (
      <Tag size="md" colorScheme={"green"} className={className}>
        {statut}
      </Tag>
    );
  case CampagneStatutEnum["en attente"]:
    return (
      <Tag size="md" colorScheme={"purple"} className={className}>
        {statut}
      </Tag>
    );
  case CampagneStatutEnum["terminée"]:
    return (
      <Tag size="md" colorScheme={"red"} className={className}>
        {statut}
      </Tag>
    );
  default:
    return <></>;
  }
});
