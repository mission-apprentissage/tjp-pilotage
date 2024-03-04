import { Flex, Img } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";

import { CounterChart } from "../../components/CounterChart";

export const PremiersVoeux = ({
  premiersVoeux,
  premiersVoeuxAnneePrecedente,
}: {
  premiersVoeux?: number;
  premiersVoeuxAnneePrecedente?: number;
}) => {
  const getCompareData = () => {
    if (!premiersVoeux || !premiersVoeuxAnneePrecedente) return "";
    if (premiersVoeux > premiersVoeuxAnneePrecedente) {
      return (
        <>
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" me={1} />
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
            <Img src={"/icons/arrow_down.svg"} alt="down" me={1} />
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
    <DashboardCard label="Nombre de 1ers voeux">
      <CounterChart data={premiersVoeux} compareData={getCompareData()} />
    </DashboardCard>
  );
};
