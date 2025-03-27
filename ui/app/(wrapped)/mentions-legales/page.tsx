"use client";

import { Box, Container, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

export default function MentionsLegales() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch" mb={20}>
        <Flex justifyContent={"center"} alignItems={"center"} mb={8}>
          <Icon icon="hugeicons:justice-scale-01" height={100} width={100} />
        </Flex>
        <Heading as="h1" size="xl">
          Mentions légales
        </Heading>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Éditeur de la plateforme
          </Heading>
          <Text mb={4}>
            La plateforme « Orion » est éditée par :
          </Text>
          <Text>
            La Direction générale de l'enseignement scolaire (DGESCO), située :
          </Text>
          <Text ml={4}>
            107 rue de Grenelle<br />
            75007 Paris<br />
            France
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Directrice de la publication
          </Heading>
          <Text>
            Le directeur de la publication est Madame Caroline Pascal, directrice général de la DGESCO.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Hébergement de la plateforme
          </Heading>
          <Text mb={4}>
            Cette plateforme est hébergée par :
          </Text>
          <Text>
            OVH<br />
            2, rue Kellermann<br />
            59100 Roubaix<br />
            France
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Accessibilité
          </Heading>
          <Text mb={4}>
            La conformité aux normes d'accessibilité numérique est un objectif ultérieur mais nous tâchons de rendre cette plateforme accessible à toutes et à tous.
          </Text>
          <Text>
            Pour en savoir plus sur la politique d'accessibilité numérique de l'État :{' '}
            <Link href="https://accessibilite.numerique.gouv.fr/" color="blue.500" isExternal>
              https://accessibilite.numerique.gouv.fr/
            </Link>
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Signaler un dysfonctionnement
          </Heading>
          <Text mb={4}>
            Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité de la plateforme, merci de nous en faire part :{' '}
            <Link href="mailto:orion@inserjeunes.beta.gouv.fr" color="blue.500">
              orion@inserjeunes.beta.gouv.fr
            </Link>
          </Text>
          <Text>
            Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Sécurité
          </Heading>
          <Text mb={4}>
            La plateforme est protégée par un certificat électronique, matérialisé pour la grande majorité des navigateurs par un cadenas. Cette protection participe à la confidentialité des échanges.
          </Text>
          <Text>
            En aucun cas les services associés à la plateforme ne seront à l'origine d'envoi de courriels pour demander la saisie d'informations personnelles.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
