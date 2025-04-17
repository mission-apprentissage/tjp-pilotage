"use client";

import { Box, Container, HStack, Link, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { DSFRH3 } from "@/app/(wrapped)/components/DSFR/H3";
import { DSFRH6 } from "@/app/(wrapped)/components/DSFR/H6";
import { DSFRParagraph } from "@/app/(wrapped)/components/DSFR/Paragraph";

export default function MentionsLegales() {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing="48px" align="stretch" mb={20}>
        <HStack>
          <Icon icon="hugeicons:justice-scale-01" height={32} width={32} />
          <DSFRH3 as="h1">
          Mentions légales
          </DSFRH3>
        </HStack>

        <Box>
          <DSFRH6 as="h2">
            Éditeur de la plateforme
          </DSFRH6>
          <DSFRParagraph>
            La plateforme « Orion » est éditée par :
          </DSFRParagraph>
          <DSFRParagraph>
            La Direction générale de l'enseignement scolaire (DGESCO), située :
          </DSFRParagraph>
          <DSFRParagraph ml={4}>
            107 rue de Grenelle<br />
            75007 Paris<br />
            France
          </DSFRParagraph>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Directrice de la publication
          </DSFRH6>
          <DSFRParagraph>
            Le directeur de la publication est Madame Caroline Pascal, directrice général de la DGESCO.
          </DSFRParagraph>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Hébergement de la plateforme
          </DSFRH6>
          <DSFRParagraph>
            Cette plateforme est hébergée par :
          </DSFRParagraph>
          <DSFRParagraph>
            OVH<br />
            2, rue Kellermann<br />
            59100 Roubaix<br />
            France
          </DSFRParagraph>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Accessibilité
          </DSFRH6>
          <DSFRParagraph>
            La conformité aux normes d'accessibilité numérique est un objectif
            ultérieur mais nous tâchons de rendre cette plateforme accessible à toutes et à tous.
          </DSFRParagraph>
          <DSFRParagraph>
            Pour en savoir plus sur la politique d'accessibilité numérique de l'État :{' '}
            <Link href="https://accessibilite.numerique.gouv.fr/" color="blue.500" isExternal>
              https://accessibilite.numerique.gouv.fr/
            </Link>
          </DSFRParagraph>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Signaler un dysfonctionnement
          </DSFRH6>
          <DSFRParagraph>
            Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité de la plateforme, merci de nous en faire part :{' '}
            <Link href="mailto:orion@inserjeunes.beta.gouv.fr" color="blue.500">
              orion@inserjeunes.beta.gouv.fr
            </Link>
          </DSFRParagraph>
          <DSFRParagraph>
            Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit de faire
            parvenir vos doléances ou une demande de saisine au Défenseur des droits.
          </DSFRParagraph>
        </Box>

        <Box>
          <DSFRH6 as="h2">
            Sécurité
          </DSFRH6>
          <DSFRParagraph>
            La plateforme est protégée par un certificat électronique, matérialisé pour la grande majorité
            des navigateurs par un cadenas. Cette protection participe à la confidentialité des échanges.
          </DSFRParagraph>
          <DSFRParagraph>
            En aucun cas les services associés à la plateforme ne seront à l'origine d'envoi
            de courriels pour demander la saisie d'informations personnelles.
          </DSFRParagraph>
        </Box>
      </VStack>
    </Container>
  );
}
