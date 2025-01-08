import { chakra } from "@chakra-ui/react";
import { isTypeFermeture } from "shared/validators/demandeValidators";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type { Intention } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types";
import { isTypeColoration } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteScolaireColoreeField = chakra(
  ({ demande, disabled = false, className }: { demande: Intention; disabled?: boolean; className?: string }) => {
    const typeDemande = demande?.typeDemande;
    const fermeture = typeDemande !== undefined && isTypeFermeture(typeDemande);
    const coloration = typeDemande !== undefined && (isTypeColoration(typeDemande) || demande?.coloration);
    const isReadOnly = fermeture || !coloration || disabled;
    if (!coloration) return <></>;
    if (fermeture) return <></>;

    return <CapaciteField name={"capaciteScolaireColoree"} className={className} isReadOnly={isReadOnly} />;
  },
);
