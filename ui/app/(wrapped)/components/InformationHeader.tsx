import { Box, Button, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import { useChangelog } from "@/app/(wrapped)/changelog/useChangelog";
import { themeDefinition } from "@/theme/theme";

const LOCAL_STORAGE_KEY = "closedChangelogEntries";

export const InformationHeader = () => {
  const [closedEntries, setClosedEntries] = useState<Array<string>>([]);
  const { changelog } = useChangelog();

  const filteredChangelog =
    changelog?.filter(
      (changelogEntry) =>
        changelogEntry.types.findIndex((t) => t.label === "BANDEAU") !== -1 &&
        changelogEntry.show &&
        !closedEntries.includes(changelogEntry.id)
    ) ?? [];

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

  return (
    <VStack>
      {filteredChangelog.map((changelogEntry) => (
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
              fontSize="16px"
              fontWeight={700}
              display={{
                base: "none",
                md: "block",
              }}
            >
              {changelogEntry.description}
              <Link as={NextLink} href="/changelog" textDecoration="underline">
                Voir les détails
              </Link>
            </Text>
            <Text
              fontSize="12px"
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
            <Button
              onClick={() => closeInfo(changelogEntry.id)}
              variant="inline"
              display="flex"
              padding="0"
              flexDirection="row"
              justifyItems="end"
              alignItems="start"
              width="auto"
              height="auto"
            >
              <Icon icon="ri:close-fill" fontSize="16px" />
            </Button>
          </Stack>
        </Box>
      ))}
    </VStack>
  );
};
