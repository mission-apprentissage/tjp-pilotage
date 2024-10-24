import { chakra } from "@chakra-ui/react";
import { isTypeFermeture } from "shared/validators/demandeValidators";

import { isTypeColoration } from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { Intention } from "../types";

export const CapaciteApprentissageColoreeField = chakra(
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
      typeDemande !== undefined &&
      (isTypeColoration(typeDemande) || demande?.coloration);
    const isReadOnly = fermeture || !coloration || disabled;

    if (!coloration) return <></>;
    if (fermeture) return <></>;

    return (
      <CapaciteField
        name={"capaciteApprentissageColoree"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
