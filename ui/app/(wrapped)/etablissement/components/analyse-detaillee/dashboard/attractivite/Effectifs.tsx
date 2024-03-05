import { Flex, Img } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { CounterChart } from "../../components/CounterChart";

export const Effectifs = ({
  effectifEntree,
  effectifEntreeAnneePrecedente,
}: {
  effectifEntree?: number;
  effectifEntreeAnneePrecedente?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const getCompareData = () => {
    if (!effectifEntree || !effectifEntreeAnneePrecedente) return "";
    if (effectifEntree > effectifEntreeAnneePrecedente) {
      return (
        <>
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" />
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
            <Img src={"/icons/arrow_down.svg"} alt="down" />
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
    <DashboardCard
      label="Effectifs année 1 (Constat Rentrée 2023)"
      tooltip={
        <TooltipIcon
          ml="1"
          label="Effectifs en première année de formation"
          onClick={() => openGlossaire("effectifs")}
        />
      }
    >
      <CounterChart data={effectifEntree} compareData={getCompareData()} />
    </DashboardCard>
  );
};
