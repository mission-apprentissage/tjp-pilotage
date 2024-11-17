import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeFermeture } from "shared/validators/demandeValidators";

import { isTypeColoration } from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteScolaireColoreeField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteScolaireColoree", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande) || watch("coloration");
    const isReadOnly = disabled || fermeture || !coloration;
    if (!coloration) return <></>;

    return (
      <CapaciteField
        name={"capaciteScolaireColoree"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
