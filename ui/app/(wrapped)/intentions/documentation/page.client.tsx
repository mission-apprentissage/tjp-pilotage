"use client";
import { Container } from "@chakra-ui/react";
import { ExtendedRecordMap } from "notion-types";

import { Doc } from "@/app/_components/NotionDoc";
import { Breadcrumb } from "@/components/Breadcrumb";

export const revalidate = 60;

export function DocumentationClient({
  recordMap,
}: {
  recordMap: ExtendedRecordMap;
}) {
  return (
    <>
      <Container maxW="container.xl" py="4">
        <Breadcrumb
          ml={4}
          pages={[
            { title: "Accueil", to: "/" },
            { title: "Recueil des demandes", to: "/intentions" },
            {
              title: "Documentation",
              to: "/intentions/documentation",
              active: true,
            },
          ]}
        />
      </Container>
      <Doc recordMap={recordMap} />
    </>
  );
}
