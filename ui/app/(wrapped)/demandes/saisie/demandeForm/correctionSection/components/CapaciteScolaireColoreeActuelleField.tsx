import { chakra } from "@chakra-ui/react";
import { isTypeColoration, isTypeOuverture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/demandes/saisie/components/CapaciteField";
import type { Demande } from "@/app/(wrapped)/demandes/types";

export const CapaciteScolaireColoreeActuelleField = chakra(
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
        name={"capaciteScolaireColoreeActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
