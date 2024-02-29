import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
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

const InfoCard = ({
  title,
  description,
  links,
  img,
  sourceText,
}: {
  title: string;
  description: string;
  links: { label?: string; href: string } | { label?: string; href: string }[];
  img: string;
  sourceText?: string;
}) => {
  return (
    <Card bg="grey.1000" padding={"1.5rem"}>
      <CardBody>
        <Flex align="center" height="100%">
          <Flex
            direction="column"
            align="flex-start"
            mr="4"
            flex={1}
            height="100%"
          >
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
                      rel="noreferrer"
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
                rel="noreferrer"
              >
                Accéder à l'information
              </Button>
            )}
            {sourceText && (
              <Text mt="2" fontSize="xs" color="grey">
                {sourceText}
              </Text>
            )}
          </Flex>
          <Img width={["70px", null, "160px"]} src={img} objectFit="contain" />
        </Flex>
      </CardBody>
    </Card>
  );
};

export const LiensUtilesSection = ({
  codeRegion,
  codeDepartement,
}: {
  codeRegion?: string;
  codeDepartement?: string;
}) => {
  codeDepartement = codeDepartement?.startsWith("0")
    ? codeDepartement.substring(1)
    : codeDepartement;

  return (
    <Flex direction={"column"} gap={8} mt={8} maxW={"100%"}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
        Liens utiles
      </Text>
      <Divider width="48px" />
      <Box>
        Les enjeux de demain pour mieux anticiper les formations insérantes :
        accédez ici à une multitude d'informations pour enrichir vos analyses
      </Box>
      <Box pb={12} mt={2} as="section">
        <SimpleGrid spacing={6} columns={[1, null, 2]}>
          {codeRegion && lienDares[codeRegion] && (
            <InfoCard
              title="Projection métiers 2030"
              description="Retrouvez le dernier rapport de votre région"
              links={{ href: (codeRegion && lienDares[codeRegion]) ?? "" }}
              img="/phone_man.png"
              sourceText="* Source: DARES"
            />
          )}
          <InfoCard
            title="Métiers en tension 2021"
            description="Retrouvez le dernier rapport de votre région"
            links={{
              href: "https://dares.travail-emploi.gouv.fr/publication/les-tensions-sur-le-marche-du-travail-en-2021",
            }}
            img="/looking_man.png"
            sourceText="* Source: DARES"
          />
          <InfoCard
            title="Data emploi"
            description="Retrouvez les informations essentielles pour décrypter le marché du travail sur votre territoire"
            links={{
              href: `https://dataemploi.pole-emploi.fr/panorama/${
                codeDepartement ? `DEP/${codeDepartement}` : `REG/${codeRegion}`
              }`,
            }}
            img="/dashboard_girl.png"
            sourceText="* Source: Pole Emploi"
          />
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
