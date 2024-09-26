import {
  Button,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { TooltipIcon } from "../../../../../../components/TooltipIcon";
import { PositiveNegativeBarChart } from "../../components/PositiveNegativeBarChart";
import { RepartitionPilotageIntentions } from "../../types";

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
        <Button
          variant={"ghost"}
          color={"bluefrance.113"}
          leftIcon={<Icon icon="ri:download-line" />}
          as={Link}
          href={"__TODO__"}
          isDisabled
          target="_blank"
        >
          Exporter
        </Button>
      </Flex>
      <Divider w={"100%"} />
      <SimpleGrid columns={2} gap={20} mb={-12}>
        <Flex direction={"row"} gap={2} color={"bluefrance.113"}>
          <Text fontWeight={500} fontSize={16}>
            10 DOMAINES LES PLUS TRANSFORMÉS
          </Text>
        </Flex>
        <Flex direction={"row"} gap={2} color={"bluefrance.113"}>
          <Text fontWeight={500} fontSize={16}>
            TRANSFORMATIONS PAR DIPLÔME
          </Text>
          <TooltipIcon
            my={"auto"}
            label={
              <Flex direction={"column"} gap={3}>
                <Text>
                  Certains diplômes n'ont pas de taux de transformation :
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
