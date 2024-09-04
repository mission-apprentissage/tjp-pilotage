import { chakra } from "@chakra-ui/react";

import { isTypeOuverture } from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { Intention } from "../types";

export const CapaciteApprentissageActuelleField = chakra(
  ({ demande, className }: { demande: Intention; className?: string }) => {
    const typeDemande = demande?.typeDemande;
    const isReadOnly =
      typeDemande !== undefined && isTypeOuverture(typeDemande);

    return (
      <CapaciteField
        name={"capaciteApprentissageActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
