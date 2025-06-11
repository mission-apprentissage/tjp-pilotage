import { Box, CloseButton, Link, Stack, Text, VisuallyHidden, VStack } from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import { getChangelog } from '@/app/(wrapped)/changelog/const';
import { themeDefinition } from "@/theme/theme";
import { useAuth } from '@/utils/security/useAuth';

const LOCAL_STORAGE_KEY = "closedChangelogEntries";

export const InformationHeader = () => {
  const [closedEntries, setClosedEntries] = useState<Array<string>>([]);
  const { auth } = useAuth();

  const filteredChangelog =
    getChangelog(auth).filter(
      (changelogEntry) =>
        changelogEntry.types.findIndex((t) => t === "BANDEAU") !== -1 &&
        changelogEntry.show &&
        !closedEntries.includes(changelogEntry.id)
    ).sort((a,b) => b.date.getTime() - a.date.getTime()) ?? [];

  useEffect(() => {
    if (closedEntries.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(closedEntries));
    }
  }, [closedEntries]);

  useEffect(() => {
    if (localStorage) {
      const storedEntries = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]");
      setClosedEntries(storedEntries);
    }
  }, [setClosedEntries]);

  function closeInfo(id: string) {
    if (!closedEntries.includes(id)) {
      setClosedEntries([...closedEntries, id]);
    }
  }

  const changelogEntry = filteredChangelog[0];

  if (!changelogEntry) return <></>;

  return (
    <VStack>
      <Box
        backgroundColor={themeDefinition.colors.info[950]}
        color={themeDefinition.colors.info.text}
        width="100%"
        paddingY="12px"
        key={`${changelogEntry.title}`}
      >
        <Stack
          maxWidth={"container.xl"}
          margin="auto"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          flexWrap="nowrap"
          spacing="16px"
          padding="4px 8px"
        >
          <Icon icon="ri:information-fill" fontSize="24px" />
          <Text
            flexGrow={1}
            fontSize={16}
            fontWeight={700}
            display={{
              base: "none",
              md: "block",
            }}
          >
            {changelogEntry.description}{" "}
            <Link as={NextLink} href="/changelog" textDecoration="underline">
                Voir les détails
            </Link>
          </Text>
          <Text
            fontSize={12}
            display={{
              base: "block",
              md: "none",
            }}
          >
              Une nouvelle mise à jour a été déployée.{" "}
            <Link as={NextLink} href="/changelog" textDecoration="underline">
                Voir les détails
            </Link>
          </Text>
          <CloseButton
            onClick={() => closeInfo(changelogEntry.id)}
            variant="inline"
            display="flex"
            padding="0"
            flexDirection="row"
            justifyItems="end"
            alignItems="start"
            width="auto"
            h={"fit-content"}
            mb={"auto"}
          >
            <VisuallyHidden fontSize={12}>Fermer</VisuallyHidden>
            <Icon icon="ri:close-fill" fontSize={16} />
          </CloseButton>
        </Stack>
      </Box>
    </VStack>
  );
};
