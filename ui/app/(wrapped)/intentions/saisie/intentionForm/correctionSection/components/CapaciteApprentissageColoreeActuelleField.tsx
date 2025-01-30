import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeColoration, isTypeOuverture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/intentions/saisie/components/CapaciteField";
import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import type { Demande } from "@/app/(wrapped)/intentions/saisie/types";

export const CapaciteApprentissageColoreeActuelleField = chakra(
  ({
    id,
    demande,
    disabled = false,
    className
  } :
  {
    id: string;
    demande: Demande;
    disabled?: boolean;
    className?: string;
  }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteApprentissageColoreeActuelle", 0);
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
        name={"capaciteApprentissageColoreeActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
