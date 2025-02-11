import { chakra } from "@chakra-ui/react";
import { isTypeOuverture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type { Demande } from "@/app/(wrapped)/intentions/saisie/types";

export const CapaciteApprentissageActuelleField = chakra(
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
    const isReadOnly = isTypeOuverture(typeDemande) || disabled;

    return <CapaciteField id={id} name={"capaciteApprentissageActuelle"} className={className} isReadOnly={isReadOnly} />;
  }
);
