import { Box, Container, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

export default function DeclarationAccessibilite() {
  return (
    <>
      <Container maxW="container.xl" py="24px">
        <VStack gap="16px" alignItems="start">
          <Heading as="h1">Declaration d’accessibilité</Heading>
          <Text>
            Établie le <span>16 avril 2024</span>.
          </Text>
          <Box>
            <Text>
              <span>Mission InserJeunes</span> s’engage à rendre son service accessible, conformément à l’article 47 de
              la loi n° 2005-102 du 11 février 2005.
            </Text>
            <Text>
              À cette fin, nous mettons en œuvre la stratégie et les actions suivantes&nbsp;:{" "}
              <Link
                style={{
                  textDecoration: "underline",
                }}
                as={NextLink}
                href="https://beta.gouv.fr/accessibilite/schema-pluriannuel"
              >
                https://beta.gouv.fr/accessibilite/schema-pluriannuel
              </Link>
              .
            </Text>
          </Box>
          <Text>
            Cette déclaration d’accessibilité s’applique à <strong>Orion</strong>
            <span>
              {" "}
              (
              <Link
                style={{
                  textDecoration: "underline",
                }}
                as={NextLink}
                href="https://orion.inserjeunes.beta.gouv.fr/"
              >
                https://orion.inserjeunes.beta.gouv.fr/
              </Link>
              )
            </span>
            .
          </Text>
          <Heading as="h2">État de conformité</Heading>
          <Text>
            <strong>Orion</strong> est{" "}
            <strong>
              <span data-printfilter="lowercase">non conforme</span>
            </strong>{" "}
            avec le <abbr title="Référentiel général d’amélioration de l’accessibilité">RGAA</abbr>.{" "}
            <span>Le site n’a encore pas été audité.</span>
          </Text>
          <Heading as="h2">Contenus non accessibles</Heading>
          <Heading as="h2">Amélioration et contact</Heading>
          <Text>
            Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de{" "}
            <span>Orion</span> pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre
            forme.
          </Text>
          <UnorderedList>
            <ListItem>
              E-mail&nbsp;:{" "}
              <Link
                style={{
                  textDecoration: "underline",
                }}
                href="mailto:orion@inserjeunes.beta.gouv.fr"
              >
                orion@inserjeunes.beta.gouv.fr
              </Link>
            </ListItem>
            <ListItem>
              Formulaire de contact&nbsp;:{" "}
              <Link
                style={{
                  textDecoration: "underline",
                }}
                href="https://aide.orion.inserjeunes.beta.gouv.fr"
              >
                https://aide.orion.inserjeunes.beta.gouv.fr
              </Link>
            </ListItem>
          </UnorderedList>
          <Text>
            Nous essayons de répondre dans les <span>2 jours ouvrés</span>.
          </Text>
          <Heading as="h2">Voie de recours</Heading>
          <Text>
            Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au responsable du site internet
            un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous
            n’avez pas obtenu de réponse satisfaisante.
          </Text>
          <Text>Vous pouvez&nbsp;:</Text>
          <UnorderedList>
            <ListItem>
              Écrire un message au{" "}
              <Link
                style={{
                  textDecoration: "underline",
                }}
                href="https://formulaire.defenseurdesdroits.fr/"
              >
                Défenseur des droits
              </Link>
            </ListItem>
            <ListItem>
              Contacter{" "}
              <Link
                style={{
                  textDecoration: "underline",
                }}
                href="https://www.defenseurdesdroits.fr/saisir/delegues"
              >
                le délégué du Défenseur des droits dans votre région
              </Link>
            </ListItem>
            <ListItem>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:
              <br />
              Défenseur des droits
              <br />
              Libre réponse 71120 75342 Paris CEDEX 07
            </ListItem>
          </UnorderedList>
          <Text>
            Cette déclaration d’accessibilité a été créé le <span>16 avril 2024</span> grâce au{" "}
            <Link
              style={{
                textDecoration: "underline",
              }}
              href="https://betagouv.github.io/a11y-generateur-declaration/#create"
            >
              Générateur de Déclaration d’Accessibilité de BetaGouv
            </Link>
            .
          </Text>
        </VStack>
      </Container>
    </>
  );
}
