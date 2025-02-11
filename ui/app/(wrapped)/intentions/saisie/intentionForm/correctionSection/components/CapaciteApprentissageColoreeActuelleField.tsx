import { chakra } from "@chakra-ui/react";
import { isTypeColoration, isTypeOuverture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type { Demande } from "@/app/(wrapped)/intentions/saisie/types";

export const CapaciteApprentissageColoreeActuelleField = chakra(
  ({
    id,
    demande,
    disabled = false,
    className
  } :
  {
    id: string;
    demande: Demande;
    disabled?: boolean;
    className?: string;
  }) => {
    const typeDemande = demande.typeDemande;
    const ouverture = isTypeOuverture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || demande?.coloration;
    const isReadOnly = disabled || ouverture || !coloration;
    if (!coloration) return <></>;

    return (
      <CapaciteField
        id={id}
        name={"capaciteApprentissageColoreeActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
