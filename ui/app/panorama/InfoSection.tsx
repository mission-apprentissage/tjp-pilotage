import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Center,
  Container,
  Heading,
  Link,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

const InfoCard = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) => {
  return (
    <Card bg="#fbf6ed">
      <CardBody>
        <Heading as="h4" fontSize={18}>
          {title}
        </Heading>
        <Box mt={4}>{description}</Box>
        <Box textAlign="right" mt={2}>
          <Link fontWeight="bold" color="bluefrance.113" href={href}>
            Accéder à l'information <ExternalLinkIcon />
          </Link>
        </Box>
      </CardBody>
    </Card>
  );
};

export const InfoSection = ({ codeRegion }: { codeRegion?: string }) => {
  return (
    <>
      <Container as="section" pt="12" maxWidth={"container.xl"}>
        <Heading fontWeight={"hairline"} maxWidth={250} as="h2" ml="6" mb={12}>
          Anticiper les besoins
        </Heading>
        <Box>
          Les enjeux de demain pour mieux anticiper les formations insérantes.
        </Box>
      </Container>

      <Container pb={12} mt={2} as="section" maxWidth={"container.xl"}>
        <Stack direction={["column", "row"]} spacing="16">
          <Center height={""} bg="#fbf6ed" flex={1}>
            iamge
          </Center>
          <Box flex={1}>
            <SimpleGrid spacing={3} columns={[1, null, 2]}>
              <InfoCard
                title="Projection métier 2030"
                description="Retrouvez le dernier rapport de votre région"
                href="google.fr"
              />
              <InfoCard
                title="Métier en tension 2022"
                description="Retrouvez le dernier rapport de votre région"
                href="google.fr"
              />
              <InfoCard
                title="Data emploi"
                description="Retrouvez les informations essentielles pour décrypter le marché du travail sur votre territoire"
                href={`https://dataemploi.pole-emploi.fr/panorama/REG/${codeRegion}`}
              />
              <InfoCard
                title="Trajectoire Pro"
                description="Retrouver les indicateurs et informations sur les formations porteuses et les métiers en tension"
                href="google.fr"
              />
            </SimpleGrid>
          </Box>
        </Stack>
      </Container>
    </>
  );
};
