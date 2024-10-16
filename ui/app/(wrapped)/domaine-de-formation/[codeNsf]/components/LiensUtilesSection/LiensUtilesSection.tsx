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
import { Scope, ScopeEnum } from "shared";

import { liensDares } from "@/utils/liensDares";

import { InfoCard } from "../../../../panorama/components/InfoCard";
import { Filters } from "../../types";

const useLiensUtilesSection = () => {
  const trackEvent = usePlausible();

  const linkTracker = (filterName: string) => () => {
    trackEvent("panorama-formation:liens-utile", {
      props: { filter_name: filterName },
    });
  };

  return {
    linkTracker,
  };
};

function formatCodeDepartement(codeDepartement: string): string {
  return codeDepartement?.startsWith("0")
    ? codeDepartement.substring(1)
    : codeDepartement;
}

export const LiensUtilesSection = ({
  filters,
  scope,
}: {
  filters: Filters;
  scope: Scope;
}) => {
  const { codeRegion, codeDepartement } = filters;
  const { linkTracker } = useLiensUtilesSection();

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
                  [ScopeEnum.national]: `Consultez les métiers les plus recherchés par les recruteurs au niveau national`,
                  [ScopeEnum.département]: `Consultez les métiers les plus recherchés par les recruteurs dans votre département`,
                  [ScopeEnum.région]: `Consultez les métiers les plus recherchés par les recruteurs dans votre région`,
                  [ScopeEnum.académie]: `Consultez les métiers les plus recherchés par les recruteurs dans votre région`,
                }[scope]
              }
              links={{
                href: {
                  [ScopeEnum.national]:
                    "https://dataemploi.francetravail.fr/emploi/metier/NAT/FR",
                  [ScopeEnum.département]: `https://dataemploi.francetravail.fr/metier/DEP/${formatCodeDepartement(
                    codeDepartement!
                  )}`,
                  [ScopeEnum.région]: `https://dataemploi.francetravail.fr/emploi/metier/REG/${codeRegion}`,
                  [ScopeEnum.académie]: `https://dataemploi.francetravail.fr/metier/REG/${codeRegion}`,
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
                  [ScopeEnum.national]: `Visualisez les secteurs les plus représentés au niveau national`,
                  [ScopeEnum.département]: `Visualisez les secteurs les plus représentés dans votre département`,
                  [ScopeEnum.région]: `Visualisez les secteurs les plus représentés dans votre région`,
                  [ScopeEnum.académie]: `Visualisez les secteurs les plus représentés dans votre région`,
                }[scope]
              }
              links={{
                href: {
                  [ScopeEnum.national]:
                    "https://dataemploi.francetravail.fr/emploi/ajouter-territoire",
                  [ScopeEnum.département]: `https://dataemploi.pole-emploi.fr/secteur/DEP/${formatCodeDepartement(
                    codeDepartement!
                  )}`,
                  [ScopeEnum.région]: `https://dataemploi.pole-emploi.fr/secteur/REG/${codeRegion}`,
                  [ScopeEnum.académie]: `https://dataemploi.pole-emploi.fr/secteur/REG/${codeRegion}`,
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
