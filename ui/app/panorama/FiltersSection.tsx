import { Container, Flex } from "@chakra-ui/react";

import { Multiselect } from "@/components/Multiselect";
export const FiltersSection = ({
  diplomeOptions,
  onDiplomeChanged,
  onUAIChanged,
  UAIOptions,
}: {
  diplomeOptions?: { label: string; value: string }[];
  onDiplomeChanged?: (diplome: string[]) => void;
  onUAIChanged: (UAI: string[]) => void;
  UAIOptions?: { label: string; value: string }[];
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
        >
          Diplôme
        </Multiselect>
        <Multiselect
          display="none"
          ml="2"
          width={250}
          onChange={onUAIChanged}
          options={UAIOptions}
        >
          Etablissement
        </Multiselect>
      </Flex>
    </Container>
  );
};
