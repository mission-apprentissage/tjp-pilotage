import { chakra } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isTypeColoration, isTypeFermeture } from "shared/utils/typeDemandeUtils";

import { CapaciteField } from "@/app/(wrapped)/demandes/saisie/components/CapaciteField";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const CapaciteScolaireField = chakra(
  ({ id, disabled, className }: { id: string; disabled?: boolean; className?: string }) => {
    const { watch, setValue } = useFormContext<DemandeFormType>();

    useEffect(
      () =>
        watch(({ capaciteScolaireActuelle, typeDemande }, { name }) => {
          if (name === "typeDemande") {
            setValue("capaciteScolaire", 0);
          } else if (name === "capaciteScolaireActuelle" && typeDemande === "coloration") {
            setValue("capaciteScolaire", capaciteScolaireActuelle);
          }
        }).unsubscribe,
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);
    const coloration = isTypeColoration(typeDemande);
    const isReadOnly = disabled || fermeture || coloration;

    return <CapaciteField id={id} name={"capaciteScolaire"} className={className} isReadOnly={isReadOnly} />;
  },
);
