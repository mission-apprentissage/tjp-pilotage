import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeOuverture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/demandes/saisie/components/CapaciteField";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const CapaciteApprentissageActuelleField = chakra(
  ({ id, disabled, className }: { id: string; disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<DemandeFormType>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteApprentissageActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    const isReadOnly = disabled || ouverture;

    return (
      <CapaciteField
        id={id}
        name={"capaciteApprentissageActuelle"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
