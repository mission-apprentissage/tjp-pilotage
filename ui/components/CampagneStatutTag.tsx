import { Tag } from "@chakra-ui/react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

export const CampagneStatutTag = ({ statut }: { statut?: string }) => {
  switch (statut) {
  case CampagneStatutEnum["en cours"]:
    return (
      <Tag size="md" colorScheme={"green"}>
        {statut}
      </Tag>
    );
  case CampagneStatutEnum["en attente"]:
    return (
      <Tag size="md" colorScheme={"purple"}>
        {statut}
      </Tag>
    );
  case CampagneStatutEnum["terminée"]:
    return (
      <Tag size="md" colorScheme={"red"}>
        {statut}
      </Tag>
    );
  default:
    return <></>;
  }
};
