import { chakra } from "@chakra-ui/react";

import {
  isTypeColoration,
  isTypeFermeture,
} from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { Intention } from "../types";

export const CapaciteScolaireField = chakra(
  ({
    demande,
    disabled = false,
    className,
  }: {
    demande: Intention;
    disabled?: boolean;
    className?: string;
  }) => {
    const typeDemande = demande?.typeDemande;
    const fermeture = typeDemande !== undefined && isTypeFermeture(typeDemande);
    const coloration =
      typeDemande !== undefined && isTypeColoration(typeDemande);

    const isReadOnly = fermeture || coloration || disabled;

    return (
      <CapaciteField
        name={"capaciteScolaire"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
