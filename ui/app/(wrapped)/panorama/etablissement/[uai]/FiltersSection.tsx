import { Container, Flex } from "@chakra-ui/react";

import { Multiselect } from "@/components/Multiselect";
export const FiltersSection = ({
  diplomeOptions,
  onDiplomeChanged,
  codeDiplome,
}: {
  diplomeOptions?: { label: string; value: string }[];
  onDiplomeChanged?: (diplome: string[]) => void;
  codeDiplome?: string[];
}) => {
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
      </Flex>
    </Container>
  );
};
