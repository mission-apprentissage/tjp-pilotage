"use client";

import { Box, Container, Heading, HStack, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { DSFRH3 } from "@/app/(wrapped)/components/DSFR/H3";
import { DSFRH6 } from "@/app/(wrapped)/components/DSFR/H6";
import { DSFRParagraph } from "@/app/(wrapped)/components/DSFR/Paragraph";

const Page = () =>
  <Container maxW="container.lg" py={8}>
    <VStack spacing="48px" align="stretch">
      <HStack>
        <Icon icon="hugeicons:justice-scale-01" height={32} width={32} />
        <DSFRH3 as="h1">
          Conditions Générales d'Utilisation
        </DSFRH3>
      </HStack>

      <Box>
        <DSFRParagraph mb={4}>
            Les présentes conditions générales d'utilisation (dites « CGU ») fixent le cadre juridique d'Orion et définissent les conditions d'accès et d'utilisation des Services par l'Utilisateur.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
            Article 1 - Champ d'application
        </DSFRH6>
        <DSFRParagraph mb={4}>
            Le présent document a pour objectif d'encadrer l'utilisation de la Plateforme.
        </DSFRParagraph>
        <DSFRParagraph>
            La Plateforme est accessible sans création de compte et demeure d'accès libre pour ce qui est de la Console et du Panorama. L'authentification sur la Plateforme entraîne l'application de conditions spécifiques, listées dans les présentes conditions générales d'utilisation.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
            Article 2 - Objet
        </DSFRH6>
        <DSFRParagraph mb={4}>
            La Plateforme Orion vise à faciliter la transformation de la carte des formations des lycées professionnels en centralisant toutes les données utiles à la prise de décision telles que les effectifs, l'attractivité, le taux d'insertion dans l'emploi ou de poursuite d'études des formations à différents niveaux de granularité.
        </DSFRParagraph>
        <DSFRParagraph>
            Orion est construit à destination de tous les professionnels concernés par la transformation de la carte des formations des lycées professionnels afin qu'ils puissent échanger et construire conjointement un devenir favorable pour les jeunes de leur territoire.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
            Article 3 – Définitions
        </DSFRH6>
        <DSFRParagraph mb={2}>"Console" désigne la vue d'ensemble des données détaillées par établissement et par formation</DSFRParagraph>
        <DSFRParagraph mb={2}>"Panorama" désigne la vue d'ensemble des formations par région, département et établissement</DSFRParagraph>
        <DSFRParagraph mb={2}>"Plateforme" désigne le service public numérique Orion</DSFRParagraph>
        <DSFRParagraph mb={2}>"Éditeur" désigne la DGESCO</DSFRParagraph>
        <DSFRParagraph mb={2}>"Services" désigne les fonctionnalités offertes par la Plateforme pour répondre à ses finalités</DSFRParagraph>
        <DSFRParagraph>
            "Utilisateur" désigne toute personne physique au sein d'une région académique, qui dispose d'un compte sur la Plateforme pour participer à l'amélioration du parcours vers l'emploi des élèves de la voie professionnelle
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
            Article 4 – Fonctionnalités
        </DSFRH6>
        <DSFRParagraph mb={4}>
            La Plateforme est accessible au grand public, l'accès aux Panoramas et à la Console est disponible à tous.
        </DSFRParagraph>
        <DSFRParagraph mb={4}>
            L'Utilisateur de la Plateforme en mode connecté est une personne habilitée ayant reçu un lien d'authentification pour bénéficier des Services.
        </DSFRParagraph>
        <DSFRParagraph>
            L'Utilisateur accède, en renseignant son adresse e-mail et son mot de passe, ou en connexion directe par extranet, à d'autres fonctionnalités pour l'exercice de ses missions et selon son degré d'habilitation : saisie des demandes d'ouverture/fermeture, pilotage de la réforme.
        </DSFRParagraph>
      </Box>

      <Box>
        <DSFRH6 as="h2">
            Article 5 – Responsabilités
        </DSFRH6>

        <Box mb={6}>
          <Heading as="h3" size="md" mb={4}>
              5.1 L'Éditeur de la Plateforme
          </Heading>
          <DSFRParagraph mb={4}>
              Les sources des informations diffusées sur la Plateforme sont réputées fiables mais Orion ne garantit pas qu'elles soient exemptes de défauts, d'erreurs ou d'omissions.
          </DSFRParagraph>
          <DSFRParagraph mb={4}>
              L'Éditeur s'engage à la sécurisation de la Plateforme, notamment en prenant toutes les mesures nécessaires permettant de garantir la sécurité et la confidentialité des informations fournies.
          </DSFRParagraph>
          <DSFRParagraph>
              L'Éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu, sans contrepartie financière, à la Plateforme. Il se réserve la liberté de faire évoluer, de modifier ou de suspendre, sans préavis, la Plateforme pour des raisons de maintenance ou pour tout autre motif jugé nécessaire.
          </DSFRParagraph>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={4}>
              5.2 L'Utilisateur
          </Heading>
          <DSFRParagraph mb={4}>
              L'Utilisateur s'assure de garder son mot de passe secret. Toute divulgation du mot de passe, quelle que soit sa forme, est interdite. Il assume les risques liés à l'utilisation de son adresse e-mail et mot de passe.
          </DSFRParagraph>
          <DSFRParagraph mb={4}>
              Il s'engage à ne pas commercialiser les données affichées sur son espace habilité et à ne pas les communiquer à des tiers en dehors des cas prévus par la loi.
          </DSFRParagraph>
          <DSFRParagraph>
              Toute information transmise par l'Utilisateur est de sa seule responsabilité. Il est rappelé que toute personne procédant à une fausse déclaration pour elle-même ou pour autrui, s'expose, notamment, aux sanctions prévues par l'article 441-1 du Code pénal, prévoyant des peines pouvant aller jusqu'à trois ans d'emprisonnement et 45 000 euros d'amende.
          </DSFRParagraph>
        </Box>
      </Box>

      <Box>
        <DSFRH6 as="h2">
            Article 6 – Mise à jour des conditions générales d'utilisation
        </DSFRH6>
        <DSFRParagraph>
            Les termes des présentes conditions d'utilisation peuvent être amendés à tout moment, sans préavis, en fonction des modifications apportées à la plateforme, de l'évolution de la législation ou pour tout autre motif jugé nécessaire. Chaque modification donne lieu à une nouvelle version qui est acceptée par les parties.
        </DSFRParagraph>
      </Box>
    </VStack>
  </Container>;

export default Page;
