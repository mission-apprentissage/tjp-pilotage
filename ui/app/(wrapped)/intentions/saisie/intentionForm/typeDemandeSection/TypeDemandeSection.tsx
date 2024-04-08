import { Box, Divider, Fade, Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { client } from "@/api.client";
import { AutreMotifField } from "@/app/(wrapped)/intentions/saisie/intentionForm/typeDemandeSection/AutreMotifField";
import { MotifField } from "@/app/(wrapped)/intentions/saisie/intentionForm/typeDemandeSection/MotifField";

import {
  getTypeDemandeExemple,
  getTypeDemandeLabel,
  isTypeCompensation,
} from "../../../utils/typeDemandeUtils";
import { InfoBox } from "../../components/InfoBox";
import { IntentionForms } from "../defaultFormValues";
import { AutreBesoinRHField } from "./AutreBesoinRHField";
import { BesoinRHField } from "./BesoinRHField";
import { CompensationSection } from "./CompensationSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";
export const TypeDemandeSection = ({
  formMetadata,
  disabled,
  formId,
}: {
  formMetadata?: (typeof client.infer)["[GET]/demande/:numero"]["metadata"];
  disabled?: boolean;
  formId?: string;
}) => {
  const { watch, getValues } = useFormContext<IntentionForms>();

  const [typeDemande] = watch(["typeDemande"]);
  const isRentreeScolaireDisabled =
    disabled || (!!getValues("rentreeScolaire") && !!formId);

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Type de demande
      </Heading>
      <Divider pt="4" mb="4" />
      <RentreeScolaireField
        disabled={isRentreeScolaireDisabled}
        mb="6"
        maxW="752px"
      />
      <Flex align="flex-start" flexDir={["column", null, "row"]}>
        <TypeDemandeField disabled={disabled} maxWidth="752px" mb="6" />
        <Fade in={typeDemande != undefined}>
          {typeDemande && (
            <InfoBox
              flex="1"
              mt={[null, null, "10"]}
              ml={[null, null, "6"]}
              mb={[6, null, 0]}
              maxW="440px"
            >
              {getTypeDemandeExemple(typeDemande)}
            </InfoBox>
          )}
        </Fade>
      </Flex>
      {isTypeCompensation(typeDemande) && (
        <Flex
          bg="blueecume.925"
          mb="6"
          p="6"
          align="flex-start"
          boxShadow="0 0 0 2px bluefrance.113"
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
      <AutreMotifField disabled={disabled} mb="6" maxW="752px" />
      <BesoinRHField disabled={disabled} maxW="752px" mb="6" />
      <AutreBesoinRHField disabled={disabled} mb="6" maxW="752px" />
    </>
  );
};
