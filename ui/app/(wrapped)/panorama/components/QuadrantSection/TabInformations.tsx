import { ListItem, TabPanel, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { ShortLink } from "@/components/ShortLink";

export const TabInformations = ({
  nbFormationsAffichee,
  nbFormationsNonAffichee,
  effectifEntreeAffiche,
  effectifEntreeNonAffiche,
}: {
  nbFormationsAffichee?: number;
  nbFormationsNonAffichee?: number;
  effectifEntreeAffiche?: number;
  effectifEntreeNonAffiche?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TabPanel p={0} pt={"32px"}>
      <VStack p={"40px 24px"} bg={"bluefrance.975"} borderRadius={"16px"} alignItems={"start"} gap={"32px"}>
        <VStack justifyContent={"start"} alignItems={"start"} gap={"8px"}>
          <Text fontWeight={"bold"}>Sur le quadrant:</Text>
          <UnorderedList>
            <ListItem>
              <strong>{nbFormationsAffichee} formations affichées,</strong> soit un effectif en entrée de{" "}
              {effectifEntreeAffiche} élèves.
            </ListItem>
            <ListItem>
              <strong>{nbFormationsNonAffichee} formations non affichées </strong>
              (hors quadrant), soit un effectif en entrée de {effectifEntreeNonAffiche} élèves.
            </ListItem>
          </UnorderedList>
        </VStack>
        <VStack justifyContent={"start"} alignItems={"start"} gap={"8px"}>
          <Text fontWeight={"bold"} mb={"16px"}>
            Définitions et modes d'emploi
          </Text>
          <ShortLink label={"Quadrant"} onClick={() => openGlossaire("quadrant")} iconLeft="ri:layout-grid-line" />
          <ShortLink
            label={"Taux d'emploi à 6 mois"}
            onClick={() => openGlossaire("taux-emploi-6-mois")}
            iconLeft={"ri:briefcase-line"}
          />
          <ShortLink
            label={"Taux de poursuite d'études"}
            onClick={() => openGlossaire("taux-poursuite-etudes")}
            iconLeft="ri:book-open-line"
          />
          <ShortLink
            label={"Voir toutes les définitions"}
            onClick={() => openGlossaire()}
            iconRight="ri:arrow-right-line"
            fontWeight={"bold"}
          />
        </VStack>
        <VStack justifyContent={"start"} alignItems={"start"} gap={"8px"}>
          <Text fontWeight={"bold"} mb={"16px"}>
            Questions fréquentes
          </Text>
          <ShortLink
            label={"Pourquoi certaines formations n'apparaissent pas dans le quadrant ?"}
            iconLeft="ri:share-box-line"
            target="_blank"
            href="https://aide.orion.inserjeunes.beta.gouv.fr/fr/article/comprendre-le-quadrant-6bko2t/"
          />
          <ShortLink
            label={"Pourquoi une formation qui mène vers un métier d'avenir est-elle en Q4 du quadrant ?"}
            iconLeft={"ri:share-box-line"}
            target="_blank"
            href="https://aide.orion.inserjeunes.beta.gouv.fr/fr/article/pourquoi-une-formation-qui-mene-vers-un-metier-davenir-est-elle-en-q4-du-quadrant-tnlpgw/?bust=1720087401234"
          />
          <ShortLink
            label={"Voir toutes les questions"}
            iconRight="ri:arrow-right-line"
            fontWeight={"bold"}
            href="https://aide.orion.inserjeunes.beta.gouv.fr/"
            target="_blank"
          />
        </VStack>
      </VStack>
    </TabPanel>
  );
};
