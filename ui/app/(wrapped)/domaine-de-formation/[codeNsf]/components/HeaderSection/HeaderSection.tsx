"use client";

import { Flex, Heading, Icon, Img } from "@chakra-ui/react";
import { Icon as Iconify } from "@iconify/react";

import { getNsfIcon } from "@/utils/getNsfIcon";

import { AccesRapide } from "./AccesRapide";

export const HeaderSection = ({
  codeNsf,
  libelleNsf,
  codeRegion,
}: {
  codeNsf: string;
  libelleNsf: string;
  codeRegion?: string;
}) => {
  return (
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
        <AccesRapide codeNsf={codeNsf} codeRegion={codeRegion} />
      </Flex>

      <Img src="/illustrations/team-at-work.svg" objectFit="contain" alt="Illustration équipe en collaboration" />
    </Flex>
  );
};
