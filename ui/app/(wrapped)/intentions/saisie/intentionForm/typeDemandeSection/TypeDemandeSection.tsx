import { Box, Divider, Fade, Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { client } from "@/api.client";
import { MotifField } from "@/app/(wrapped)/intentions/saisie/intentionForm/typeDemandeSection/MotifField";

import {
  getTypeDemandeExemple,
  getTypeDemandeLabel,
  isTypeCompensation,
} from "../../../../utils/typeDemandeUtils";
import { InfoBox } from "../../components/InfoBox";
import { IntentionForms } from "../defaultFormValues";
import { AutreMotif } from "./AutreMotifField";
import { CompensationSection } from "./CompensationSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";
export const TypeDemandeSection = ({
  formMetadata,
  disabled,
}: {
  formMetadata?: (typeof client.infer)["[GET]/demande/:id"]["metadata"];
  disabled?: boolean;
}) => {
  const { watch } = useFormContext<IntentionForms>();

  const [typeDemande] = watch(["typeDemande"]);

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Type de demande
      </Heading>
      <Divider pt="4" mb="4" />
      <RentreeScolaireField disabled={disabled} mb="6" maxW="752px" />
      <Flex align="flex-start">
        <TypeDemandeField disabled={disabled} maxWidth="752px" mb="6" />
        <Fade in={typeDemande != undefined}>
          {typeDemande && (
            <InfoBox flex="1" mt="10" ml="6" maxW="440px">
              {getTypeDemandeExemple(typeDemande)}
            </InfoBox>
          )}
        </Fade>
      </Flex>
      {isTypeCompensation(typeDemande) && (
        <Flex
          bg="blue.faded"
          mb="6"
          p="6"
          align="flex-start"
          boxShadow="0 0 0 2px #000091"
        >
          <Box flexDirection={"column"} flex="2" maxW="752px">
            <CompensationSection
              disabled={disabled}
              formMetadata={formMetadata}
            />
          </Box>
          <InfoBox flex="1" mt="8" ml="6">
            Dans le cadre de votre
            {` ${getTypeDemandeLabel(typeDemande).toLowerCase()}, `}
            veuillez saisir le code diplôme et l’établissement s'il est
            différent. <br />
            Nous ferons le lien automatiquement entre la demande
            {` d'${getTypeDemandeLabel(typeDemande).toLowerCase()} `}
            et la demande de fermeture / diminution pour le code diplôme et
            l’UAI renseignés
          </InfoBox>
        </Flex>
      )}

      <MotifField disabled={disabled} maxW="752px" mb="6" />
      <AutreMotif disabled={disabled} mb="6" maxW="752px" />
    </>
  );
};
