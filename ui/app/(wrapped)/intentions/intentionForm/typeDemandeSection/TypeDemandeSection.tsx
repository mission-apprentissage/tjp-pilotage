import {
  Box,
  Divider,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { MotifField } from "@/app/(wrapped)/intentions/intentionForm/typeDemandeSection/MotifField";

import { api } from "../../../../../api.client";
import { IntentionForms } from "../defaultFormValues";
import { InfoBox } from "../InfoBox";
import { AutreMotif } from "./AutreMotifField";
import { CompensationSection } from "./CompensationSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";

export const TypeDemandeSection = ({
  formMetadata,
}: {
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
}) => {
  const { watch } = useFormContext<IntentionForms>();

  const [typeDemande] = watch(["typeDemande"]);

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Type de demande
      </Heading>
      <Divider pt="4" mb="4" />
      <RentreeScolaireField mb="6" maxW="752px" />
      <Flex align="flex-start">
        <TypeDemandeField maxWidth="752px" mb="6" />
        <InfoBox flex="1" mt="10" ml="6">
          <Text mb="3">Exemple pour une Ouverture par compensation :</Text>
          <Text mb="3">
            Si j’ouvre un BAC PRO AEPA et que je ferme un BAC PRO AGORA.
          </Text>
          <OrderedList>
            <ListItem mb="2">
              Je choisis “Ouverture par compensation” dans ma première demande
              pour le BAC PRO AEPA.
            </ListItem>
            <ListItem>
              Je saisis ensuite une seconde demande de Fermeture pour le BAC PRO
              AGORA.
            </ListItem>
          </OrderedList>
        </InfoBox>
      </Flex>
      {(typeDemande === "ouverture_compensation" ||
        typeDemande === "augmentation_compensation") && (
        <Flex align="flex-start" mt={6}>
          <Box flexDirection={"column"} maxWidth="752px" mb="6">
            <CompensationSection formMetadata={formMetadata} />
          </Box>
          <InfoBox flex="1" mt="8" ml="6">
            Dans le cadre de votre
            {typeDemande === "ouverture_compensation"
              ? " ouverture "
              : " augmentation "}
            par compensation, veuillez saisir le code diplôme et l’établissement
            si il est différent. Nous ferons le lien automatiquement entre la
            demande
            {typeDemande === "ouverture_compensation"
              ? " d'ouverture "
              : " d'augmentation "}{" "}
            et la demande de fermeture / diminution pour le code diplôme et
            l’UAI renseigné
          </InfoBox>
        </Flex>
      )}

      <MotifField maxW="752px" mb="6" />
      <AutreMotif mb="6" maxW="752px" />
    </>
  );
};
