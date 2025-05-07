import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { RefObject } from "react";
import { useFormContext } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";
import { isTypeDiminution,isTypeFermeture } from "shared/utils/typeDemandeUtils";

import { QuestionBlock } from "@/app/(wrapped)/demandes/saisie/components/QuestionBlock";
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { SCROLL_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";

import { AmiCmaEnCoursValidationField } from "./AmiCmaEnCoursValidationField";
import { AmiCmaField } from "./AmiCmaField";
import { AmiCmaValideAnneeField } from "./AmiCmaValideAnneeField";
import { AmiCmaValideField } from "./AmiCmaValideField";
import { AutreMotifField } from "./AutreMotifField";
import { CmqImpliqueField } from "./CmqImpliqueField";
import { FiliereCmqField } from "./FiliereCmqField";
import { InspecteurReferentField } from "./InspecteurReferentField";
import { MotifField } from "./MotifField";
import { NomCmqField } from "./NomCmqField";
import { PartenaireEconomiqueField } from "./PartenaireEconomiqueField";
import { PartenairesEconomiquesFields } from "./PartenairesEconomiquesFields";

export const PrecisionsSection = ({
  disabled,
  motifsEtPrecisionsRef,
  campagne
}: {
  disabled?: boolean;
  motifsEtPrecisionsRef: RefObject<HTMLDivElement>;
  campagne: CampagneType;
}) => {
  const { watch } = useFormContext<DemandeFormType>();

  const [typeDemande, amiCma, partenairesEconomiquesImpliques, cmqImplique] = watch([
    "typeDemande",
    "amiCma",
    "partenairesEconomiquesImpliques",
    "cmqImplique",
  ]);

  const sectionsAmiCmaPartenairesEcoCMQVisibles = !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande);

  return (
    <Flex ref={motifsEtPrecisionsRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"}>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Icon icon="ri:list-unordered" color="black" style={{ marginTop: "auto" }} />
          Motifs de votre demande et précisions complémentaires
        </Flex>
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex gap="6" mb="4" direction={"column"}>
        <MotifField disabled={disabled} campagne={campagne}/>
        <AutreMotifField disabled={disabled} />
        {sectionsAmiCmaPartenairesEcoCMQVisibles && (
          <>
            <QuestionBlock active={!!amiCma}>
              <AmiCmaField disabled={disabled} />
              <Flex direction={"row"}>
                <AmiCmaValideField disabled={disabled} />
                <AmiCmaEnCoursValidationField disabled={disabled} />
              </Flex>
              <AmiCmaValideAnneeField disabled={disabled} />
            </QuestionBlock>
            <QuestionBlock active={!!partenairesEconomiquesImpliques}>
              <PartenaireEconomiqueField disabled={disabled} />
              <PartenairesEconomiquesFields disabled={disabled} />
            </QuestionBlock>
            <QuestionBlock active={!!cmqImplique}>
              <CmqImpliqueField disabled={disabled} />
              <FiliereCmqField disabled={disabled} />
              <NomCmqField disabled={disabled} />
            </QuestionBlock>
          </>
        )}
        <InspecteurReferentField disabled={disabled} />
      </Flex>
    </Flex>
  );
};
