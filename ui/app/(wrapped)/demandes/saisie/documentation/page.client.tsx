
"use client";
import { Alert, AlertIcon, Box, Container, Flex, Heading, Image, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";

export function DocumentationClient() {
  const { user } = useAuth();

  return (
    <>
      <Container maxW="container.xl" py="4">
        <Breadcrumb
          ml={4}
          pages={[
            { title: "Accueil", to: "/" },
            { title: "Recueil des demandes", to: getRoutingSaisieRecueilDemande({user}) },
            {
              title: "Documentation",
              to: `${getRoutingSaisieRecueilDemande({user, suffix: "documentation"})}`,
              active: true,
            },
          ]}
        />
      </Container>
      <Container maxW="container.md" py={4}>
        <VStack spacing={8} align="stretch" mb={20}>
          <Flex justifyContent={"center"} alignItems={"center"} mb={8}>
            <Icon icon="hugeicons:document-01" height={100} width={100} />
          </Flex>

          <Heading as="h1" size="xl">
            Enregistrer une demande d'ouverture ou de fermeture dans Orion
          </Heading>

          <Alert status="warning" variant="subtle">
            <AlertIcon />
            Depuis le 23 novembre les experts et les pilotes ont les mêmes permissions dans Orion,
            il n'y a donc plus qu'un seul profil "Pilote Régional" pour ces utilisateurs
          </Alert>

          <Box>
            <Alert status="info" variant="subtle" mb={4}>
              En 2023, la saisie est effectuée par la région académique sur la période de concertation régionale :
              projets de demandes et demandes définitives.
            </Alert>
            <Image
              src="/documentation/process_demande_ouverture.png"
              alt="Processus de saisie des demandes"
              mb={4}
              borderRadius="md"
            />
            <Box as="blockquote" pl={4} borderLeft="4px" borderColor="blue.500" mb={4}>
              <Text>
                La saisie des "projets de demande" permet de donner de la visibilité à la DGESCO alors même
                que les discussions sont encore en cours au niveau régional.
              </Text>
            </Box>
            <Text mb={4}>
              La validation des "projets de demandes" en "demandes définitives" peut se faire au fil de l'eau.
            </Text>
            <Text fontWeight="bold">
              A la fin du processus, les demandes définitives enregistrées dans Orion doivent correspondre à
              la liste des demandes proposées au vote du Conseil Régional
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Le gestionnaire peut :
            </Heading>
            <UnorderedList spacing={2} ml={12}>
              <ListItem>Saisir un projet de demande</ListItem>
              <ListItem>Enregistrer une demande définitive, à partir d'un projet de demande qu'il a initié</ListItem>
              <ListItem>Modifier un projet de demande qu'il a initié</ListItem>
              <ListItem>Supprimer une demande définitive qu'il a enregistrée</ListItem>
              <ListItem>Consulter toutes les demandes de sa région académique</ListItem>
              <ListItem>Consulter les demandes dans la console de restitution</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Le pilote régional :
            </Heading>
            <UnorderedList spacing={2} ml={12}>
              <ListItem>Saisir un projet de demande ou une demande définitive</ListItem>
              <ListItem>
                Modifier un projet de demande ou une demande définitive, y compris ceux qu'il n'a pas initiés
              </ListItem>
              <ListItem>Valider une demande définitive, y compris s'il n'en est pas à l'origine</ListItem>
              <ListItem>Supprimer toute demande définitive enregistrée dans sa région académique</ListItem>
              <ListItem>
                Consulter toutes les demandes sur l'ensemble des régions dans la console de restitution
              </ListItem>
              <ListItem>
                Accéder aux indicateurs de pilotage de la transformation de la carte de l'ensemble des régions
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Orion vous facilite la saisie :
            </Heading>
            <UnorderedList spacing={2} ml={12}>
              <ListItem>Recherche simple d'un diplôme par le libellé, par exemple "bac pro aéronautique"
                <UnorderedList ml={6} mt={2} spacing={1}>
                  <ListItem>La saisie est automatique : une liste de libellés est intégrée à la recherche</ListItem>
                  <ListItem>Les codes diplômes seront liés automatiquement dans la restitution</ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                Recherche simple d'un établissement par son nom et sa commune, par exemple "Gustave Eiffel Paris"
              </ListItem>
              <ListItem>
                Types de demandes prédéfinis : une consigne s'affiche pour rappeler le contexte de chaque demande
              </ListItem>
              <ListItem>Proposition d'une liste de motifs à cocher avec possibilité de préciser</ListItem>
              <ListItem>
                Saisie contextualisée et guidée des capacités selon qu'il s'agit d'une augmentation ou d'une fermeture,
                 d'une formation mixte ou d'une coloration
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Focus sur quelques cas particuliers :
            </Heading>

            <Box mb={6}>
              <Heading as="h3" size="md" mb={4}>
                Le bac pro en famille de métiers
              </Heading>
              <UnorderedList spacing={2} ml={12}>
                <ListItem>La saisie se fait directement sur les spécialités (recherche du diplôme)</ListItem>
                <ListItem>1 demande par spécialité</ListItem>
                <ListItem>
                  La rentrée scolaire considérée est bien l'entrée de l'ouverture
                  de la 2nde commune sur l'établissement
                </ListItem>
              </UnorderedList>
            </Box>

            <Box mb={6}>
              <Heading as="h3" size="md" mb={4}>
                Les FCIL
              </Heading>
              <Image
                src="/documentation/capture_recherche_fcil.png"
                alt="Recherche FCIL"
                mb={4}
                borderRadius="md"
              />
              <UnorderedList spacing={2} ml={12}>
                <ListItem>Recherche du niveau de la FCIL dans le libellé de la formation</ListItem>
                <ListItem>Saisie du libellé de la FCIL</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h3" size="md" mb={4}>
                Les colorations
              </Heading>
              <UnorderedList spacing={2} ml={12}>
                <ListItem>
                  Les demandes à enregistrer dans Orion concernent uniquement
                  les colorations portant sur des ouvertures de places supplémentaires
                  (augmentation de capacité ou ouverture de formation)
                </ListItem>
                <ListItem>Saisie du libellé de la formation</ListItem>
                <ListItem>Préciser le libellé de la coloration dans le champ prévu à cet effet</ListItem>
              </UnorderedList>
            </Box>
          </Box>
        </VStack>
      </Container>
    </>
  );
}
