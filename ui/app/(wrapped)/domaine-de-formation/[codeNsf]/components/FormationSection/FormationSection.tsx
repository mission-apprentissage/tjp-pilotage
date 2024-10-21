import { Container, Divider, Heading } from "@chakra-ui/react";

export const FormationSection = () => {
  return (
    <Container maxW={"container.xl"} as="section" id="formations">
      <Heading as="h2">Offre de formation dans ce domaine</Heading>
      <Divider width="48px" />
    </Container>
  );
};
