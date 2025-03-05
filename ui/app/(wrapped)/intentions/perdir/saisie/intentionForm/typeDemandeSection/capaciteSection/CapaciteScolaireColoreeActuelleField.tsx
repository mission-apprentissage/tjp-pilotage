import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeColoration, isTypeOuverture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/intentions/perdir/saisie/components/CapaciteField";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const CapaciteScolaireColoreeActuelleField = chakra(
  ({ id, disabled, className }: { id: string; disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteScolaireColoreeActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || watch("coloration");
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
