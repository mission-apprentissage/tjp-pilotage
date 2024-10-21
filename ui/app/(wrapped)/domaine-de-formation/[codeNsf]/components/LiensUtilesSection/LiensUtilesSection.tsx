"use client";

import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { liensDares } from "@/utils/liensDares";

import { InfoCard } from "../../../../panorama/components/InfoCard";

const useLiensUtilesSection = () => {
  const trackEvent = usePlausible();

  const scope: "national" | "departement" | "region" | "academie" = "national";

  // TODO: get codeRegion and codeDepartement from url
  const codeRegion = "00";
  const codeDepartement = "00";

  const linkTracker = (filterName: string) => () => {
    trackEvent("panorama-formation:liens-utile", {
      props: { filter_name: filterName },
    });
  };

  return {
    scope,
    codeRegion,
    codeDepartement,
    linkTracker,
  };
};

export const LiensUtilesSection = () => {
  const { scope, codeRegion, codeDepartement, linkTracker } =
    useLiensUtilesSection();

  return (
    <Container maxW={"container.xl"} as="section">
      <Flex
        direction={"column"}
        gap={8}
        mt={8}
        maxW={"100%"}
        id={"liens-utiles"}
      >
        <Heading as="h2">Liens utiles</Heading>
        <Divider width="48px" />
        <Box>
          Les enjeux de demain pour mieux anticiper les formations insérantes :
          accédez ici à une multitude d'informations pour enrichir vos analyses.
        </Box>
        <Box pb={12} mt={2} as="section">
          <SimpleGrid spacing={6} columns={[1, null, 2]}>
            <InfoCard
              title="Data emploi : les métiers"
              description={
                {
                  national: `Consultez les métiers les plus recherchés par les recruteurs au niveau national`,
                  departement: `Consultez les métiers les plus recherchés par les recruteurs dans votre département`,
                  region: `Consultez les métiers les plus recherchés par les recruteurs dans votre région`,
                  academie: `Consultez les métiers les plus recherchés par les recruteurs dans votre région`,
                }[scope]
              }
              links={{
                href: {
                  national:
                    "https://dataemploi.francetravail.fr/emploi/metier/NAT/FR",
                  departement: `https://dataemploi.francetravail.fr/metier/DEP/${codeDepartement}`,
                  region: `https://dataemploi.francetravail.fr/emploi/metier/REG/${codeRegion}`,
                  academie: `https://dataemploi.francetravail.fr/metier/REG/${codeRegion}`,
                }[scope],
              }}
              img="/looking_man.png"
              sourceText="* Source: France Travail"
              linkTracker={linkTracker}
            />
            <InfoCard
              title="Data emploi : les secteurs"
              description={
                {
                  national: `Visualisez les secteurs les plus représentés au niveau national`,
                  departement: `Visualisez les secteurs les plus représentés dans votre département`,
                  region: `Visualisez les secteurs les plus représentés dans votre région`,
                  academie: `Visualisez les secteurs les plus représentés dans votre région`,
                }[scope]
              }
              links={{
                href: {
                  national:
                    "https://dataemploi.francetravail.fr/emploi/ajouter-territoire",
                  departement: `https://dataemploi.pole-emploi.fr/secteur/DEP/${codeDepartement}`,
                  region: `https://dataemploi.pole-emploi.fr/secteur/REG/${codeRegion}`,
                  academie: `https://dataemploi.pole-emploi.fr/secteur/REG/${codeRegion}`,
                }[scope],
              }}
              img="/dashboard_girl.png"
              sourceText="* Source: France Travail"
              linkTracker={linkTracker}
            />
            {codeRegion && liensDares[codeRegion] && (
              <InfoCard
                title="Projection métiers 2030"
                description="Retrouvez le dernier rapport de votre région"
                links={{ href: (codeRegion && liensDares[codeRegion]) ?? "" }}
                img="/graphs_statistics2.png"
                sourceText="* Source: DARES"
                linkTracker={linkTracker}
              />
            )}
          </SimpleGrid>
        </Box>
      </Flex>
    </Container>
  );
};
