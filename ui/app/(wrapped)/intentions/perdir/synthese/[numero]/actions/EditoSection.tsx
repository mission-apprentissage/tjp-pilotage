"use client";

import { LinkIcon } from "@chakra-ui/icons";
import { Button, chakra, Divider, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

import { client } from "@/api.client";
import { STICKY_OFFSET } from "@/app/(wrapped)/intentions/perdir/SCROLL_OFFSETS";

import { SyntheseSpinner } from "../components/SyntheseSpinner";

export const EditoSection = chakra(() => {
  const { data: editoContent, isLoading } = client
    .ref("[GET]/edito")
    .useQuery({}, { cacheTime: 0 });

  if (isLoading) return <SyntheseSpinner />;
  if (editoContent?.length === 0) return <></>;

  return (
    <Flex
      direction={"column"}
      gap={3}
      bgColor={"white"}
      borderRadius={6}
      p={6}
      top={STICKY_OFFSET}
      position={"sticky"}
    >
      <Heading as="h2" fontSize={18} fontWeight={700} mb={4}>
        Edito
      </Heading>
      {editoContent?.map((rowEdito, index) => {
        return (
          <Flex direction={"column"} gap={2} key={rowEdito.id}>
            <Heading as="h3" fontSize={16} fontWeight={700}>
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
              >
                Lien
              </Button>
            )}
            {editoContent.length - 1 !== index && <Divider />}
          </Flex>
        );
      })}
    </Flex>
  );
});
