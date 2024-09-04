import { chakra } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import {
  isTypeColoration,
  isTypeFermeture,
} from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { CorrectionForms } from "../defaultFormValues";
import { Intention } from "../types";

export const CapaciteApprentissageField = chakra(
  ({
    demande,
    disabled = false,
    className,
  }: {
    demande: Intention;
    disabled?: boolean;
    className?: string;
  }) => {
    const typeDemande = demande?.typeDemande;
    const { watch } = useFormContext<CorrectionForms>();
    const fermeture = typeDemande !== undefined && isTypeFermeture(typeDemande);
    const coloration =
      (typeDemande !== undefined && isTypeColoration(typeDemande)) ||
      watch("coloration");

    const isReadOnly = fermeture || coloration || disabled;

    return (
      <CapaciteField
        name={"capaciteApprentissage"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
