import { Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { getTypeDemandeExemple } from "@/app/(wrapped)/demandes/utils/typeDemandeUtils";

import { InfoBox } from "./InfoBox";

export const Conseils = ({
  dateFermetureFormation
} : {
  dateFermetureFormation?: string;
}) => {
  const { watch } = useFormContext<DemandeFormType>();

  const typeDemande = watch("typeDemande");

  const commentaire = watch("commentaire");

  return (
    <>

      { dateFermetureFormation && (
        <InfoBox flex="1" mt={6} bgColor="redmarianne.925" color="red.500">
          {`Attention, la formation sur laquelle vous souhaitez faire une demande sera fermée à partir du ${dateFermetureFormation}.`}
        </InfoBox>
      )}
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
          Merci de détailler les éléments de contexte du projet : développement économique ou démographique du
          territoire, prospectives étayées, partenariats noués, typologie d’élèves accueillis…
        </InfoBox>
      )}
    </>
  );
};
