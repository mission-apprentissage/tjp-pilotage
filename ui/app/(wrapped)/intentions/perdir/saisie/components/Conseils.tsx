import { Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { getTypeDemandeExemple } from "../../utils/typeDemandeUtils";
import { IntentionForms } from "../intentionForm/defaultFormValues";
import { InfoBox } from "./InfoBox";

export const Conseils = () => {
  const { watch } = useFormContext<IntentionForms>();

  const typeDemande = watch("typeDemande");

  const commentaire = watch("commentaire");

  if (!typeDemande && !commentaire) return null;

  return (
    <>
      {typeDemande && (
        <InfoBox flex="1" mt={6}>
          {getTypeDemandeExemple(typeDemande)}
        </InfoBox>
      )}
      {commentaire && (
        <InfoBox flex="1" mt={6}>
          <Text mb="3" fontWeight="bold">
            Champ commentaire :{" "}
          </Text>
          Merci de détailler les éléments de contexte du projet : développement
          économique ou démographique du territoire, prospectives étayées,
          partenariats noués, typologie d’élèves accueillis…
        </InfoBox>
      )}
    </>
  );
};
