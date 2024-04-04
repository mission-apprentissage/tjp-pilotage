import { Badge, Img, Text, Tooltip } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const Capacite = ({
  capacite,
  capaciteAnneePrecedente,
}: {
  capacite?: number;
  capaciteAnneePrecedente?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const getCompareData = () => {
    if (!capacite || !capaciteAnneePrecedente) return "";
    if (capacite > capaciteAnneePrecedente) {
      return (
        <Tooltip
          label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(
            CURRENT_RENTREE
          )}`}
        >
          <Text fontWeight={"bold"} color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" />
            {`+${capacite - capaciteAnneePrecedente}`}
          </Text>
        </Tooltip>
      );
    } else if (capacite < capaciteAnneePrecedente) {
      return (
        <Tooltip
          label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(
            CURRENT_RENTREE
          )}`}
        >
          <Text fontWeight={"bold"} color="warning.525">
            <Img src={"/icons/arrow_down.svg"} alt="down" />
            {`${capacite - capaciteAnneePrecedente}`}
          </Text>
        </Tooltip>
      );
    }
    return (
      <Tooltip
        label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(
          CURRENT_RENTREE
        )}`}
      >
        <Text fontWeight={"bold"}>{`+0`}</Text>
      </Tooltip>
    );
  };

  return (
    <DashboardCard
      label="Capacité en entrée"
      tooltip={
        <TooltipIcon
          ml="1"
          label="Capacité en entrée en première année de formation"
          onClick={() => openGlossaire("capacite")}
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      <CounterChart data={capacite} compareData={getCompareData()} />
    </DashboardCard>
  );
};
