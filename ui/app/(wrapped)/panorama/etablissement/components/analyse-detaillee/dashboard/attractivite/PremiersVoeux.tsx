import { Badge, Box, Flex, Img, Text, Tooltip } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

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
        <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" />
            <Text fontWeight={"bold"}>{`+${premiersVoeux - premiersVoeuxAnneePrecedente}`}</Text>
          </Flex>
        </Tooltip>
      );
    } else if (premiersVoeux < premiersVoeuxAnneePrecedente) {
      return (
        <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
          <Flex color="warning.525">
            <Img src={"/icons/arrow_down.svg"} alt="down" />
            <Text fontWeight={"bold"}>{`${premiersVoeux - premiersVoeuxAnneePrecedente}`}</Text>
          </Flex>
        </Tooltip>
      );
    }
    return (
      <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
        <Text fontWeight={"bold"}>+0pts</Text>
      </Tooltip>
    );
  };

  return (
    <DashboardCard
      label={codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? "Nombre de voeux" : "Nombre de 1ers voeux"}
      tooltip={
        <GlossaireShortcut
          display={"inline"}
          marginInline={1}
          glossaireEntryKey="voeux"
          tooltip={
            <Box>
              <Text>{codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? "Nombre de voeux" : "Nombre de 1ers voeux"}</Text>
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
