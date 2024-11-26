import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { CapaciteField } from "@/app/(wrapped)/intentions/perdir/saisie/components/CapaciteField";
import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { isTypeColoration, isTypeFermeture } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const CapaciteScolaireField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const { watch, setValue } = useFormContext<IntentionForms>();

  useEffect(
    () =>
      watch(({ capaciteScolaireActuelle, typeDemande }, { name }) => {
        if (name === "typeDemande") {
          setValue("capaciteScolaire", 0);
        } else if (name === "capaciteScolaireActuelle" && typeDemande === "coloration") {
          setValue("capaciteScolaire", capaciteScolaireActuelle);
        }
      }).unsubscribe
  );

  const typeDemande = watch("typeDemande");
  const fermeture = isTypeFermeture(typeDemande);
  const coloration = isTypeColoration(typeDemande);
  const isReadOnly = disabled || fermeture || coloration;

  return <CapaciteField name={"capaciteScolaire"} className={className} isReadOnly={isReadOnly} />;
});
