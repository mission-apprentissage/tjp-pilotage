import { chakra } from "@chakra-ui/react";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type { Intention } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types";
import { isTypeOuverture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteApprentissageActuelleField = chakra(
  ({ demande, disabled = false, className }: { demande: Intention; disabled?: boolean; className?: string }) => {
    const typeDemande = demande?.typeDemande;
    const isReadOnly = (typeDemande !== undefined && isTypeOuverture(typeDemande)) || disabled;

    return <CapaciteField name={"capaciteApprentissageActuelle"} className={className} isReadOnly={isReadOnly} />;
  }
);
