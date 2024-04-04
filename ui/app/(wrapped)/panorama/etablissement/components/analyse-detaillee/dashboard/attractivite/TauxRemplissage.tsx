import { Badge, Box, Flex, Img, Text, Tooltip } from "@chakra-ui/react";
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
        <Tooltip
          label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(
            CURRENT_RENTREE
          )}`}
        >
          <Flex color="success.425">
            <Img src={"/icons/arrow_up.svg"} alt="up" />
            {`+${formatTaux(
              tauxRemplissage - tauxRemplissageAnneePrecedente
            )}pts`}
          </Flex>
        </Tooltip>
      );
    } else if (tauxRemplissage < tauxRemplissageAnneePrecedente) {
      return (
        <Tooltip
          label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(
            CURRENT_RENTREE
          )}`}
        >
          <Flex color="warning.525">
            <Img src={"/icons/arrow_down.svg"} alt="down" />
            {`${formatTaux(
              tauxRemplissage - tauxRemplissageAnneePrecedente
            )}% vs. ${getRentreeScolairePrecedente(CURRENT_RENTREE)}`}
          </Flex>
        </Tooltip>
      );
    }
    return (
      <Tooltip
        label={`En comparaison avec la rentrée scolaire ${getRentreeScolairePrecedente(
          CURRENT_RENTREE
        )}`}
      >
        <Text fontWeight={"bold"}>+0pts</Text>
      </Tooltip>
    );
  };

  return (
    <DashboardCard
      label="Taux de remplissage"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>
                Le ratio entre l’effectif d’entrée en formation et sa capacité.
              </Text>
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
        data={
          typeof tauxRemplissage === "undefined"
            ? undefined
            : formatTaux(tauxRemplissage)
        }
        compareData={getCompareData()}
        type="percentage"
      />
    </DashboardCard>
  );
};
