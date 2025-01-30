"use client";
import { Container } from "@chakra-ui/react";
import type { ExtendedRecordMap } from "notion-types";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Doc } from "@/components/NotionDoc";
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

export const revalidate = 60;

export function DocumentationClient({ recordMap }: { readonly recordMap: ExtendedRecordMap }) {

  const { campagne } = useCurrentCampagne();
  const { auth } = useAuth();


  return (
    <>
      <Container maxW="container.xl" py="4">
        <Breadcrumb
          ml={4}
          pages={[
            { title: "Accueil", to: "/" },
            { title: "Recueil des demandes", to: getRoutingSaisieRecueilDemande({campagne, user: auth?.user}) },
            {
              title: "Documentation",
              to: `${getRoutingSaisieRecueilDemande({campagne, user: auth?.user, suffix: "documentation"})}`,
              active: true,
            },
          ]}
        />
      </Container>
      <Doc recordMap={recordMap} />
    </>
  );
}
