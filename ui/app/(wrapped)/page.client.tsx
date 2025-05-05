"use client";

import {
  Accordion,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Img,
  Link,
  ListItem,
  Stack,
  Tag,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { themeDefinition } from "@/theme/theme";
import { useAuth } from "@/utils/security/useAuth";

import { AnimatedNumber } from "./components/AnimatedNumber";
import { Card } from "./components/Card";
import { EditorialTitle } from "./components/EditorialTitle";
import { Hero } from "./components/Hero";
import { LandingAccordionItem } from "./components/LandingAccordionItem";

export const PageClient = () => {
  const nombreFormations = 501;
  const nombreEtablissements = 2952;
  const nombreEleves = 808209;
  const tauxDInsertion = 41;
  const nombrePlacesDeFormation = 2595;

  const { auth } = useAuth();

  return (
    <Box zIndex="0" mb={20}>
      <Box overflow="hidden">
        <Hero>
          <VStack paddingTop="64px" spacing="32px" width={{ base: "90%", lg: "60%" }} margin="auto">
            <VStack as="header" textAlign="center" spacing="8px">
              <Tag
                size="sm"
                backgroundColor={themeDefinition.colors.info[950]}
                color={themeDefinition.colors.info.text}
                fontWeight={700}
              >
                <HStack alignItems="center" spacing="4px">
                  <Icon icon="ri:barricade-fill" fontSize={12} />
                  <Text as="span" fontSize={14} fontWeight={700} lineHeight="24px">
                    OUTIL EN CONSTRUCTION
                  </Text>
                </HStack>
              </Tag>
              <Heading as="h1" fontSize={{ base: "28px", md: "40px" }}>
                Orion : améliorer le parcours vers l’emploi <br />
                des élèves de la voie professionnelle
              </Heading>
              <Text fontSize={16} display={{ base: "none", md: "block" }} padding="16px 16px 0 16px">
                Orion est une plateforme commune à tous les acteurs de la carte des formations des lycées
                professionnels. Elle vous donne accès aux principales données éducatives de ces formations et aux
                indicateurs InserJeunes (taux d’emploi à 6 mois, taux de poursuite d’études...) afin d’améliorer le
                devenir des élèves, vers l’emploi ou la poursuite d’une formation.
              </Text>
              <Flex margin="auto" marginTop="12px" padding="20px" gap={2}>
                {!auth && (
                  <Link
                    href="/auth/login"
                    textDecoration="none"
                    padding="6px 12px"
                    borderColor={themeDefinition.colors.bluefrance[113]}
                    borderWidth="1px"
                    _hover={{
                      bg: themeDefinition.colors.grey[1000],
                      _disabled: { bg: "white" },
                    }}
                  >
                    Se connecter
                  </Link>
                )}
                <Link
                  href="/console/formations"
                  textDecoration="none"
                  padding="6px 12px"
                  backgroundColor={themeDefinition.colors.bluefrance[113]}
                  borderColor={themeDefinition.colors.bluefrance[113]}
                  color="white"
                  borderWidth="1px"
                  _hover={{
                    bg: themeDefinition.colors.bluefrance[525],
                  }}
                >
                    Explorer les données
                </Link>
              </Flex>
            </VStack>
            <HStack justifyContent="center">
              <Box
                height={{ base: "20vw", xl: "15vw" }}
                width="90%"
                overflow="hidden"
                boxShadow="0px 0px 10px rgba(0,0,0,0.16)"
                borderRadius="8px 8px 0px 0px"
              >
                <Img src="/capture-accueil.png" alt=""/>
              </Box>
            </HStack>
          </VStack>
        </Hero>
      </Box>
      <Stack
        direction={{
          base: "column",
          lg: "row",
        }}
        justifyContent="center"
        alignItems={{
          base: "center",
          lg: "start",
        }}
        paddingY="32px"
        spacing="24px"
      >
        <Card
          icon={<Img src="/illustrations/data-visualization.svg" alt="" />}
          title="Analyser et comparer"
          link="Voir le panorama"
          linkHref="/panorama"
        >
          <Text>
            Repérer en un coup d’oeil les formations offrant un devenir favorable (emploi ou poursuite d’études) :
            lesquelles sont attractives, insérantes, ... ?
          </Text>
        </Card>
        <Card
          icon={<Img src="/illustrations/school.svg" alt="" />}
          title="Explorer les données"
          link="Voir la console"
          linkHref="/console/formations"
        >
          <Text>
            Consulter toutes les données disponibles sur les établissements et formations, par filière et par zone
            géographique (taux de pression, évolution des effectifs…)
          </Text>
        </Card>
        <Card
          icon={<Img src="/illustrations/location-france.svg" alt="" />}
          title="Transformer la carte"
          link="Se connecter"
          linkHref="/auth/login"
        >
          <Text>
            Recueillir et suivre les demandes d’ouverture ou fermeture de places (accès réservé aux utilisateurs
            habilités)
          </Text>
        </Card>
      </Stack>
      <Hero variant="white">
        <Box paddingY="64px">
          <VStack spacing="48px">
            <EditorialTitle headingLevel="h2">La voie professionnelle initiale scolaire en 2023</EditorialTitle>
            <Stack
              alignItems="start"
              justifyContent="center"
              spacing="24px"
              direction={{ base: "column", md: "row" }}
              flexWrap="wrap"
              paddingX={{
                base: "0",
                md: "16px",
              }}
            >
              <AnimatedNumber
                from={0}
                to={nombreFormations}
                NumberLabel={({ number }) => number}
                subtitle="formations"
                animateOnViewportEnter
                duration={1000}
              />
              <AnimatedNumber
                from={0}
                to={nombreEtablissements}
                NumberLabel={({ number }) => number}
                subtitle="établissements"
                animateOnViewportEnter
                duration={1000}
              />
              <AnimatedNumber
                from={0}
                to={nombreEleves}
                NumberLabel={({ number }) => number}
                subtitle="élèves"
                animateOnViewportEnter
                duration={1000}
              />
              <AnimatedNumber
                from={0}
                to={nombrePlacesDeFormation}
                NumberLabel={({ number }) => `+ ${number}`}
                subtitle="places de formations prévues pour la rentrée scolaire 2024"
                animateOnViewportEnter
                duration={1000}
              />
              <AnimatedNumber
                from={0}
                to={tauxDInsertion}
                NumberLabel={({ number }) => `${number}%`}
                subtitle="d’insertion dans l’emploi 6 mois après l’obtention du Bac professionnel"
                animateOnViewportEnter
                duration={1000}
              />
            </Stack>
          </VStack>
        </Box>
      </Hero>
      <Container maxWidth={"container.xl"} px={0}>
        <VStack paddingY="64px" spacing="48px" paddingX="24px">
          <EditorialTitle headingLevel="h2">À propos d'Inserjeunes</EditorialTitle>
          <Stack
            direction={{
              base: "column",
              lg: "row",
            }}
          >
            <HStack
              width={{
                base: "100%",
                lg: "50%",
              }}
              paddingBottom={{
                base: "16px",
                lg: "0px",
              }}
              justifyContent="center"
            >
              <Img src="/illustrations/mission-inserjeunes.svg" alt="" />
            </HStack>
            <VStack
              alignItems="start"
              width={{
                base: "100%",
                lg: "50%",
              }}
              gap="16px"
            >
              <Text>
                InserJeunes est un <b>dispositif statistique interministériel</b>, instauré par la loi « pour la liberté
                de choisir son avenir professionnel » de septembre 2018.
              </Text>
              <Text>
                Il est construit par <b>rapprochement de bases administratives relatives à la scolarité</b> (remontées
                administratives des inscriptions) et à <b>l’emploi</b> (notamment la déclaration sociale nominative des
                entreprises).
              </Text>
              <Text>
                Ces données publiées à partir de <b>début 2021</b> apportent un degré de{" "}
                <b>précision et de robustesse</b> que ne permettaient pas les précédentes données issues d’enquêtes.
              </Text>
            </VStack>
          </Stack>
        </VStack>
      </Container>
      <VStack paddingY="64px" spacing="48px">
        <EditorialTitle headingLevel="h2">Questions fréquentes</EditorialTitle>
        <Box width="70%">
          <Accordion allowMultiple>
            <VStack width="100%" spacing="16px">
              <LandingAccordionItem label="Pourquoi est-ce que je ne retrouve pas toutes mes formations dans Orion ?">
                Orion recense toutes les formations de la voie professionnelle initiale, dispensées en lycées
                professionnels et lycées polyvalents. Toutefois, pour certaines formations, il n’y a pas de taux
                d’emploi et de poursuite d’études : il n’est donc pas possible de les afficher dans les visualisations
                basées sur ces indicateurs. C’est le cas des formations dont l’effectif est trop faible (&lt;20) ou qui
                ont été rénovées.
              </LandingAccordionItem>
              <LandingAccordionItem label="Pourquoi une formation affiche-t-elle un taux d’emploi plus faible que celui des précédentes enquêtes IVA ?">
                Le taux d’emploi est désormais calculé sur la base des déclarations des entreprises (donnée
                administrative vérifiée), il est souvent plus faible que le taux précédemment calculé à partir des
                enquêtes IVA. En effet, tous les jeunes ne répondaient pas à l’enquête, cette non-réponse pouvait donc
                induire un biais sur le taux d’emploi estimé, les jeunes sans emploi étant sans doute moins enclins à
                répondre à l’enquête.
              </LandingAccordionItem>
              <LandingAccordionItem label="Pourquoi une formation qui mène vers un métier d’avenir est-elle en Q4 du quadrant ?">
                Il peut y avoir plusieurs explications, parmi lesquelles :
                <UnorderedList spacing="6px" padding="6px">
                  <ListItem>la formation accueille un public spécifique en fragilité</ListItem>
                  <ListItem>la poursuite d’études n’est pas accessible sur le territoire</ListItem>
                  <ListItem>il y a peu d’opportunités d’emploi sur le territoire</ListItem>
                  <ListItem>la formation n’est pas adaptée aux besoins des entreprises locales</ListItem>
                  <ListItem>le territoire est transfrontalier et les jeunes travaillent à l’étranger</ListItem>
                  <ListItem>
                    les situations d’emploi étant observées à 6 mois après la sortie de formation (janvier), certains
                    emplois saisonniers ne sont pas pris en compte
                  </ListItem>
                </UnorderedList>
              </LandingAccordionItem>
              <LandingAccordionItem label="Pourquoi n’y a-t-il pas de taux de pression sur certaines formations ?">
                Si la capacité théorique ou les vœux d’une formation ne sont pas renseignés dans Affelnet, le taux de
                pression ne peut être calculé.
              </LandingAccordionItem>
            </VStack>
          </Accordion>
        </Box>
      </VStack>
    </Box>
  );
};
