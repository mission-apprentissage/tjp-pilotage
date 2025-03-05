import { chakra } from "@chakra-ui/react";
import { isTypeColoration, isTypeOuverture } from "shared/utils/typeDemandeUtils";

import type { Intention } from "@/app/(wrapped)/intentions/perdir/types";
import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";

export const CapaciteApprentissageColoreeActuelleField = chakra(
  ({
    id,
    intention,
    disabled = false,
    className
  } :
  {
    id: string;
    intention: Intention;
    disabled?: boolean;
    className?: string;
  }) => {
    const typeDemande = intention.typeDemande;
    const ouverture = isTypeOuverture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || intention?.coloration;
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
