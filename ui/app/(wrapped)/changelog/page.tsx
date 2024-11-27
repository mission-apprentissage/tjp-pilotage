"use client";

import { Container, Text, VStack } from "@chakra-ui/react";

import { EditorialTitle } from "@/app/(wrapped)/components/EditorialTitle";

import { Entry } from "./components/Entry";
import { EntryLoader } from "./components/EntryLoader";
import { useChangelog } from "./useChangelog";

export default function Changelog() {
  const { changelog } = useChangelog();

  const isLoading = typeof changelog === "undefined";

  const updates =
    changelog?.filter(
      (changelogEntry) =>
        changelogEntry.types.findIndex((t) => t.label === "BANDEAU") === -1 &&
        changelogEntry.deployed &&
        changelogEntry.show
    ) ?? [];

  const incoming =
    changelog?.filter(
      (changelogEntry) =>
        changelogEntry.types.findIndex((t) => t.label === "BANDEAU") === -1 &&
        !changelogEntry.deployed &&
        changelogEntry.show
    ) ?? [];

  return (
    <>
      <Container maxWidth="70%" paddingY="48px">
        <VStack spacing="48px" width="100%">
          <VStack spacing="48px" width="100%">
            <EditorialTitle>Mises à jour récentes dans Orion</EditorialTitle>
            <VStack spacing="48px" width="100%">
              {isLoading && <EntryLoader />}
              {!isLoading &&
                updates.length > 0 &&
                updates.map((changelogEntry) => <Entry key={changelogEntry.title} changelogEntry={changelogEntry} />)}
              {updates.length === 0 && !isLoading && <Text>Aucune donnée de mise à jour disponible.</Text>}
            </VStack>
          </VStack>
          <VStack spacing="48px" width="100%">
            <EditorialTitle>Prochainement</EditorialTitle>
            <VStack spacing="48px" width="100%">
              {isLoading && <EntryLoader />}
              {!isLoading &&
                incoming.length > 0 &&
                incoming.map((changelogEntry) => <Entry key={changelogEntry.title} changelogEntry={changelogEntry} />)}
              {incoming.length === 0 && !isLoading && <Text>Aucune donnée de mise à jour disponible.</Text>}
            </VStack>
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
