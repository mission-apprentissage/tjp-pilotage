import { Container, Flex } from "@chakra-ui/react";

import { Multiselect } from "@/components/Multiselect";

import { PanoramaFormation } from "./type";
export const FiltersSection = ({
  formations,
  onDiplomeChanged,
  codeDiplome,
  onLibelleFiliereChanged,
  libelleFiliere,
}: {
  formations?: PanoramaFormation[];
  onDiplomeChanged?: (diplome: string[]) => void;
  codeDiplome?: string[];
  onLibelleFiliereChanged?: (diplome: string[]) => void;
  libelleFiliere?: string[];
}) => {
  const diplomeOptions = Object.values(
    formations?.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.codeNiveauDiplome]: {
          value: cur.codeNiveauDiplome,
          label: cur.libelleNiveauDiplome as string,
        },
      };
    }, {} as Record<string, { value: string; label: string }>) ?? {}
  );

  const libelleFiliereOptions = Object.values(
    formations?.reduce((acc, cur) => {
      if (!cur.libelleFiliere) return acc;
      return {
        ...acc,
        [cur.libelleFiliere]: {
          value: cur.libelleFiliere,
          label: cur.libelleFiliere as string,
        },
      };
    }, {} as Record<string, { value: string; label: string }>) ?? {}
  );

  return (
    <Container
      py="4"
      maxW="container.xl"
      position="sticky"
      bg="white"
      top="0"
      borderBottom="1px solid"
      borderColor="grey.900"
      zIndex="2"
    >
      <Flex justify="flex-end">
        <Multiselect
          onChange={onDiplomeChanged}
          width={250}
          options={diplomeOptions}
          value={codeDiplome ?? []}
        >
          Diplôme
        </Multiselect>
        <Multiselect
          onChange={onLibelleFiliereChanged}
          width={250}
          options={libelleFiliereOptions}
          value={libelleFiliere ?? []}
          ml="2"
        >
          Secteur d’activité
        </Multiselect>
      </Flex>
    </Container>
  );
};
