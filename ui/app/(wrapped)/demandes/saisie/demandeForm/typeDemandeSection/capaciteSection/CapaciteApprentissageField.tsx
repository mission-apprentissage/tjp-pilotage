import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeColoration, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/demandes/saisie/components/CapaciteField";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const CapaciteApprentissageField = chakra(
  ({ id, disabled, className }: { id: string; disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<DemandeFormType>();

    useEffect(
      () =>
        watch(({ capaciteApprentissageActuelle, typeDemande }, { name }) => {
          if (name === "typeDemande") {
            setValue("capaciteApprentissage", 0);
          } else if (name === "capaciteApprentissageActuelle" && typeDemande === "coloration") {
            setValue("capaciteApprentissage", capaciteApprentissageActuelle);
          }
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande);

    const isReadOnly = disabled || fermeture || coloration;

    return <CapaciteField id={id} name={"capaciteApprentissage"} className={className} isReadOnly={isReadOnly} />;
  }
);
