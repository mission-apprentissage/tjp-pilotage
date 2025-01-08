import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { CapaciteField } from "@/app/(wrapped)/intentions/perdir/saisie/components/CapaciteField";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeOuverture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteApprentissageActuelleField = chakra(
  ({ id, disabled, className }: { id: string; disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteApprentissageActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    const isReadOnly = disabled || ouverture;

    return (
      <CapaciteField
        id={id}
        name={"capaciteApprentissageActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
