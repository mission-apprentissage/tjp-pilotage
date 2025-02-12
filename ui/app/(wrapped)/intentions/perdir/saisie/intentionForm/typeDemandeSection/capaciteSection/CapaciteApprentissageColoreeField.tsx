import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeFermeture } from "shared/validators/demandeValidators";

import { CapaciteField } from "@/app/(wrapped)/intentions/perdir/saisie/components/CapaciteField";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeColoration } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteApprentissageColoreeField = chakra(
  ({ id, disabled, className }: { id: string; disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteApprentissageColoree", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || watch("coloration");
    const isReadOnly = disabled || fermeture || !coloration;
    if (!coloration) return <></>;
    if (fermeture) return <></>;

    return (
      <CapaciteField
        id={id}
        name={"capaciteApprentissageColoree"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
