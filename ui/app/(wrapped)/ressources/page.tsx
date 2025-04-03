"use client";

import { Box, Container, Flex, Heading, Link, Table, TableContainer, Tbody, Td as ChakraTd, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

const Td = (props: React.ComponentProps<typeof ChakraTd>) => (
  <ChakraTd
    maxWidth="100px"
    sx={{
      textWrap: "auto"
    }}
    {...props}>{props.children}</ChakraTd>
);

export default function Ressources() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent={"center"} alignItems={"center"} mb={8}>
          <Icon icon="hugeicons:book-open" height={100} width={100} />
        </Flex>

        <Heading as="h1" size="xl">
          Ressources Orion
        </Heading>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            🔭 Table des sources
          </Heading>
          <TableContainer overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th py={4}></Th>
                  <Th py={4}>Liste des formations</Th>
                  <Th py={4}>Capacité (hors BTS)</Th>
                  <Th py={4}>Effectifs et établissements</Th>
                  <Th py={4}>Vœux 1 (hors BTS)</Th>
                  <Th py={4}>Poursuite d'étude</Th>
                  <Th py={4}>Emploi à 6 mois</Th>
                  <Th py={4}>Devenir favorable</Th>
                  <Th py={4}>Valeur ajoutée</Th>
                  <Th py={4}>Lien métier-formation</Th>
                  <Th py={4}>Capacité BTS</Th>
                  <Th py={4}>Vœux BTS</Th>
                  <Th py={4}>Décrochage</Th>
                  <Th py={4}>Réussite Examen</Th>
                  <Th py={4}>Taux Interruption formation</Th>
                  <Th py={4}>Métiers d'avenir et métiers en tension</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td py={4} fontWeight="bold">Source</Td>
                  <Td py={4}>Liste officielle des diplômes</Td>
                  <Td py={4}>Affelnet 2024, 2023 et 2022</Td>
                  <Td py={4}>Constat de rentrée 2024, 2023 et 2022</Td>
                  <Td py={4}>Affelnet 2024, 2023 et 2022</Td>
                  <Td py={4}>API InserJeunes des sortants 2023</Td>
                  <Td py={4}>API InserJeunes des sortants 2023</Td>
                  <Td py={4}>API InserJeunes des sortants 2023</Td>
                  <Td py={4}>API InserJeunes des sortants 2023</Td>
                  <Td py={4}>Certif info</Td>
                  <Td py={4}>Parcoursup 2024, 2023 et 2022</Td>
                  <Td py={4}>Parcoursup 2024, 2023 et 2022</Td>
                  <Td py={4}>Données non disponibles</Td>
                  <Td py={4}>IVAL</Td>
                  <Td py={4}>API InserJeunes</Td>
                  <Td py={4}>en cours d'investigation</Td>
                </Tr>
                <Tr>
                  <Td py={4} fontWeight="bold">Open data</Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-en-liste-diplomes-professionnels/table" color="blue.500" isExternal>
                      Oui
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-en-carto-pro-capacites/table/" color="blue.500" isExternal>
                      Oui au niveau académique
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-en-lycee_pro-effectifs-niveau-sexe-mef/table/?" color="blue.500" isExternal>
                      Oui au niveau de la formation fine
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-en-carto-pro-capacites/table/" color="blue.500" isExternal>
                      Oui au niveau académique
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://www.education.gouv.fr/l-insertion-des-jeunes-apres-une-formation-en-voie-professionnelle-307956" color="blue.500" isExternal>
                      Oui
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://www.education.gouv.fr/l-insertion-des-jeunes-apres-une-formation-en-voie-professionnelle-307956" color="blue.500" isExternal>
                      Oui
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://www.education.gouv.fr/l-insertion-des-jeunes-apres-une-formation-en-voie-professionnelle-307956" color="blue.500" isExternal>
                      Oui
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-en-indicateurs-de-resultat-des-lycees-denseignement-professionnels/table/" color="blue.500" isExternal>
                      Oui
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://www.data.gouv.fr/fr/datasets/referentiel-national-des-certifications/" color="blue.500" isExternal>
                      Oui
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-esr-parcoursup/table/" color="blue.500" isExternal>
                      Oui mais sans le MEFSTAT11 (donc inexploitable)
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-esr-parcoursup/table/" color="blue.500" isExternal>
                      Oui mais sans le MEFSTAT11 (donc inexploitable)
                    </Link>
                  </Td>
                  <Td py={4}>Non</Td>
                  <Td py={4}>
                    <Link href="https://data.education.gouv.fr/explore/dataset/fr-en-indicateurs-de-resultat-des-lycees-denseignement-professionnels/table/?sort=-annee" color="blue.500" isExternal>
                      Uniquement au niveau de la spécialité sans distinction de diplôme
                    </Link>
                  </Td>
                  <Td py={4}>
                    <Link href="https://www.education.gouv.fr/l-insertion-des-jeunes-apres-une-formation-en-voie-professionnelle-307956" color="blue.500" isExternal>
                      Oui mais par niveau de diplôme (BAC, CAP, etc) uniquement
                    </Link>
                  </Td>
                  <Td py={4}>Oui</Td>
                </Tr>
                <Tr>
                  <Td py={4} fontWeight="bold">Reste à passer en open data</Td>
                  <Td py={4}></Td>
                  <Td py={4}>Chiffres au niveau de la formation fine</Td>
                  <Td py={4}></Td>
                  <Td py={4}>Chiffres au niveau de la formation fine</Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}>À déterminer</Td>
                  <Td py={4}>Chiffres au niveau de la formation fine</Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                </Tr>
                <Tr>
                  <Td py={4} fontWeight="bold">Console Établissements</Td>
                  <Td py={4}>Spécialités (famille de métiers ou non) et 2ndes communes</Td>
                  <Td py={4}>Rentrées 2024, 2023 et 2022</Td>
                  <Td py={4}>Effectifs pour chaque année de formation</Td>
                  <Td py={4}>Taux de pression Vœux lycées 2024, 2023 et 2022</Td>
                  <Td py={4}>Taux régional et de taux de la formation de l'établissement par spécialité</Td>
                  <Td py={4}>Taux régional et taux de la formation de l'établissement par spécialité</Td>
                  <Td py={4}>Taux régional et taux de la formation de l'établissement par spécialité</Td>
                  <Td py={4}>Concerne l'établissement dans son ensemble</Td>
                  <Td py={4}></Td>
                  <Td py={4}>Taux de demande (en cours de création)</Td>
                  <Td py={4}>Taux de demande (en cours de création)</Td>
                  <Td py={4}>Données non disponibles</Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                </Tr>
                <Tr>
                  <Td py={4} fontWeight="bold">Console Formations</Td>
                  <Td py={4}>Spécialités (Famille de Métiers ou non) et 2ndes communes</Td>
                  <Td py={4}>Agrégation des données Etablissement</Td>
                  <Td py={4}>Agrégation des données Etablissement</Td>
                  <Td py={4}>Agrégation des données Etablissement</Td>
                  <Td py={4}>Taux régional par spécialité</Td>
                  <Td py={4}>Taux régional par spécialité</Td>
                  <Td py={4}>Taux régional par spécialité</Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}>Taux de demande (en cours de création)</Td>
                  <Td py={4}>Taux de demande (en cours de création)</Td>
                  <Td py={4}>Données non disponibles</Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                </Tr>
                <Tr>
                  <Td py={4} fontWeight="bold">Panorama Régional/Départemental/Établissement</Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}>Effectif en entrée (rentrée 2024)</Td>
                  <Td py={4}></Td>
                  <Td py={4}>Taux régional par spécialité</Td>
                  <Td py={4}>Taux régional par spécialité</Td>
                  <Td py={4}>Taux régional par spécialité</Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                  <Td py={4}></Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Container>
  );
}
