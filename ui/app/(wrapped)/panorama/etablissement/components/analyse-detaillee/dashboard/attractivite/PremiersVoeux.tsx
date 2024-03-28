import { Badge, Box, Flex, Img, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { GlossaireShortcut } from "../../../../../../../../components/GlossaireShortcut";
import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

const CODE_NIVEAU_DIPLOME_BTS = "320";

export const PremiersVoeux = ({
  codeNiveauDiplome,
  premiersVoeux,
  premiersVoeuxAnneePrecedente,
}: {
  codeNiveauDiplome?: string;
  premiersVoeux?: number;
  premiersVoeuxAnneePrecedente?: number;
}) => {
  const getCompareData = () => {
    if (!premiersVoeux || !premiersVoeuxAnneePrecedente) return "";
    if (premiersVoeux > premiersVoeuxAnneePrecedente) {
      return (
        <>
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" />
            {`+${
              premiersVoeux - premiersVoeuxAnneePrecedente
            } vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}
          </Flex>
        </>
      );
    } else if (premiersVoeux < premiersVoeuxAnneePrecedente) {
      return (
        <>
          <Flex color="warning.525">
            <Img src={"/icons/arrow_down.svg"} alt="down" />
            {`${
              premiersVoeux - premiersVoeuxAnneePrecedente
            } vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}
          </Flex>
        </>
      );
    }
    return (
      <>
        <Flex>{`+0 vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}</Flex>
      </>
    );
  };

  return (
    <DashboardCard
      label={
        codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS
          ? "Nombre de voeux"
          : "Nombre de 1ers voeux"
      }
      tooltip={
        <GlossaireShortcut
          display={"inline"}
          marginInline={1}
          glossaireEntryKey="voeux"
          tooltip={
            <Box>
              <Text>
                {codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS
                  ? "Nombre de voeux"
                  : "Nombre de 1ers voeux"}
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      <CounterChart data={premiersVoeux} compareData={getCompareData()} />
    </DashboardCard>
  );
};
