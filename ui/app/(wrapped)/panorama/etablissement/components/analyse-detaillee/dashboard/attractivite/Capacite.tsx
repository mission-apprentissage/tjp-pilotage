import { Badge, Flex, Img, Text, Tooltip } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { TooltipIcon } from "@/components/TooltipIcon";

const getCompareData = ({
  capacite,
  capaciteAnneePrecedente,
}: {
  capacite?: number;
  capaciteAnneePrecedente?: number;
}) => {
  if (!capacite || !capaciteAnneePrecedente) return "";
  if (capacite > capaciteAnneePrecedente) {
    return (
      <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
        <Flex>
          <Img src={"/icons/arrow_up.svg"} alt="up" />
          <Text fontWeight={"bold"} color="success.425">
            {`+${capacite - capaciteAnneePrecedente}`}
          </Text>
        </Flex>
      </Tooltip>
    );
  } else if (capacite < capaciteAnneePrecedente) {
    return (
      <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
        <Flex>
          <Img src={"/icons/arrow_down.svg"} alt="down" />
          <Text fontWeight={"bold"} color="warning.525">
            {`${capacite - capaciteAnneePrecedente}`}
          </Text>
        </Flex>
      </Tooltip>
    );
  }
  return (
    <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
      <Text fontWeight={"bold"}>{`+0`}</Text>
    </Tooltip>
  );
};

export const Capacite = ({
  capacite,
  capaciteAnneePrecedente,
}: {
  capacite?: number;
  capaciteAnneePrecedente?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();

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
      <CounterChart
        data={capacite}
        compareData={getCompareData({
          capacite,
          capaciteAnneePrecedente,
        })}
      />
    </DashboardCard>
  );
};
