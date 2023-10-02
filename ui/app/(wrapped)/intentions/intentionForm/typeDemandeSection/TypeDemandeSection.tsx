import { Box, Divider, Fade, Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { ApiType } from "shared";

import { MotifField } from "@/app/(wrapped)/intentions/intentionForm/typeDemandeSection/MotifField";

import { api } from "../../../../../api.client";
import { InfoBox } from "../../components/InfoBox";
import {
  isTypeCompensation,
  typeDemandesOptions,
} from "../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";
import { AutreMotif } from "./AutreMotifField";
import { CompensationSection } from "./CompensationSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";
export const TypeDemandeSection = ({
  formMetadata,
  disabled,
}: {
  formMetadata?: ApiType<typeof api.getDemande>["metadata"];
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
              {typeDemandesOptions[typeDemande].exemple}
            </InfoBox>
          )}
        </Fade>
      </Flex>
      {isTypeCompensation(typeDemande) && (
        <Flex
          bg="#E2E7F8"
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
            {` ${typeDemandesOptions[typeDemande].label.toLowerCase()}, `}
            veuillez saisir le code diplôme et l’établissement s'il est
            différent. <br />
            Nous ferons le lien automatiquement entre la demande
            {` d'${typeDemandesOptions[typeDemande].label.toLowerCase()} `}
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
