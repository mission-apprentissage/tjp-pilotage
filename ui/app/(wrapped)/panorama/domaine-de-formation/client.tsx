"use client";

import {
  AspectRatio,
  Container,
  Flex,
  Img,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";

import { SelectNsf } from "./components/selectNsf";
import { NsfOptions } from "./types";

export const PanoramaFormationClient = ({
  defaultNsf,
}: {
  defaultNsf: NsfOptions;
}) => {
  return (
    <Container
      px="48px"
      as="section"
      py="40px"
      bg="bluefrance.975"
      maxWidth={"container.xl"}
      h={"100%"}
    >
      <Flex align="center" direction="row" justify="space-between">
        <VisuallyHidden>
          <Text as={"h1"}>
            Rechercher un domaine de formation (NSF) ou par formation
          </Text>
        </VisuallyHidden>
        <SelectNsf defaultNsfs={defaultNsf} defaultSelected={null} w={"50%"} />
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img
            src="/illustrations/team-at-work.svg"
            objectFit="contain"
            alt="Illustration équipe en collaboration"
          />
        </AspectRatio>
      </Flex>
    </Container>
  );
};
