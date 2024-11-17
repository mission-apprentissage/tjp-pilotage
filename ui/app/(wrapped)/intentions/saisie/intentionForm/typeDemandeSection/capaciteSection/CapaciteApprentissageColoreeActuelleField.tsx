import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import {
  isTypeColoration,
  isTypeOuverture,
} from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteApprentissageColoreeActuelleField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteApprentissageColoreeActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || watch("coloration");
    const isReadOnly = disabled || ouverture || !coloration;
    if (!coloration) return <></>;

    return (
      <CapaciteField
        name={"capaciteApprentissageColoreeActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
