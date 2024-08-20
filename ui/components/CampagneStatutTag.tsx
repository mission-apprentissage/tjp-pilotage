import { Tag } from "@chakra-ui/react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

export const CampagneStatutTag = ({ statut }: { statut?: string }) => {
  switch (statut) {
    case CampagneStatutEnum["en cours"]:
      return (
        <Tag size="md" colorScheme={"green"} ml={2}>
          {statut}
        </Tag>
      );
    case CampagneStatutEnum["en attente"]:
      return (
        <Tag size="md" colorScheme={"purple"} ml={2}>
          {statut}
        </Tag>
      );
    case CampagneStatutEnum["terminée"]:
      return (
        <Tag size="md" colorScheme={"red"} ml={2}>
          {statut}
        </Tag>
      );
    default:
      return <></>;
  }
};
