"use client";

import { LinkIcon } from "@chakra-ui/icons";
import { Button, chakra, Divider, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

import { STICKY_OFFSET } from "@/app/(wrapped)/intentions/perdir/SCROLL_OFFSETS";
import { useAuth } from "@/utils/security/useAuth";

import { EDITO } from "./const";

export const EditoSection = chakra(() => {
  if (EDITO.length === 0) return <></>;

  const auth = useAuth();

  const normalizedEdito = EDITO
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((entry) => entry.en_ligne)
    .filter((entry) => {
      if (!entry.region) return true;
      if (entry.region === auth.codeRegion) return true;
      return false;
    });


  return (
    <Flex direction={"column"} gap={4} bgColor={"white"} borderRadius={6} p={6} top={STICKY_OFFSET} position={"sticky"}>
      <Heading as="h2" fontSize={18} fontWeight={700}>
        Actualités
      </Heading>
      <Divider />
      {normalizedEdito.map((rowEdito, index) => {
        return (
          <Flex direction={"column"} gap={2} key={rowEdito.titre}>
            <Heading as="h3" fontSize={16} fontWeight={700} color={"grey.425"} textTransform={"uppercase"}>
              {rowEdito.titre}
            </Heading>
            <Heading as="h4" fontSize={14} fontWeight={400}>
              {rowEdito.message}
            </Heading>
            {rowEdito.lien && (
              <Button
                as={NextLink}
                href={rowEdito.lien}
                variant={"externalLink"}
                leftIcon={<LinkIcon />}
                textDecoration={"underline"}
              >
                Ouvrir le lien
              </Button>
            )}
            {EDITO.length - 1 !== index && <Divider />}
          </Flex>
        );
      })}
    </Flex>
  );
});
