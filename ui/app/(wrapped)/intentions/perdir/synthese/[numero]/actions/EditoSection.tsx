"use client";

import { LinkIcon } from "@chakra-ui/icons";
import { Button, chakra, Divider, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

import { client } from "@/api.client";
import { STICKY_OFFSET } from "@/app/(wrapped)/intentions/perdir/SCROLL_OFFSETS";
import { SyntheseSpinner } from "@/app/(wrapped)/intentions/perdir/synthese/[numero]/components/SyntheseSpinner";

export const EditoSection = chakra(() => {
  const { data: editoContent, isLoading } = client.ref("[GET]/edito").useQuery({}, { cacheTime: 0 });

  if (isLoading) return <SyntheseSpinner />;
  if (editoContent?.length === 0) return <></>;

  return (
    <Flex direction={"column"} gap={4} bgColor={"white"} borderRadius={6} p={6} top={STICKY_OFFSET} position={"sticky"}>
      <Heading as="h2" fontSize={18} fontWeight={700}>
        Actualités
      </Heading>
      <Divider />
      {editoContent?.map(
        // @ts-expect-error TODO
        (rowEdito, index) => {
          return (
            <Flex direction={"column"} gap={2} key={rowEdito.id}>
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
              {editoContent.length - 1 !== index && <Divider />}
            </Flex>
          );
        }
      )}
    </Flex>
  );
});
