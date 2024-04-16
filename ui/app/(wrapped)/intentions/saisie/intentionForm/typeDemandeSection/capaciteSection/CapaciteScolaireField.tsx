import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";

import {
  isTypeColoration,
  isTypeFermeture,
} from "../../../../utils/typeDemandeUtils";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteScolaireField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteScolaire", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande);
    const isReadOnly = disabled || fermeture || coloration;

    return (
      <CapaciteField
        name={"capaciteScolaire"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
