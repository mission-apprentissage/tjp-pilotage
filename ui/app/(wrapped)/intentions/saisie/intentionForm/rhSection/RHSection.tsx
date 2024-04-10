import { Divider, Flex, Heading } from "@chakra-ui/react";

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

export const RHSection = ({ disabled }: { disabled: boolean }) => {
  return (
    <>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        Ressources Humaines
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex gap="2" mb="6" direction={"column"}>
        <Heading as="h3" fontSize={"14px"} fontWeight={700} mb={2}>
          Sur le plan des ressources humaines, le projet implique t-il :{" "}
        </Heading>
        <RecrutementRHField disabled={disabled} />
        <Flex direction={"row"} gap={4} mb={2}>
          <NbRecrutementRHField disabled={disabled} minW="20rem" />
          <DisciplinesRecrutementRHField disabled={disabled} />
        </Flex>
        <ReconversionRHField disabled={disabled} />
        <Flex direction={"row"} gap={4} mb={2}>
          <NbReconversionRHField disabled={disabled} minW="20rem" />
          <DisciplinesReconversionRHField disabled={disabled} />
        </Flex>
        <ProfesseurAssocieRHField disabled={disabled} />
        <Flex direction={"row"} gap={4} mb={2}>
          <NbProfesseurAssocieRHField disabled={disabled} minW="20rem" />
          <DisciplinesProfesseurAssocieRHField disabled={disabled} />
        </Flex>
        <FormationRHField disabled={disabled} />
        <Flex direction={"row"} gap={4} mb={2}>
          <NbFormationRHField disabled={disabled} minW="20rem" />
          <DisciplinesFormationRHField disabled={disabled} />
        </Flex>
      </Flex>
    </>
  );
};
