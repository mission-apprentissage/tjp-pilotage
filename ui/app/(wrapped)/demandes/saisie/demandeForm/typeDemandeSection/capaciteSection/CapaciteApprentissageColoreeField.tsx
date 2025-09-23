import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeColoration, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/demandes/saisie/components/CapaciteField";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const CapaciteApprentissageColoreeField = chakra(
  ({ id, disabled, className }: { id: string; disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<DemandeFormType>();

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
