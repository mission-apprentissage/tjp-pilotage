import { chakra } from "@chakra-ui/react";
import { isTypeColoration, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/demandes/saisie/components/CapaciteField";
import type { Demande } from "@/app/(wrapped)/demandes/types";

export const CapaciteScolaireField = chakra(
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
    const typeDemande = demande?.typeDemande;
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || demande?.coloration;

    const isReadOnly = fermeture || coloration || disabled;

    return <CapaciteField id={id} name={"capaciteScolaire"} className={className} isReadOnly={isReadOnly} />;
  }
);
