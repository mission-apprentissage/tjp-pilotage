import { chakra } from "@chakra-ui/react";
import { isTypeOuverture } from "shared/utils/typeDemandeUtils";

import type { Intention } from "@/app/(wrapped)/intentions/perdir/types";
import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";

export const CapaciteApprentissageActuelleField = chakra(
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
    const isReadOnly = isTypeOuverture(typeDemande) || disabled;

    return <CapaciteField id={id} name={"capaciteApprentissageActuelle"} className={className} isReadOnly={isReadOnly} />;
  }
);
