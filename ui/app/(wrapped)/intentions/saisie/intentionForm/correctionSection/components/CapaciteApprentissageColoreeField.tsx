import { chakra } from "@chakra-ui/react";
import { isTypeColoration, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type { Demande } from "@/app/(wrapped)/intentions/saisie/types";

export const CapaciteApprentissageColoreeField = chakra(
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
    const fermeture = typeDemande !== undefined && isTypeFermeture(typeDemande);
    const coloration = typeDemande !== undefined && (isTypeColoration(typeDemande) || demande?.coloration);
    const isReadOnly = fermeture || !coloration || disabled;

    if (!coloration) return <></>;
    if (fermeture) return <></>;

    return <CapaciteField id={id} name={"capaciteApprentissageColoree"} className={className} isReadOnly={isReadOnly} />;
  }
);
