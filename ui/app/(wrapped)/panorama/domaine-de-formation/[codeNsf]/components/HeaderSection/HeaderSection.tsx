"use client";

import { Container, Flex, Heading, Icon, Img } from "@chakra-ui/react";
import { Icon as Iconify } from "@iconify/react";

import { useNsfContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/nsfContext";
import { getNsfIcon } from "@/utils/getNsfIcon";

import { AccesRapide } from "./AccesRapide";

export const HeaderSection = () => {
  const { codeNsf, libelleNsf } = useNsfContext();

  return (
    <Flex bgColor={"bluefrance.975"}>
      <Container mt={"44px"} maxW={"container.xl"}>
        <Flex justifyContent={"space-between"} direction={"row"} py={"16px"}>
          <Flex direction={"column"} alignItems={"start"} gap={"24px"}>
            <Flex direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"16px"}>
              <Icon
                as={Iconify}
                icon={getNsfIcon(codeNsf)}
                borderRadius={"full"}
                boxSize={"54px"}
                bgColor={"white"}
                p={"8px"}
              />
              <Heading as="h1" size="lg" fontSize={{ base: "32px" }}>
                {libelleNsf}
              </Heading>
            </Flex>
            <AccesRapide />
          </Flex>
          <Img src="/illustrations/team-at-work.svg" objectFit="contain" alt="Illustration équipe en collaboration" />
        </Flex>
      </Container>
    </Flex>
  );
};
