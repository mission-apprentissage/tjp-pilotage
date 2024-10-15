import {
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import { ExportMenuButton } from "@/components/ExportMenuButton";
import { downloadExcel } from "@/utils/downloadExport";

import { TooltipIcon } from "../../../../../../components/TooltipIcon";
import { PositiveNegativeBarChart } from "../../components/PositiveNegativeBarChart";
import { RepartitionPilotageIntentions } from "../../types";

const TOP_DOMAINES_NAME = "Domaines";
const TRANSFORMATIONS_PAR_DIPLOME_NAME = "Diplôme";

export const FiliereNiveauDiplomeSection = ({
  repartitionData,
}: {
  repartitionData?: RepartitionPilotageIntentions;
}) => {
  return (
    <Flex direction={"column"} gap={6}>
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h3" fontWeight={700} fontSize={20}>
          Par filière et niveau de diplôme
        </Heading>
        <ExportMenuButton
          color={"bluefrance.113"}
          onExportExcel={async () => {
            downloadExcel(
              `domaines_et_diplomes_les_plus_transformés`,
              {
                [TOP_DOMAINES_NAME]: Object.values(
                  repartitionData?.top10Domaines ?? {}
                ),
                [TRANSFORMATIONS_PAR_DIPLOME_NAME]: Object.values(
                  repartitionData?.niveauxDiplome ?? {}
                ),
              },
              {
                [TOP_DOMAINES_NAME]: {
                  libelle: "Libellé NSF",
                  effectif: "Effectif",
                  placesTransformees: "Places transformées",
                  tauxTransformation: "Taux de transformation",
                  placesOuvertes: "Places ouvertes",
                  placesFermees: "Places fermées",
                  placesColoreesOuvertes: "Places colorées ouvertes",
                  placesColoreesFermees: "Places colorées fermées",
                  solde: "Solde",
                  ratioFermeture: "Ratio de fermeture",
                },
                [TRANSFORMATIONS_PAR_DIPLOME_NAME]: {
                  libelle: "Libellé niveau de diplôme",
                  code: "Code",
                  effectif: "Effectif",
                  placesTransformees: "Places transformées",
                  tauxTransformation: "Taux de transformation",
                  placesOuvertes: "Places ouvertes",
                  placesFermees: "Places fermées",
                  placesColoreesOuvertes: "Places colorées ouvertes",
                  placesColoreesFermees: "Places colorées fermées",
                  solde: "Solde",
                  ratioFermeture: "Ratio de fermeture",
                },
              }
            );
          }}
          variant="ghost"
        />
      </Flex>
      <Divider w={"100%"} />
      <SimpleGrid columns={2} gap={20} mb={-12}>
        <Flex direction={"row"} gap={2} color={"bluefrance.113"}>
          <Text fontWeight={500} fontSize={16}>
            10 DOMAINES LES PLUS TRANSFORMÉS
          </Text>
          <TooltipIcon
            zIndex={1}
            my={"auto"}
            label={
              <Flex direction={"column"} gap={3}>
                <Text>
                  en nombre de places transformées (places ouvertes + places
                  fermées + places existantes colorées)
                </Text>
              </Flex>
            }
          />
        </Flex>
        <Flex direction={"row"} gap={2} color={"bluefrance.113"}>
          <Text fontWeight={500} fontSize={16}>
            TRANSFORMATIONS PAR DIPLÔME
          </Text>
          <TooltipIcon
            zIndex={1}
            my={"auto"}
            label={
              <Flex direction={"column"} gap={3}>
                <Text>
                  Pour certains diplômes le taux de transformation n'apparaît
                  pas :
                </Text>
                <List>
                  <ListItem>
                    soit le numérateur manque: le diplôme n’est pas transformé ⇒
                    le taux de transformation vaut 0% ;
                  </ListItem>
                  <ListItem>
                    soit le dénominateur manque: les effectifs dans le diplôme
                    ne sont pas présents dans le constat de rentrée (FCIL, CS…)
                    ⇒ le taux de transfo n’est pas calculable
                  </ListItem>
                </List>
              </Flex>
            }
          />
        </Flex>
      </SimpleGrid>
      <SimpleGrid columns={2} gap={20} height={400}>
        <PositiveNegativeBarChart
          title="10 DOMAINES LES PLUS TRANSFORMÉS"
          type="domaine"
          data={repartitionData?.top10Domaines}
        />
        <PositiveNegativeBarChart
          title="TRANSFORMATIONS PAR DIPLÔME"
          type="diplome"
          data={repartitionData?.niveauxDiplome}
        />
      </SimpleGrid>
    </Flex>
  );
};
