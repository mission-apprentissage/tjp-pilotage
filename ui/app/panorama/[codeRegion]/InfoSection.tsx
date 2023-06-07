import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Img,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

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

const InfoCard = ({
  title,
  description,
  href,
  img,
}: {
  title: string;
  description: string;
  href: string;
  img: string;
}) => {
  return (
    <Card bg="grey.975">
      <CardBody>
        <Flex align="center">
          <Flex direction="column" align="flex-start" mr="4" flex={1}>
            <Heading as="h4" fontSize={20}>
              {title}
            </Heading>
            <Text flex={1} mt={2}>
              {description}
            </Text>
            <Button
              mt={4}
              variant="primary"
              as={Link}
              href={href}
              target="_blank"
            >
              Accéder à l'information
            </Button>
          </Flex>
          <Img width="160px" src={img} objectFit="contain" />
        </Flex>
      </CardBody>
    </Card>
  );
};

export const InfoSection = ({ codeRegion }: { codeRegion?: string }) => {
  return (
    <>
      <Container as="section" pt="6" maxWidth={"container.xl"}>
        <Box ml="6" mb="4">
          <Heading fontWeight={"hairline"} maxWidth={250} as="h2" mb="4">
            Anticiper les besoins
          </Heading>
          <Box>
            Les enjeux de demain pour mieux anticiper les formations insérantes.
            <br />
            Trouvez ici une multitude d’informations pour venir enrichir vos
            analyses.
          </Box>
        </Box>
      </Container>

      <Container pb={12} mt={2} as="section" maxWidth={"container.xl"}>
        <SimpleGrid spacing={3} columns={[1, null, 2]}>
          <InfoCard
            title="Projection métier 2030"
            description="Retrouvez le dernier rapport de votre région"
            href={(codeRegion && lienDares[codeRegion]) ?? ""}
            img="/phone_man.png"
          />
          <InfoCard
            title="Métier en tension 2022"
            description="Retrouvez le dernier rapport de votre région"
            href="https://dares.travail-emploi.gouv.fr/publication/les-tensions-sur-le-marche-du-travail-en-2021"
            img="/looking_man.png"
          />
          <InfoCard
            title="Data emploi"
            description="Retrouvez les informations essentielles pour décrypter le marché du travail sur votre territoire"
            href={`https://dataemploi.pole-emploi.fr/panorama/REG/${codeRegion}`}
            img="/dashboard_girl.png"
          />
          <InfoCard
            title="Documentation région Voie professionelle"
            description="Retrouvez les informations essentielles pour décrypter les formations sur votre territoire"
            href=""
            img="/team.png"
          />
        </SimpleGrid>
      </Container>
    </>
  );
};
