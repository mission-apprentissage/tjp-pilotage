import { Divider, Flex, Heading } from "@chakra-ui/react";

import { AutreMotifField } from "@/app/(wrapped)/intentions/saisie/intentionForm/precisionsSection/AutreMotifField";
import { MotifField } from "@/app/(wrapped)/intentions/saisie/intentionForm/precisionsSection/MotifField";

import { AmiCmaField } from "./AmiCmaField";
import { AmiCmaValideAnneeField } from "./AmiCmaValideAnneeField";
import { AmiCmaValideField } from "./AmiCmaValideField";

export const PrecisionsSection = ({ disabled }: { disabled: boolean }) => (
  <>
    <Heading as="h2" fontSize="xl" display={"flex"}>
      Motifs de votre demande et précisions complémentaires
    </Heading>
    <Divider pt="4" mb="4" />
    <Flex maxW="752px" gap="6" mb="6" direction={"column"}>
      <MotifField disabled={disabled} maxW="752px" mb="4" />
      <AutreMotifField disabled={disabled} mb="4" maxW="752px" />
      <AmiCmaField disabled={disabled} />
      <AmiCmaValideField disabled={disabled} />
      <AmiCmaValideAnneeField disabled={disabled} />
    </Flex>
  </>
);
