import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";

import { isTypeOuverture } from "../../../../utils/typeDemandeUtils";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteScolaireActuelleField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteScolaireActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    const isReadOnly = disabled || ouverture;

    return (
      <CapaciteField
        name={"capaciteScolaireActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
