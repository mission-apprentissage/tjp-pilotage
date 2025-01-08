import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { CapaciteField } from "@/app/(wrapped)/intentions/perdir/saisie/components/CapaciteField";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeColoration, isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteApprentissageField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch(({ capaciteApprentissageActuelle, typeDemande }, { name }) => {
          if (name === "typeDemande") {
            setValue("capaciteApprentissage", 0);
          } else if (name === "capaciteApprentissageActuelle" && typeDemande === "coloration") {
            setValue("capaciteApprentissage", capaciteApprentissageActuelle);
          }
        }).unsubscribe,
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande);

    const isReadOnly = disabled || fermeture || coloration;

    return <CapaciteField name={"capaciteApprentissage"} className={className} isReadOnly={isReadOnly} />;
  },
);
