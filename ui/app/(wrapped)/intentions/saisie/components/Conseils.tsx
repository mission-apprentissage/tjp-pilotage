import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { getTypeDemandeExemple } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

import { InfoBox } from "./InfoBox";

export const Conseils = () => {
  const { watch } = useFormContext<IntentionForms>();

  const typeDemande = watch("typeDemande");
  if (!typeDemande) return null;

  return (
    <InfoBox flex="1" mt={6}>
      {getTypeDemandeExemple(typeDemande)}
    </InfoBox>
  );
};
