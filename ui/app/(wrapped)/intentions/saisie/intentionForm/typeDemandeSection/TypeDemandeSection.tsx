import { Divider, Fade, Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { getTypeDemandeExemple } from "../../../utils/typeDemandeUtils";
import { InfoBox } from "../../components/InfoBox";
import { Campagne } from "../../types";
import { IntentionForms } from "../defaultFormValues";
import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";
export const TypeDemandeSection = ({
  disabled,
  campagne,
}: {
  disabled: boolean;
  campagne?: Campagne;
}) => {
  const { watch } = useFormContext<IntentionForms>();

  const [typeDemande] = watch(["typeDemande"]);

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Type de demande
      </Heading>
      <Divider pt="4" mb="4" />
      <RentreeScolaireField disabled={disabled} campagne={campagne} />
      <Flex align="flex-start" flexDir={["column", null, "row"]} mt={6}>
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
      <CapaciteSection disabled={disabled} />
    </>
  );
};
