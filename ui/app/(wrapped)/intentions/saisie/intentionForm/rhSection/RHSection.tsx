import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { RefObject } from "react";
import { useFormContext } from "react-hook-form";

import { QuestionBlock } from "@/app/(wrapped)/intentions/saisie/components/QuestionBlock";
import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { SCROLL_OFFSET } from "@/app/(wrapped)/intentions/saisie/SCROLL_OFFSETS";

import { DisciplinesFormationRHField } from "./formationRHSection/DisciplinesFormationRHField";
import { FormationRHField } from "./formationRHSection/FormationRHField";
import { NbFormationRHField } from "./formationRHSection/NbFormationRHField";
import { DisciplinesProfesseurAssocieRHField } from "./professeurAssocieRHSection/DisciplinesProfesseurAssocieRHField";
import { NbProfesseurAssocieRHField } from "./professeurAssocieRHSection/NbProfesseurAssocieRHField";
import { ProfesseurAssocieRHField } from "./professeurAssocieRHSection/ProfesseurAssocieRHField";
import { DisciplinesReconversionRHField } from "./reconversionRHSection/DisciplinesReconversionRHField";
import { NbReconversionRHField } from "./reconversionRHSection/NbReconversionRHField";
import { ReconversionRHField } from "./reconversionRHSection/ReconversionRHField";
import { DisciplinesRecrutementRHField } from "./recrutementRHSection/DisciplinesRecrutementRHField";
import { NbRecrutementRHField } from "./recrutementRHSection/NbRecrutementRHField";
import { RecrutementRHField } from "./recrutementRHSection/RecrutementRHField";

export const RHSection = ({
  disabled,
  ressourcesHumainesRef,
}: {
  disabled: boolean;
  ressourcesHumainesRef: RefObject<HTMLDivElement>;
}) => {
  const { watch } = useFormContext<IntentionForms>();

  const [recrutementRH, reconversionRH, professeurAssocieRH, formationRH] = watch([
    "recrutementRH",
    "reconversionRH",
    "professeurAssocieRH",
    "formationRH",
  ]);

  return (
    <Flex ref={ressourcesHumainesRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"}>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Icon icon="ri:parent-line" color="black" style={{ marginTop: "auto" }} />
          Ressources Humaines
        </Flex>
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex gap={6} mb="6" direction={"column"}>
        <Heading as="h3" fontSize={"14px"} fontWeight={700} mb={2}>
          Sur le plan des ressources humaines, le projet implique t-il :{" "}
        </Heading>
        <QuestionBlock active={!!recrutementRH}>
          <RecrutementRHField disabled={disabled} />
          <NbRecrutementRHField disabled={disabled} minW="20rem" />
          <DisciplinesRecrutementRHField disabled={disabled} />
        </QuestionBlock>
        <QuestionBlock active={!!reconversionRH}>
          <ReconversionRHField disabled={disabled} />
          <NbReconversionRHField disabled={disabled} minW="20rem" />
          <DisciplinesReconversionRHField disabled={disabled} />
        </QuestionBlock>
        <QuestionBlock active={!!professeurAssocieRH}>
          <ProfesseurAssocieRHField disabled={disabled} />
          <NbProfesseurAssocieRHField disabled={disabled} minW="20rem" />
          <DisciplinesProfesseurAssocieRHField disabled={disabled} />
        </QuestionBlock>
        <QuestionBlock active={!!formationRH}>
          <FormationRHField disabled={disabled} />
          <NbFormationRHField disabled={disabled} minW="20rem" />
          <DisciplinesFormationRHField disabled={disabled} />
        </QuestionBlock>
      </Flex>
    </Flex>
  );
};
