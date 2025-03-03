import { chakra } from "@chakra-ui/react";
import { isTypeColoration, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import type { Intention } from "@/app/(wrapped)/intentions/perdir/types";
import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";

export const CapaciteScolaireField = chakra(
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
    const typeDemande = intention?.typeDemande;
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || intention?.coloration;

    const isReadOnly = fermeture || coloration || disabled;

    return <CapaciteField id={id} name={"capaciteScolaire"} className={className} isReadOnly={isReadOnly} />;
  }
);
