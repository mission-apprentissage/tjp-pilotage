import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type {Intention} from '@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types';
import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { isTypeColoration, isTypeOuverture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteScolaireColoreeActuelleField = chakra(
  ({
    id,
    demande,
    disabled = false,
    className
  } :
  {
    id: string;
    demande: Intention;
    disabled?: boolean;
    className?: string;
  }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteScolaireColoreeActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = demande.typeDemande;
    const ouverture = typeDemande !== undefined && isTypeOuverture(typeDemande);
    const coloration = typeDemande !== undefined && isTypeColoration(typeDemande) || watch("coloration");
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
