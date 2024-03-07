import { Flex, Img } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { TooltipIcon } from "@/components/TooltipIcon";

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
    return "";
  };

  return (
    <DashboardCard
      label={
        codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS
          ? "Nombre de voeux"
          : "Nombre de 1ers voeux"
      }
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS
              ? "Nombre de voeux"
              : "Nombre de 1ers voeux"
          }
        />
      }
    >
      <CounterChart data={premiersVoeux} compareData={getCompareData()} />
    </DashboardCard>
  );
};
