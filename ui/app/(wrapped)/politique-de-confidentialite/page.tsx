"use client";

import { Box, Container, HStack, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { DSFRH3 } from "@/app/(wrapped)/components/DSFR/H3";
import { DSFRH6 } from "@/app/(wrapped)/components/DSFR/H6";
import { DSFRParagraph } from "@/app/(wrapped)/components/DSFR/Paragraph";

const Page = () =>
  <Container maxW="container.lg" py={8}>
    <VStack spacing="48px" align="stretch" mb={20}>
      <HStack>
        <Icon icon="hugeicons:justice-scale-01" height={32} width={32} />
        <DSFRH3 as="h1">
        Politique de confidentialité
        </DSFRH3>
      </HStack>

      <Box>
        <DSFRH6 as="h2">
          Qui est responsable d'Orion ?
        </DSFRH6>
        <DSFRParagraph>
          Le service numérique « Orion » est sous la responsabilité de la Direction générale de l'enseignement scolaire (DGESCO). Orion est un service public numérique qui contribue au pilotage de la révision et l'évolution de l'offre de formation des lycéens professionnels.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Pourquoi traitons-nous des données à caractère personnel ?
        </DSFRH6>
        <DSFRParagraph>
          Orion traite des données à caractère personnel pour permettre l'expression et l'analyse de demandes d'évolution des formations proposées dans les lycées professionnels.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Quelles sont les données à caractère personnel que nous traitons ?
        </DSFRH6>
        <DSFRParagraph mb={4}>
          Orion traite les données suivantes :
        </DSFRParagraph>
        <DSFRParagraph fontWeight="bold">
          Données relatives aux utilisateurs ayant un accès privé à la plateforme (mode connecté) : nom, prénom, adresse e-mail.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Qu'est-ce qui nous autorise à traiter des données à caractère personnel ?
        </DSFRH6>
        <DSFRParagraph mb={4}>
          Orion traite des données à caractère personnel en se basant sur :
        </DSFRParagraph>
        <DSFRParagraph>
          L'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable de traitement au sens de l'article 6-1 e) du RGPD.
        </DSFRParagraph>
        <DSFRParagraph mt={2}>
          Cette mission d'intérêt public se traduit notamment en pratique par l'arrêté du 17 février 2014 fixant l'organisation de l'administration centrale des ministères de l'éducation nationale, de la jeunesse et des sports et de l'enseignement supérieur et de la recherche, plus précisément son article 47.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Pendant combien de temps conservons-nous ces données ?
        </DSFRH6>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Catégories de données</Th>
                <Th>Durée de conservation</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Données relatives aux utilisateurs</Td>
                <Td>Les données sont conservées pendant 2 ans à compter du dernier contact avec l'utilisateur</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Quels sont vos droits ?
        </DSFRH6>
        <DSFRParagraph mb={4}>
          Vous disposez :
        </DSFRParagraph>
        <Box as="ul" ml={6} mb={4}>
          <DSFRParagraph as="li">D'un droit d'information et droit d'accès</DSFRParagraph>
          <DSFRParagraph as="li">D'un droit de rectification</DSFRParagraph>
          <DSFRParagraph as="li">D'un droit d'opposition</DSFRParagraph>
          <DSFRParagraph as="li">D'un droit à la limitation du traitement</DSFRParagraph>
        </Box>
        <DSFRParagraph mb={4}>
          Par voie postale :
        </DSFRParagraph>
        <Box as="blockquote" pl={4} borderLeft="4px" borderColor="blue.500" mb={4}>
          <DSFRParagraph>
            Direction générale de l'enseignement scolaire<br />
            110 rue de Grenelle<br />
            75357 Paris SP 07<br />
            France
          </DSFRParagraph>
        </Box>
        <DSFRParagraph mb={4}>
          Puisque ce sont des droits personnels, nous ne traiterons votre demande que si nous sommes en mesure de vous identifier. Dans le cas où nous ne parvenons pas à vous identifier, nous pouvons être amenés à vous demander une preuve de votre identité.
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
          Pour vous aider dans votre démarche, vous trouverez un modèle de courrier élaboré par la CNIL ici :{' '}
          <Link href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces" color="blue.500" isExternal>
            https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
          </Link>
        </DSFRParagraph>
        <DSFRParagraph>
          Nous nous engageons à vous répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la réception de votre demande.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Qui va avoir accès à ces données ?
        </DSFRH6>
        <DSFRParagraph mb={4}>
          Les accès aux données sont strictement encadrés et juridiquement justifiés. Les personnes suivantes vont avoir accès aux données :
        </DSFRParagraph>
        <Box as="ul" ml={6}>
          <DSFRParagraph as="li">Les membres habilités de l'équipe Orion</DSFRParagraph>
          <DSFRParagraph as="li">Les administrateurs</DSFRParagraph>
        </Box>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Quelles mesures de sécurité mettons-nous en place ?
        </DSFRH6>
        <DSFRParagraph mb={4}>
          Nous mettons en place plusieurs mesures pour sécuriser les données :
        </DSFRParagraph>
        <Box as="ul" ml={6}>
          <DSFRParagraph as="li">Stockage des données en base de données</DSFRParagraph>
          <DSFRParagraph as="li">Cloisonnement des données</DSFRParagraph>
          <DSFRParagraph as="li">Mesures de traçabilité</DSFRParagraph>
          <DSFRParagraph as="li">Surveillance</DSFRParagraph>
          <DSFRParagraph as="li">Protection contre les virus, malwares et logiciels espions</DSFRParagraph>
          <DSFRParagraph as="li">Protection des réseaux</DSFRParagraph>
          <DSFRParagraph as="li">Sauvegarde</DSFRParagraph>
          <DSFRParagraph as="li">Mesures restrictives limitant l'accès physique aux données à caractère personnel</DSFRParagraph>
        </Box>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Qui nous aide à traiter les données à caractère personnel ?
        </DSFRH6>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Sous-traitant</Th>
                <Th>Pays destinataire</Th>
                <Th>Traitement réalisé</Th>
                <Th>Garanties</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>OVH</Td>
                <Td>France</Td>
                <Td>Hébergement</Td>
                <Td>
                  <Link href="https://us.ovhcloud.com/legal/data-processing-agreement/" color="blue.500" isExternal>
                    https://us.ovhcloud.com/legal/data-processing-agreement/
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <DSFRH6 as="h2">
          Cookies
        </DSFRH6>
        <DSFRParagraph mb={4}>
          Un cookie est un fichier déposé sur votre terminal lors de la visite d'un site. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal (ordinateur, mobile ou tablette).
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
          En application de l'article 5(3) de la directive 2002/58/CE modifiée concernant le traitement des données à caractère personnel et la protection de la vie privée dans le secteur des communications électroniques, transposée à l'article 82 de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, les traceurs ou cookies suivent deux régimes distincts.
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
          Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de faciliter la communication par voie électronique sont dispensés de consentement préalable au titre de l'article 82 de la loi n° 78-17 du 6 janvier 1978.
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
          Les cookies n'étant pas strictement nécessaires au service ou n'ayant pas pour finalité exclusive de faciliter la communication par voie électronique doivent être consenti par l'utilisateur.
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
          Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques constitue une base légale au sens du RGPD et doit être entendu au sens de l'article 6-a du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données.
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
          À tout moment, vous pouvez refuser l'utilisation des cookies à l'aide du bandeau disponible sur la plateforme.
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
          Pour aller plus loin, vous pouvez consulter les fiches proposées par la Commission Nationale de l'Informatique et des Libertés (CNIL) :
        </DSFRParagraph>
        <Box as="ul" ml={6} mb={4}>
          <DSFRParagraph as="li">
            <Link href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi" color="blue.500" isExternal>
              Cookies & traceurs : que dit la loi ?
            </Link>
          </DSFRParagraph>
          <DSFRParagraph as="li">
            <Link href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" color="blue.500" isExternal>
              Cookies : les outils pour les maîtriser
            </Link>
          </DSFRParagraph>
        </Box>
        <DSFRParagraph mb={4}>
          Nous utilisons Plausible, un outil de mesure d'audience qui ne traite pas de donnée à caractère personnel et ne dépose ni cookies ni traceurs.
        </DSFRParagraph>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nom du cookie</Th>
                <Th>Pays destinataire</Th>
                <Th>Traitement réalisé</Th>
                <Th>Base légale</Th>
                <Th>Durée de vie</Th>
                <Th>Garanties</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Crisp.chat</Td>
                <Td>France</Td>
                <Td>Outil de support / Chatbot</Td>
                <Td>Consentement</Td>
                <Td>13 mois</Td>
                <Td>
                  <Link href="https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo/" color="blue.500" isExternal>
                    https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo/
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  </Container>;

export default Page;
