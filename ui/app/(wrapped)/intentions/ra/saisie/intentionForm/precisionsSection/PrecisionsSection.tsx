import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { RefObject } from "react";
import { useFormContext } from "react-hook-form";

import { Campagne } from "../../../types";
import { QuestionBlock } from "../../components/QuestionBlock";
import { SCROLL_OFFSET } from "../../SCROLL_OFFSETS";
import { IntentionForms } from "../defaultFormValues";
import { AmiCmaEnCoursValidationField } from "./AmiCmaEnCoursValidationField";
import { AmiCmaField } from "./AmiCmaField";
import { AmiCmaValideAnneeField } from "./AmiCmaValideAnneeField";
import { AmiCmaValideField } from "./AmiCmaValideField";
import { AutreMotifField } from "./AutreMotifField";
import { MotifField } from "./MotifField";

export const PrecisionsSection = ({
  disabled,
  motifsEtPrecisionsRef,
  campagne,
}: {
  disabled: boolean;
  motifsEtPrecisionsRef: RefObject<HTMLDivElement>;
  campagne?: Campagne;
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
      <Flex gap="6" mb="4" direction={"column"}>
        <MotifField disabled={disabled} mb="4" campagne={campagne} />
        <AutreMotifField disabled={disabled} mb="4" />
        <QuestionBlock active={!!amiCma}>
          <AmiCmaField disabled={disabled} />
          <Flex direction={"row"}>
            <AmiCmaValideField disabled={disabled} />
            <AmiCmaEnCoursValidationField disabled={disabled} />
          </Flex>
          <AmiCmaValideAnneeField disabled={disabled} />
        </QuestionBlock>
      </Flex>
    </Flex>
  );
};
