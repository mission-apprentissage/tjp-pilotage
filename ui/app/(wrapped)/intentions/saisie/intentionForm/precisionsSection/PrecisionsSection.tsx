import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { RefObject } from "react";
import { useFormContext } from "react-hook-form";

import { AutreMotifField } from "@/app/(wrapped)/intentions/saisie/intentionForm/precisionsSection/AutreMotifField";
import { MotifField } from "@/app/(wrapped)/intentions/saisie/intentionForm/precisionsSection/MotifField";
import { SCROLL_OFFSET } from "@/app/(wrapped)/intentions/saisie/SCROLL_OFFSETS";

import { QuestionBlock } from "../../components/QuestionBlock";
import { IntentionForms } from "../defaultFormValues";
import { AmiCmaField } from "./AmiCmaField";
import { AmiCmaValideAnneeField } from "./AmiCmaValideAnneeField";
import { AmiCmaValideField } from "./AmiCmaValideField";

export const PrecisionsSection = ({
  disabled,
  motifsEtPrecisionsRef,
}: {
  disabled: boolean;
  motifsEtPrecisionsRef: RefObject<HTMLDivElement>;
}) => {
  const { watch } = useFormContext<IntentionForms>();

  const amiCma = watch("amiCma");

  return (
    <Flex
      ref={motifsEtPrecisionsRef}
      scrollMarginTop={SCROLL_OFFSET}
      direction={"column"}
    >
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Icon
            icon="ri:list-unordered"
            color="black"
            style={{ marginTop: "auto" }}
          />
          Motifs de votre demande et précisions complémentaires
        </Flex>
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex maxW="752px" gap="6" mb="6" direction={"column"}>
        <MotifField disabled={disabled} maxW="752px" mb="4" />
        <QuestionBlock active={!!amiCma}>
          <AmiCmaField disabled={disabled} />
          <AmiCmaValideField disabled={disabled} />
          <AmiCmaValideAnneeField disabled={disabled} />
        </QuestionBlock>
        <AutreMotifField disabled={disabled} mb="4" maxW="752px" />
      </Flex>
    </Flex>
  );
};
