import { chakra } from "@chakra-ui/react";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type { Intention } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types";
import { isTypeColoration, isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteScolaireField = chakra(
  ({ demande, disabled = false, className }: { demande: Intention; disabled?: boolean; className?: string }) => {
    const typeDemande = demande?.typeDemande;
    const fermeture = typeDemande !== undefined && isTypeFermeture(typeDemande);
    const coloration = typeDemande !== undefined && isTypeColoration(typeDemande);

    const isReadOnly = fermeture || coloration || disabled;

    return <CapaciteField name={"capaciteScolaire"} className={className} isReadOnly={isReadOnly} />;
  },
);
