import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { getTypeDemandeExemple } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

import { InfoBox } from "./InfoBox";

export const Conseils = ({ dateFermetureFormation }:{ dateFermetureFormation?: string }) => {
  const { watch } = useFormContext<IntentionForms>();

  const typeDemande = watch("typeDemande");

  return (
    <>
      { dateFermetureFormation && (
        <InfoBox flex="1" mt={6} bgColor="redmarianne.925" color="red.500">
          {`Attention, la formation sur laquelle vous souhaitez faire une demande sera fermée à partir du ${dateFermetureFormation}.`}
        </InfoBox>
      )}
      { typeDemande && (
        <InfoBox flex="1" mt={6}>
          {getTypeDemandeExemple(typeDemande)}
        </InfoBox>
      )}
    </>
  );
};
