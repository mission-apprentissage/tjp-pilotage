import { useFormContext } from "react-hook-form";

import { getTypeDemandeExemple } from "../../utils/typeDemandeUtils";
import { IntentionForms } from "../intentionForm/defaultFormValues";
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
