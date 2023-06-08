import { ChevronDownIcon } from "@chakra-ui/icons";
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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

const liensDocumentation: Record<string, { label: string; href: string }[]> = {
  84: [
    { label: "Académie de Lyon", href: "/Lyon.pdf" },
    { label: "Académie de Grenoble", href: "/Grenoble.pdf" },
    { label: "Académie de Clermont-Ferrand", href: "/ClermontF.pdf" },
  ],
  11: [
    { label: "Académie de Paris", href: "/Paris.pdf" },
    { label: "Académie de Créteil", href: "/Creteil.pdf" },
    { label: "Académie de Versailles", href: "/Versailles.pdf" },
  ],
  32: [
    { label: "Académie de Amiens", href: "/Amiens.pdf" },
    { label: "Académie de Lille", href: "/Lille.pdf" },
  ],
  75: [
    { label: "Académie de Bordeaux", href: "/Bordeaux.pdf" },
    { label: "Académie de Limoges", href: "/Limoges.pdf" },
    { label: "Académie de Poitiers", href: "/Poitiers.pdf" },
  ],
  93: [
    { label: "Académie de Aix-Marseille", href: "/Aix-Marseille.pdf" },
    { label: "Académie de Nice", href: "/Nice.pdf" },
  ],
  94: [{ label: "Académie de Corse", href: "/Corse.pdf" }],
  76: [
    { label: "Académie de Toulouse", href: "/Toulouse.pdf" },
    { label: "Académie de Montpellier", href: "/Montpellier.pdf" },
  ],
  44: [
    { label: "Académie de Reims", href: "/Reims.pdf" },
    { label: "Académie de Strasbourg", href: "/Strasbourg.pdf" },
    { label: "Académie de Nancy-Metz", href: "/Nancy-Metz.pdf" },
  ],
  28: [{ label: "Académie de Normandie", href: "/Normandie.pdf" }],
  24: [{ label: "Académie de Orléans Tours", href: "/Orléans Tours.pdf" }],
  52: [{ label: "Académie de Nantes", href: "/Nantes.pdf" }],
  27: [{ label: "Académie de Besancon", href: "/Besancon.pdf" }],
  53: [{ label: "Académie de Rennes", href: "/Rennes.pdf" }],
  "03": [{ label: "Académie de Guyane", href: "/Guyane.pdf" }],
  "01": [{ label: "Académie de Guadeloupe", href: "/Guadeloupe.pdf" }],
  "02": [{ label: "Académie de Martinique", href: "/Martinique.pdf" }],
  "04": [{ label: "Académie de La Réunion", href: "/Réunion.pdf" }],
};

const InfoCard = ({
  title,
  description,
  links,
  img,
}: {
  title: string;
  description: string;
  links: { label?: string; href: string } | { label?: string; href: string }[];
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
            {Array.isArray(links) && (
              <Menu>
                <MenuButton
                  mt={4}
                  as={Button}
                  variant="primary"
                  rightIcon={<ChevronDownIcon />}
                >
                  Accéder à l'information
                </MenuButton>
                <MenuList>
                  {links.map(({ href, label }) => (
                    <MenuItem
                      _hover={{ textDecoration: "none" }}
                      as={Link}
                      href={href}
                      key={href}
                      target="_blank"
                    >
                      {label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
            {!Array.isArray(links) && (
              <Button
                mt={4}
                _hover={{ textDecoration: "none" }}
                variant="primary"
                as={Link}
                href={links.href}
                target="_blank"
              >
                Accéder à l'information
              </Button>
            )}
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
            title="Projection métiers 2030"
            description="Retrouvez le dernier rapport de votre région"
            links={{ href: (codeRegion && lienDares[codeRegion]) ?? "" }}
            img="/phone_man.png"
          />
          <InfoCard
            title="Métiers en tension 2021"
            description="Retrouvez le dernier rapport de votre région"
            links={{
              href: "https://dares.travail-emploi.gouv.fr/publication/les-tensions-sur-le-marche-du-travail-en-2021",
            }}
            img="/looking_man.png"
          />
          <InfoCard
            title="Data emploi"
            description="Retrouvez les informations essentielles pour décrypter le marché du travail sur votre territoire"
            links={{
              href: `https://dataemploi.pole-emploi.fr/panorama/REG/${codeRegion}`,
            }}
            img="/dashboard_girl.png"
          />
          <InfoCard
            title="Documentation région voie professionelle"
            description="Retrouvez les informations essentielles pour décrypter les formations sur votre territoire"
            links={
              (codeRegion && liensDocumentation[codeRegion]) || { href: "" }
            }
            img="/team.png"
          />
        </SimpleGrid>
      </Container>
    </>
  );
};
