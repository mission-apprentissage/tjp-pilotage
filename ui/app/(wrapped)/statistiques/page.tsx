"use client";

import { Box, Container, Flex, HStack, Link, ListItem, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, UnorderedList, useColorModeValue, VStack } from "@chakra-ui/react";
import { Icon, Icon as IconifyIcon } from "@iconify/react";

import { DSFRH3 } from "@/app/(wrapped)/components/DSFR/H3";
import { DSFRH6 } from "@/app/(wrapped)/components/DSFR/H6";
import { DSFRParagraph } from "@/app/(wrapped)/components/DSFR/Paragraph";
import { Callout } from "@/components/Callout";

export default function Statistiques() {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing="48px" align="stretch">
        <VStack align="stretch">
          <HStack>
            <IconifyIcon icon="ri:line-chart-line" height={32} width={32} />
            <DSFRH3 as="h1">
          Statistiques Orion
            </DSFRH3>
          </HStack>

          <Text color="gray.500" fontSize="sm" textDecoration={"italic"}>
          Mise à jour : Janvier 2025
          </Text>
        </VStack>

        <Box>
          <DSFRH6 as="h2">
            Notre ambition
          </DSFRH6>
          <DSFRParagraph mb={6}>Orion a pour ambition d'aider <Text as="span" fontWeight="bold">à améliorer le parcours vers l'emploi</Text> des élèves de la voie professionnelle, notamment en participant à :</DSFRParagraph>
          <UnorderedList spacing={1} pl={8}>
            <ListItem>
              <DSFRParagraph>
                Augmenter la part des élèves dans les formations menant à
                &nbsp;<Text as="span" fontWeight="bold">des métiers d'avenir</Text>
                &nbsp;(<Link href="https://www.strategie.gouv.fr/publications/metiers-2030" color="blue.500" isExternal>France Stratégie</Link>)
              </DSFRParagraph>
            </ListItem>
            <ListItem>
              <DSFRParagraph>
              Diminuer la part des élèves dans les <Text as="span" fontWeight="bold">formations peu insérantes</Text>
              </DSFRParagraph>
            </ListItem>
            <ListItem>
              <DSFRParagraph>
                Augmenter les <Text as="span" fontWeight="bold">taux d'emploi</Text> en sortie de voie professionnelle scolaire
              </DSFRParagraph>
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Exposition des données
          </DSFRH6>
          <DSFRParagraph>
            Orion aide à l'analyse en mettant à disposition de tous des <Text as="span" fontWeight="bold">données fiables et exhaustives</Text>.
            &nbsp;Nos travaux ont notamment permis d'augmenter les taux de couverture des indicateurs Inserjeunes : <Text as="span" fontWeight="bold">soit un gain de +18%.</Text>
          </DSFRParagraph>
          <TableContainer pt={4}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th py={4}>Taux de couverture moyens des effectifs au niveau régional</Th>
                  <Th py={4}>Avant</Th>
                  <Th py={4}>Dans Orion</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td py={4}>Taux d'emploi à 6 mois</Td>
                  <Td py={4}>69%</Td>
                  <Td py={4}>87%</Td>
                </Tr>
                <Tr>
                  <Td py={4}>Taux de poursuite d'études</Td>
                  <Td py={4}>72%</Td>
                  <Td py={4}>90%</Td>
                </Tr>
                <Tr>
                  <Td py={4}>Taux de devenir favorable</Td>
                  <Td py={4}>72%</Td>
                  <Td py={4}>90%</Td>
                </Tr>
                <Tr>
                  <Td py={4}>Taux de pression*</Td>
                  <Td py={4}></Td>
                  <Td py={4}>92%</Td>
                </Tr>
                <Tr>
                  <Td py={4}>Taux de remplissage</Td>
                  <Td py={4}></Td>
                  <Td py={4}>78%</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Text fontSize="sm" color="gray.500" mt={2}>* Hors BTS et lycées privés sous contrat</Text>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Pilotage régional et national
          </DSFRH6>
          <DSFRParagraph>
            Orion met à disposition des interfaces dédiées à la collecte régionale des projets d'ouverture, de coloration et de fermeture de places de formation.
          </DSFRParagraph>
          <VStack align="stretch" spacing={4}>
            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:binoculars" width="24px" height="24px" />
                <Text>
                  Plus de <Text as="span" fontWeight="bold">4000 projets</Text> de transformation centralisés lors des campagnes 2023 et 2024, et mis en visibilité grâce à des <Text as="span" fontWeight="bold">data visualisations spécifiques</Text>
                </Text>
              </Flex>
            } />

            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="ri:suitcase-line" width="24px" height="24px" />
                <Text as="span" fontWeight="bold">3 670 nouvelles places prévues</Text> en 2024 par rapport aux effectifs 2023
              </Flex>
            } />

            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="ri:reactjs-line" width="24px" height="24px" />
                <Text>
                Un taux de transformation cumulé prévu à <Text as="span" fontWeight="bold">plus de 10% des effectifs</Text> sur les 2 années
                </Text>
              </Flex>
            } />

          </VStack>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Utilisation en hausse
          </DSFRH6>
          <Text mb={4}>Orion est un outil de plus en plus utilisé :</Text>
          <VStack align="stretch" spacing={4}>
            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:plug" width="24px" height="24px" />
                <Text>
                  <Text as="span" fontWeight="bold">Plus de 53000</Text> visites cumulées entre juin 2023 et janvier 2025 (vs. 15 000 en janvier 2024)
                </Text>
              </Flex>
            } />

            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:clock" width="24px" height="24px" />
                <Text>
                  Plus de <Text as="span" fontWeight="bold">8 minutes</Text> en moyenne à chaque visite
                </Text>
              </Flex>
            } />

            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:clock" width="24px" height="24px" />
                <Text>
                  Une base utilisateurs qui s'est étendue en 2024 avec <Text as="span" fontWeight="bold">plus de la moitié des chefs d'établissement</Text> s'étant connectés à Orion
                </Text>
              </Flex>
            } />
          </VStack>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Retours utilisateurs positifs
          </DSFRH6>
          <Text mt={6} mb={4}>…et plébiscité par ses utilisateurs réguliers*</Text>
          <VStack align="stretch" spacing={4}>
            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:clock" width="24px" height="24px" />
                <Text>
                  <Text as="span" fontWeight="bold">82%</Text> des utilisateurs ont <Text as="span" fontWeight="bold">gagné du temps</Text> (accès facilité aux données, gestion des demandes…), ce qui représente un <Text as="span" fontWeight="bold">coût évité</Text> pour les administrations
                </Text>
              </Flex>
            } />

            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:eye" width="24px" height="24px" />
                <Text>
                  <Text as="span" fontWeight="bold">77%</Text> ont pris <Text as="span" fontWeight="bold">au moins une décision</Text> d'ouverture ou fermeture de places à l'aide des indicateurs fournis par Orion
                </Text>
              </Flex>
            } />

            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:gavel" width="24px" height="24px" />
                <Text>
                  <Text as="span" fontWeight="bold">82%</Text> estiment qu'Orion a permis de <Text as="span" fontWeight="bold">faire évoluer les critères</Text> de décision de transformation
                </Text>
              </Flex>
            } />
          </VStack>
          <Text fontSize="sm" color="gray.500" mt={2}>*enquête utilisateurs décembre 2024</Text>

          <Box mt={8} p={4}>
            <Stack direction={{ base: "column", md: "row" }}>
              <Text fontStyle="italic" fontWeight="bold" flex={1} px={2} textAlign="center">"Un outil ergonomique et intégrateur de données de qualité. Très pratique. Il pourrait devenir l'outil unique de référence"</Text>
              <Text fontStyle="italic" fontWeight="bold" flex={1} px={2} textAlign="center">"Un outil partagé qui agrège un ensemble de données utiles et indispensables pour le pilotage"</Text>
              <Text fontStyle="italic" fontWeight="bold" flex={1} px={2} textAlign="center">"Notre préoccupation c'est qu'Orion continue à exister et à évoluer, sans quoi nous devrons investir en région académique pour conduire les travaux de la carte"</Text>
            </Stack>
          </Box>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Premiers effets mesurables de la transformation de l'offre de formation au niveau national
          </DSFRH6>
          <DSFRParagraph>
            Les effets sur l'insertion des jeunes ne seront quantifiables que 6 mois après la sortie de cursus des premières cohortes concernées par la transformation (2027 en CAP, 2028 en BAC PRO), et s'observeront probablement à plus long terme.
          </DSFRParagraph>
          <DSFRParagraph mt={6}>
            Néanmoins on peut d'ores et déjà observer à l'issue des campagnes 2023 et 2024*:
          </DSFRParagraph>
          <VStack align="stretch" spacing={4} mt={4}>
            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:train" width="24px" height="24px" />
                <Text>
                  Plus de <Text as="span" fontWeight="bold">33% des ouvertures</Text> de places sur des formations menant à des <Text as="span" fontWeight="bold">métiers d'avenir</Text>
                </Text>
              </Flex>
            } />

            <Callout body={
              <Flex alignItems="center" gap={4}>
                <Icon icon="tabler:binoculars" width="24px" height="24px" />
                <Text>
                  Une nette <Text as="span" fontWeight="bold">accélération des fermetures sur certaines formations peu insérantes</Text> et à fort effectif: ainsi 900 fermetures prévues sur la formation AGORA (sur un total de 18000 places).
                </Text>
              </Flex>
            } />
          </VStack>
          <Text fontSize="sm" color="gray.500" mt={2}>*observations basées sur les projets de transformation validés</Text>
        </Box>
      </VStack>
    </Container>
  );
}
