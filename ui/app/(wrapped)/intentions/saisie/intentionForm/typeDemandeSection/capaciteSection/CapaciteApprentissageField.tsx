import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import {
  isTypeColoration,
  isTypeFermeture,
} from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteApprentissageField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch(({ capaciteApprentissageActuelle, typeDemande }, { name }) => {
          if (name === "typeDemande") {
            setValue("capaciteApprentissage", 0);
          } else if (
            name === "capaciteApprentissageActuelle" &&
            typeDemande === "coloration"
          ) {
            setValue("capaciteApprentissage", capaciteApprentissageActuelle);
          }
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande);

    const isReadOnly = disabled || fermeture || coloration;

    return (
      <CapaciteField
        name={"capaciteApprentissage"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
