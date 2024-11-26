import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { InfoCard } from "./InfoCard";

const lienDares: Record<string, string> = {
  84: "https://dares.travail-emploi.gouv.fr/publication/auvergne-rhone-alpes-quelles-difficultes-de-recrutement-dici-2030",
  53: "https://dares.travail-emploi.gouv.fr/publication/bretagne-quelles-difficultes-de-recrutement-dici-2030",
  27: "https://dares.travail-emploi.gouv.fr/publication/bourgogne-franche-comte-quelles-difficultes-de-recrutement-dici-2030",
  24: "https://dares.travail-emploi.gouv.fr/publication/centre-val-de-loire-quelles-difficultes-de-recrutement-dici-2030",
  94: "https://dares.travail-emploi.gouv.fr/publication/corse-quelles-difficultes-de-recrutement-dici-2030",
  44: "https://dares.travail-emploi.gouv.fr/publication/grand-est-quelles-difficultes-de-recrutement-dici-2030",
  32: "https://dares.travail-emploi.gouv.fr/publication/hauts-de-france-quelles-difficultes-de-recrutement-dici-2030",
  11: "https://dares.travail-emploi.gouv.fr/publication/ile-de-france-quelles-difficultes-de-recrutement-dici-2030",
  28: "https://dares.travail-emploi.gouv.fr/publication/normandie-quelles-difficultes-de-recrutement-dici-2030",
  75: "https://dares.travail-emploi.gouv.fr/publication/nouvelle-aquitaine-quelles-difficultes-de-recrutement-dici-2030",
  76: "https://dares.travail-emploi.gouv.fr/publication/occitanie-quelles-difficultes-de-recrutement-dici-2030",
  52: "https://dares.travail-emploi.gouv.fr/publication/pays-de-la-loire-quelles-difficultes-de-recrutement-dici-2030",
  93: "https://dares.travail-emploi.gouv.fr/publication/paca-quelles-difficultes-de-recrutement-dici-2030",
};

export const InfoSection = ({ codeRegion, codeDepartement }: { codeRegion?: string; codeDepartement?: string }) => {
  codeDepartement = codeDepartement?.startsWith("0") ? codeDepartement.substring(1) : codeDepartement;

  const trackEvent = usePlausible();

  const linkTracker = (filterName: string) => () => {
    if (codeDepartement) {
      trackEvent("panorama-departement:liens-utile", {
        props: { filter_name: filterName },
      });
    }
    if (codeRegion) {
      trackEvent("panorama-region:liens-utile", {
        props: { filter_name: filterName },
      });
    }
  };

  return (
    <>
      <Box as="section" pt="6" maxWidth={"container.xl"}>
        <Box width={"fit-content"} mb={"32px"}>
          <Heading fontWeight={"bold"} as="h2" fontSize={"28px"}>
            Anticiper les besoins
          </Heading>
          <Box w={"33%"} mt={"16px"}>
            <hr />
          </Box>
        </Box>
        <Box>
          Les enjeux de demain pour mieux anticiper les formations insérantes.
          <br />
          Trouvez ici une multitude d’informations pour venir enrichir vos analyses.
        </Box>
      </Box>

      <Box pb={12} mt={2} as="section" maxWidth={"container.xl"}>
        <SimpleGrid spacing={3} columns={[1, null, 2]}>
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
          {codeRegion && lienDares[codeRegion] && (
            <InfoCard
              title="Projection métiers 2030"
              description="Retrouvez le dernier rapport de votre région"
              links={{ href: (codeRegion && lienDares[codeRegion]) ?? "" }}
              img="/graphs_statistics2.png"
              sourceText="* Source: DARES"
              linkTracker={linkTracker}
            />
          )}
        </SimpleGrid>
      </Box>
    </>
  );
};
