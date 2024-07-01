import {
  Container,
  Heading,
  Highlight,
  Link,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function DeclarationAccessibilite() {
  return (
    <Container maxW="container.xl" py="24px" my={10}>
      <VStack gap="16px" alignItems="start">
        <Heading as="h1">Politique de confidentialité - Orion</Heading>
        <Heading as="h2" fontSize={14}>
          Qui est responsable d'Orion ?
        </Heading>
        <Text>
          Le service numérique « Orion » est sous la responsabilité de la
          Direction générale de l’enseignement scolaire (DGESCO). Orion est un
          service public numérique qui contribue au pilotage de la révision et
          l’évolution de l’offre de formation des lycéens professionnels.
        </Text>
        <Heading as="h2" fontSize={14}>
          Pourquoi traitons-nous des données à caractère personnel ?
        </Heading>
        <Text>
          Orion traite des données à caractère personnel pour permettre
          l'expression et l'analyse de demandes d'évolution des formations
          proposées dans les lycées professionnels.
        </Text>
        <Heading as="h2" fontSize={14}>
          Quelles sont les données à caractère personnel que nous traitons ?
        </Heading>
        <Text>Orion traite les données suivantes :</Text>
        <UnorderedList styleType={"'- '"}>
          <ListItem>
            <Highlight
              query={
                "Données relatives aux utilisateurs ayant un accès privé à la plateforme (mode connecté) :"
              }
            >
              Données relatives aux utilisateurs ayant un accès privé à la
              plateforme (mode connecté) : nom, prénom, adresse e-mail.
            </Highlight>
          </ListItem>
        </UnorderedList>
        <Heading as="h2" fontSize={14}>
          Qu’est-ce qui nous autorise à traiter des données à caractère
          personnel ?
        </Heading>
        <Text>
          Orion traite des données à caractère personnel en se basant sur :
        </Text>
        <UnorderedList styleType={"'- '"}>
          <ListItem>
            L’exécution d’une mission d’intérêt public ou relevant de l’exercice
            de l’autorité publique dont est investi le responsable de traitement
            au sens de l’article 6-1 e) du RGPD.
          </ListItem>
        </UnorderedList>
        <Text>
          Cette mission d’intérêt public se traduit notamment en pratique par
          l’arrêté du 17 février 2014 fixant l’organisation de l’administration
          centrale des ministères de l’éducation nationale, de la jeunesse et
          des sports et de l’enseignement supérieur et de la recherche, plus
          précisément son article 47.
        </Text>
        <Heading as="h2" fontSize={14}>
          Pendant combien de temps conservons-nous ces données ?
        </Heading>
        <Table>
          <Thead bgColor={"grey.850"}>
            <Th fontWeight={700}>Catégories de données</Th>
            <Th fontWeight={700}>Durée de conservation</Th>
          </Thead>
          <Tbody>
            <Td>Données relatives aux utilisateurs</Td>
            <Td>
              Les données sont conservées pendant 2 ans à compteur du dernier
              contact avec l'utilisateur
            </Td>
          </Tbody>
        </Table>
        <Heading as="h2" fontSize={14}>
          Quels sont vos droits ?
        </Heading>
        <Text>Vous disposez :</Text>
        <UnorderedList styleType={"'- '"}>
          <ListItem>D'un droit d'information et de droit d'accès ;</ListItem>
          <ListItem>D'un droit de rectification ;</ListItem>
          <ListItem>D'un droit d'opposition ;</ListItem>
          <ListItem>D'un droit à la limitation du traitement</ListItem>
        </UnorderedList>
        <Text>Pour les exercer, contactez-nous par voie électronique :</Text>
        <Link
          as={NextLink}
          color={"bluefrance.113"}
          href="mailto:orion@inserjeunes.beta.gouv.fr"
        >
          orion@inserjeunes.beta.gouv.fr
        </Link>
        <Text>Par voie postale :</Text>
        <Text>Direction générale de l'enseignement scolaire</Text>
        <Text>110 rue de Grenelle</Text>
        <Text>75357 Paris SP 07</Text>
        <Text>France</Text>
        <Text>
          Puisque ce sont des droits personnels, nous ne traiterons votre
          demande que si nous sommes en mesure de vous identifier. Dans le cas
          où nous ne parvenons pas à vous identifier, nous pouvons être amenés à
          vous demander une preuve de votre identité.
        </Text>
        <Text>
          Pour vous aider dans votre démarche, vous trouverez un modèle de
          courrier élaboré par la CNIL ici :
        </Text>
        <Link
          as={NextLink}
          color={"bluefrance.113"}
          href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces"
        >
          https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
        </Link>
        <Text>
          Nous nous engageons à vous répondre dans un délai raisonnable qui ne
          saurait dépasser 1 mois à compter de la réception de votre demande.
        </Text>
        <Heading as="h2" fontSize={14}>
          Qui va avoir accès à ces données ?
        </Heading>
        <Text>
          Les accès aux données sont strictement encadrés et juridiquement
          justifiés. Les personnes suivantes vont avoir accès aux données :
        </Text>
        <UnorderedList styleType={"'- '"}>
          <ListItem>Les membres habilités de l'équipe Orion ;</ListItem>
          <ListItem>Les administrateurs.</ListItem>
        </UnorderedList>
        <Heading as="h2" fontSize={14}>
          Quelles mesures de sécurité mettons-nous en place ?
        </Heading>
        <Text>
          Nous mettons en place plusieurs mesures pour sécuriser les données :
        </Text>
        <UnorderedList styleType={"'- '"}>
          <ListItem>Stockage des données en base de données ;</ListItem>
          <ListItem>Cloisonnement des données ;</ListItem>
          <ListItem>Mesure de traçabilité ;</ListItem>
          <ListItem>Surveillance ;</ListItem>
          <ListItem>
            Protection contre les virus, malwares et logiciels espions ;
          </ListItem>
          <ListItem>Protection des réseaux ;</ListItem>
          <ListItem>Sauvegarde ;</ListItem>
          <ListItem>
            Mesures restrictives limitant l'accès physique aux données à
            caractère personnel.
          </ListItem>
        </UnorderedList>
        <Heading as="h2" fontSize={14}>
          Qui nous aide à traiter les données à caractère personnel ?
        </Heading>
        <Table>
          <Thead bgColor={"grey.850"}>
            <Th fontWeight={700}>Sous-traitant</Th>
            <Th fontWeight={700}>Pays destinataire</Th>
            <Th fontWeight={700}>Traitement réalisé</Th>
            <Th fontWeight={700}>Garanties</Th>
          </Thead>
          <Tbody>
            <Td>OVH</Td>
            <Td>France</Td>
            <Td>Hébergement</Td>
            <Td>
              <Link
                as={NextLink}
                color={"bluefrance.113"}
                href="https://us.ovhcloud.com/legal/data-processing-agreement/"
              >
                https://us.ovhcloud.com/legal/data-processing-agreement/
              </Link>
            </Td>
          </Tbody>
        </Table>
        <Heading as="h2" fontSize={14}>
          Cookies
        </Heading>
        <Text>
          Un cookie est un fichier déposé sur votre terminal lors de la visite
          d’un site. Il a pour but de collecter des informations relatives à
          votre navigation et de vous adresser des services adaptés à votre
          terminal (ordinateur, mobile ou tablette).
        </Text>
        <Text>
          En application de l’article 5(3) de la directive 2002/58/CE modifiée
          concernant le traitement des données à caractère personnel et la
          protection de la vie privée dans le secteur des communications
          électroniques, transposée à l’article 82 de la loi n° 78-17 du 6
          janvier 1978 relative à l’informatique, aux fichiers et aux libertés,
          les traceurs ou cookies suivent deux régimes distincts.
        </Text>
        <Text>
          Les cookies strictement nécessaires au service ou ayant pour finalité
          exclusive de faciliter la communication par voie électronique sont
          dispensés de consentement préalable au titre de l’article 82 de la loi
          n° 78-17 du 6 janvier 1978.
        </Text>
        <Text>
          À tout moment, vous pouvez refuser l’utilisation des cookies à l’aide
          du bandeau disponible sur la plateforme.
        </Text>
        <Text>
          Ce consentement de la personne concernée pour une ou plusieurs
          finalités spécifiques constitue une base légale au sens du RGPD et
          doit être entendu au sens de l'article 6-a du Règlement (UE) 2016/679
          du Parlement européen et du Conseil du 27 avril 2016 relatif à la
          protection des personnes physiques à l'égard du traitement des données
          à caractère personnel et à la libre circulation de ces données.
        </Text>
        <Text>
          À tout moment, vous pouvez refuser l’utilisation des cookies à l’aide
          du bandeau disponible sur la plateforme.
        </Text>
        <Text>
          Pour aller plus loin, vous pouvez consulter les fiches proposées par
          la Commission Nationale de l'Informatique et des Libertés (CNIL) :
        </Text>
        <UnorderedList styleType={"'- '"}>
          <ListItem>
            <Link
              as={NextLink}
              color={"bluefrance.113"}
              href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi"
            >
              Cookies & traceurs : que dit la loi ?
            </Link>
          </ListItem>
          <ListItem>
            <Link
              as={NextLink}
              color={"bluefrance.113"}
              href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser"
            >
              Cookies : les outils pour les maîtriser
            </Link>
          </ListItem>
        </UnorderedList>
        <Text>
          Nous utilisons Plausible, un outil de mesure d’audience qui ne traite
          pas de donnée à caractère personnel et ne dépose ni cookies ni
          traceurs.
        </Text>
        <Table>
          <Thead bgColor={"grey.850"}>
            <Th fontWeight={700}>Nom du cookie</Th>
            <Th fontWeight={700}>Pays destinataire</Th>
            <Th fontWeight={700}>Traitement réalisé</Th>
            <Th fontWeight={700}>Base légale</Th>
            <Th fontWeight={700}>Durée de vie</Th>
            <Th fontWeight={700}>Garanties</Th>
          </Thead>
          <Tbody>
            <Td>Crisp.chat</Td>
            <Td>France</Td>
            <Td>Outil de support / Chatbot</Td>
            <Td>Consentement</Td>
            <Td>13 mois</Td>
            <Td>
              <Link
                as={NextLink}
                color={"bluefrance.113"}
                href="https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo/"
              >
                https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo/
              </Link>
            </Td>
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
}
