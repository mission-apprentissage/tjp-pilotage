import { chakra } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { isTypeFermeture } from "shared/validators/demandeValidators";

import { isTypeColoration } from "../../../../utils/typeDemandeUtils";
import { CapaciteField } from "../../../components/CapaciteField";
import { CorrectionForms } from "../defaultFormValues";
import { Intention } from "../types";

export const CapaciteScolaireColoreeField = chakra(
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
      typeDemande !== undefined &&
      (isTypeColoration(typeDemande) || watch("coloration"));
    const isReadOnly = fermeture || !coloration || disabled;
    if (!coloration) return <></>;
    if (fermeture) return <></>;

    return (
      <CapaciteField
        name={"capaciteScolaireColoree"}
        className={className}
        isReadOnly={isReadOnly}
      />
    );
  }
);
