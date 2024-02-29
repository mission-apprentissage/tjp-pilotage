import { Flex, Img } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { formatTaux } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const TauxRemplissage = ({
  tauxRemplissage,
  tauxRemplissageAnneePrecedente,
}: {
  tauxRemplissage?: number;
  tauxRemplissageAnneePrecedente?: number;
}) => {
  const getCompareData = () => {
    if (!tauxRemplissage || !tauxRemplissageAnneePrecedente) return "";
    if (tauxRemplissage > tauxRemplissageAnneePrecedente) {
      return (
        <>
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" me={1} />
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
            <Img src={"/icons/arrow_down.svg"} alt="down" me={1} />
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
    <DashboardCard label="Taux de remplissage">
      <CounterChart
        data={formatTaux(tauxRemplissage)}
        compareData={getCompareData()}
        type="percentage"
      />
    </DashboardCard>
  );
};
