import { Flex, Img } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";
import { formatTaux } from "../../formatData";

export const TauxRemplissage = ({
  tauxRemplissage,
  tauxRemplissageAnneePrecedente,
}: {
  tauxRemplissage?: number;
  tauxRemplissageAnneePrecedente?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const getCompareData = () => {
    if (!tauxRemplissage || !tauxRemplissageAnneePrecedente) return "";
    if (tauxRemplissage > tauxRemplissageAnneePrecedente) {
      return (
        <>
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" />
            {`+${formatTaux(
              tauxRemplissage - tauxRemplissageAnneePrecedente
            )}% vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}
          </Flex>
        </>
      );
    } else if (tauxRemplissage < tauxRemplissageAnneePrecedente) {
      return (
        <>
          <Flex color="warning.525">
            <Img src={"/icons/arrow_down.svg"} alt="down" />
            {`${formatTaux(
              tauxRemplissage - tauxRemplissageAnneePrecedente
            )}% vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}
          </Flex>
        </>
      );
    }
    return "";
  };
  return (
    <DashboardCard
      label="Taux de remplissage"
      tooltip={
        <TooltipIcon
          ml="1"
          label="Taux de remplissage"
          onClick={() => openGlossaire("taux-de-remplissage")}
        />
      }
    >
      <CounterChart
        data={formatTaux(tauxRemplissage)}
        compareData={getCompareData()}
        type="percentage"
      />
    </DashboardCard>
  );
};
