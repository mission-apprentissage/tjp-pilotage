import { Badge, Box, Flex, Img, Text, Tooltip } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatPercentageWithoutSign} from '@/utils/formatUtils';

const getCompareData = ({
  tauxRemplissage,
  tauxRemplissageAnneePrecedente,
}: {
  tauxRemplissage?: number;
  tauxRemplissageAnneePrecedente?: number;
}) => {
  if (!tauxRemplissage || !tauxRemplissageAnneePrecedente) return "";
  if (tauxRemplissage > tauxRemplissageAnneePrecedente) {
    return (
      <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
        <Flex>
          <Img src={"/icons/arrow_up.svg"} alt="Icône tendance à la hausse" />
          <Text fontWeight={"bold"} color="success.425">
            {`+${formatPercentageWithoutSign(tauxRemplissage - tauxRemplissageAnneePrecedente)}`}
          </Text>
        </Flex>
      </Tooltip>
    );
  } else if (tauxRemplissage < tauxRemplissageAnneePrecedente) {
    return (
      <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
        <Flex>
          <Img src={"/icons/arrow_down.svg"} alt="Icône tendance à la baisse" />
          <Text fontWeight={"bold"} color="warning.525">
            {`${formatPercentageWithoutSign(tauxRemplissage - tauxRemplissageAnneePrecedente)}`}
          </Text>
        </Flex>
      </Tooltip>
    );
  }
  return (
    <Tooltip label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}>
      <Text fontWeight={"bold"}>+0</Text>
    </Tooltip>
  );
};

export const TauxRemplissage = ({
  tauxRemplissage,
  tauxRemplissageAnneePrecedente,
}: {
  tauxRemplissage?: number;
  tauxRemplissageAnneePrecedente?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <DashboardCard
      label="Taux de remplissage"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>Le ratio entre l’effectif d’entrée en formation et sa capacité.</Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("taux-de-remplissage")}
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      <CounterChart
        data={typeof tauxRemplissage === "undefined" ? undefined : formatPercentageWithoutSign(tauxRemplissage)}
        compareData={getCompareData({
          tauxRemplissage,
          tauxRemplissageAnneePrecedente,
        })}
        type="percentage"
      />
    </DashboardCard>
  );
};
