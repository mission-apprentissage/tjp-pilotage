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
            <Button mt={4} variant="primary" as={Link} href={href}>
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
            href="google.fr"
            img="phone_man.png"
          />
          <InfoCard
            title="Métier en tension 2022"
            description="Retrouvez le dernier rapport de votre région"
            href="google.fr"
            img="looking_man.png"
          />
          <InfoCard
            title="Data emploi"
            description="Retrouvez les informations essentielles pour décrypter le marché du travail sur votre territoire"
            href={`https://dataemploi.pole-emploi.fr/panorama/REG/${codeRegion}`}
            img="dashboard_girl.png"
          />
          <InfoCard
            title="Documentation région Voie professionelle"
            description="Retrouvez les informations essentielles pour décrypter les formations sur votre territoire"
            href="google.fr"
            img="team.png"
          />
        </SimpleGrid>
      </Container>
    </>
  );
};
