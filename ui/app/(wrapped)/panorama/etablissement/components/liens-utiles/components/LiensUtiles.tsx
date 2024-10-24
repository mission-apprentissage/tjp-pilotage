import { Box, Divider, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { liensDares } from "@/utils/liensDares";

import { InfoCard } from "../../../../components/InfoCard";
import { AnalyseDetailleeType } from "../../../context/etablissementContext";
import { Filters } from "../../analyse-detaillee/types";

function formatCodeDepartement(codeDepartement: string): string {
  return codeDepartement?.startsWith("0")
    ? codeDepartement.substring(1)
    : codeDepartement;
}

export const LiensUtiles = ({
  analyseDetaillee,
}: {
  analyseDetaillee: AnalyseDetailleeType;
}) => {
  const codeDepartement = formatCodeDepartement(
    analyseDetaillee.etablissement.codeDepartement
  );
  const codeRegion = analyseDetaillee.etablissement.codeRegion;

  const trackEvent = usePlausible();

  const linkTracker = (filterName: keyof Filters | string) => () => {
    trackEvent("analyse-detailee-etablissement:liens-utile", {
      props: { filter_name: filterName },
    });
  };

  return (
    <Flex direction={"column"} gap={8} mt={8} maxW={"100%"} id={"liens-utiles"}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
        Liens utiles
      </Text>
      <Divider width="48px" />
      <Box>
        Les enjeux de demain pour mieux anticiper les formations insérantes :
        accédez ici à une multitude d'informations pour enrichir vos analyses.
      </Box>
      <Box pb={12} mt={2} as="section">
        <SimpleGrid spacing={6} columns={[1, null, 2]}>
          <InfoCard
            title="Data emploi : les métiers"
            description={`Consultez les métiers les plus recherchés par les recruteurs dans votre ${
              codeDepartement ? "département" : "région"
            }`}
            links={{
              href: `https://dataemploi.pole-emploi.fr/metier/${
                codeDepartement ? `DEP/${codeDepartement}` : `REG/${codeRegion}`
              }`,
            }}
            img="/looking_man.png"
            sourceText="* Source: France Travail"
            linkTracker={linkTracker}
          />
          <InfoCard
            title="Data emploi : les secteurs"
            description={`Visualisez les secteurs les plus représentés dans votre ${
              codeDepartement ? "département" : "région"
            }`}
            links={{
              href: `https://dataemploi.pole-emploi.fr/secteur/${
                codeDepartement ? `DEP/${codeDepartement}` : `REG/${codeRegion}`
              }`,
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
  );
};
