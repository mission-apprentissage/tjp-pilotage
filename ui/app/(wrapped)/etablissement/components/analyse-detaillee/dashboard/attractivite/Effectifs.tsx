import { Flex, Img } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";

import { CounterChart } from "../../components/CounterChart";

export const Effectifs = ({
  effectifEntree,
  effectifEntreeAnneePrecedente,
}: {
  effectifEntree?: number;
  effectifEntreeAnneePrecedente?: number;
}) => {
  const getCompareData = () => {
    if (!effectifEntree || !effectifEntreeAnneePrecedente) return "";
    if (effectifEntree > effectifEntreeAnneePrecedente) {
      return (
        <>
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" me={1} />
            {`+${
              effectifEntree - effectifEntreeAnneePrecedente
            } vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}
          </Flex>
        </>
      );
    } else if (effectifEntree < effectifEntreeAnneePrecedente) {
      return (
        <>
          <Flex color="warning.525">
            <Img src={"/icons/arrow_down.svg"} alt="down" me={1} />
            {`${
              effectifEntree - effectifEntreeAnneePrecedente
            } vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}
          </Flex>
        </>
      );
    }
    return "";
  };
  return (
    <DashboardCard label=" Effectifs année 1 (Constat Rentrée 2023)">
      <CounterChart data={effectifEntree} compareData={getCompareData()} />
    </DashboardCard>
  );
};
