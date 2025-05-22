"use client";

import { Container, Text, VStack } from "@chakra-ui/react";

import { EditorialTitle } from "@/app/(wrapped)/components/EditorialTitle";
import { useAuth } from "@/utils/security/useAuth";

import { Entry } from "./components/Entry";
import { ChangelogTypeEnum, getChangelog } from "./const";

const Page = () => {
  const { auth } = useAuth();
  const updates =
    getChangelog(auth)?.filter(
      (changelogEntry) =>
        changelogEntry.types.findIndex((t) => t === ChangelogTypeEnum.BANDEAU) === -1 &&
        changelogEntry.deployed &&
        changelogEntry.show
    ).sort((a, b) => b.date.getTime() - a.date.getTime()) ?? [];

  const incoming =
    getChangelog(auth)?.filter(
      (changelogEntry) =>
        changelogEntry.types.findIndex((t) => t === ChangelogTypeEnum.BANDEAU) === -1 &&
        !changelogEntry.deployed &&
        changelogEntry.show
    ).sort((a, b) => a.date.getTime() - b.date.getTime()) ?? [];

  return (
    <>
      <Container maxWidth="70%" paddingY="48px">
        <VStack spacing="48px" width="100%">
          <VStack spacing="48px" width="100%">
            <EditorialTitle headingLevel="h1">Mises à jour récentes dans Orion</EditorialTitle>
            <VStack spacing="48px" width="100%">
              { updates.length > 0 &&
                updates.map((changelogEntry) => <Entry key={changelogEntry.title} changelogEntry={changelogEntry} />)}
              {updates.length === 0 && <Text>Aucune donnée de mise à jour disponible.</Text>}
            </VStack>
          </VStack>
          <VStack spacing="48px" width="100%">
            <EditorialTitle headingLevel="h1">Prochainement</EditorialTitle>
            <VStack spacing="48px" width="100%">
              { incoming.length > 0 &&
                incoming.map((changelogEntry) => <Entry key={changelogEntry.title} changelogEntry={changelogEntry} />)}
              {incoming.length === 0 && <Text>Aucune donnée de mise à jour disponible.</Text>}
            </VStack>
          </VStack>
        </VStack>
      </Container>
    </>
  );
};

export default Page;
