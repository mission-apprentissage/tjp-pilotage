"use client";
import { Container } from "@chakra-ui/react";
import type { ExtendedRecordMap } from "notion-types";

import { Doc } from "@/app/_components/NotionDoc";
import { Breadcrumb } from "@/components/Breadcrumb";

export const revalidate = 60;

export function DocumentationClient({ recordMap }: { readonly recordMap: ExtendedRecordMap }) {
  return (
    <>
      <Container maxW="container.xl" py="4">
        <Breadcrumb
          ml={4}
          pages={[
            { title: "Accueil", to: "/" },
            { title: "Recueil des demandes", to: "/intentions/saisie" },
            {
              title: "Documentation",
              to: "/intentions/saisie/documentation",
              active: true,
            },
          ]}
        />
      </Container>
      <Doc recordMap={recordMap} />
    </>
  );
}
