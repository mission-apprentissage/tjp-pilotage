"use client";

import { Box, Container, Flex, Heading, Link, ListItem, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, UnorderedList, useColorModeValue, VStack } from "@chakra-ui/react";
import { Icon, Icon as IconifyIcon } from "@iconify/react";

import { Callout } from "@/components/Callout";

export default function Statistiques() {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent={"center"} alignItems={"center"} mb={8}>
          <IconifyIcon icon="ri:line-chart-line" height={100} width={100} />
        </Flex>

        <Heading as="h1" size="2xl">
          Statistiques Orion
        </Heading>

        <Text color="gray.500" fontSize="sm" textDecoration={"italic"}>
          Mise à jour : Janvier 2025
        </Text>

        <Box>
          <Heading as="h2" size="lg" mb={4} display={"flex"} alignItems={"center"} gap={2}>
            <Icon icon={"ri:time-line"} /> Orion a pour ambition d'aider à améliorer le parcours vers l'emploi des élèves de la voie professionnelle, notamment en participant à :
          </Heading>
          <UnorderedList spacing={2}>
            <ListItem>Augmenter la part des élèves dans les formations menant à <Text as="span" fontWeight="bold">des métiers d'avenir</Text> (<Link href="https://www.strategie.gouv.fr/publications/metiers-2030" color="blue.500" isExternal>France Stratégie</Link>)</ListItem>
            <ListItem>Diminuer la part des élèves dans les <Text as="span" fontWeight="bold">formations peu insérantes</Text></ListItem>
            <ListItem>Augmenter les <Text as="span" fontWeight="bold">taux d'emploi</Text> en sortie de voie professionnelle scolaire</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4} display={"flex"} alignItems={"center"} gap={2}>
            <Icon icon={"ri:building-line"} />  Orion aide à l'analyse en mettant à disposition de tous des données fiables et exhaustives
          </Heading>
          <Text mb={4}>
            Nos travaux ont notamment permis d'augmenter les taux de couverture des indicateurs Inserjeunes : <Text as="span" fontWeight="bold">soit un gain de +18%.</Text>
          </Text>
          <TableContainer>
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
          <Heading as="h2" size="lg" mb={4} display={"flex"} alignItems={"center"} gap={2}>
            <Icon icon={"ri:car-line"} />  Orion aide au pilotage régional et national
          </Heading>
          <Text mb={4}>
            En mettant à disposition des interfaces dédiées à la collecte régionale des projets d'ouverture, de coloration et de fermeture de places de formation.
          </Text>
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
          <Heading as="h2" size="lg" mb={4} display={"flex"} alignItems={"center"} gap={2}>
            <Icon icon={"ri:medal-line"} /> L'utilité d'Orion est saluée par les utilisateurs
          </Heading>
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

          <Box mt={8} p={4} bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius="md">
            <VStack align="stretch" spacing={4}>
              <Text fontStyle="italic">"Un outil ergonomique et intégrateur de données de qualité. Très pratique. Il pourrait devenir l'outil unique de référence"</Text>
              <Text fontStyle="italic">"Un outil partagé qui agrège un ensemble de données utiles et indispensables pour le pilotage"</Text>
              <Text fontStyle="italic">"Notre préoccupation c'est qu'Orion continue à exister et à évoluer, sans quoi nous devrons investir en région académique pour conduire les travaux de la carte"</Text>
            </VStack>
          </Box>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4} display={"flex"} alignItems={"center"} gap={2}>
            <Icon icon={"material-symbols:target"} /> Premiers effets mesurables de la transformation de l'offre de formation au niveau national
          </Heading>
          <Text mb={4}>
            Les effets sur l'insertion des jeunes ne seront quantifiables que 6 mois après la sortie de cursus des premières cohortes concernées par la transformation (2027 en CAP, 2028 en BAC PRO), et s'observeront probablement à plus long terme.
          </Text>
          <Text mb={4}>
            Néanmoins on peut d'ores et déjà observer à l'issue des campagnes 2023 et 2024*:
          </Text>
          <VStack align="stretch" spacing={4}>
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
