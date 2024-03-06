import { Flex } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const Capacite = ({
  capacite,
  effectifEntree,
}: {
  capacite?: number;
  effectifEntree?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const getCompareData = () => {
    if (!effectifEntree || !capacite) return "";
    if (capacite > effectifEntree) {
      return (
        <>
          <Flex color="warning.525">{`${
            capacite - effectifEntree
          } pl. vacante(s)`}</Flex>
        </>
      );
    } else if (capacite < effectifEntree) {
      return (
        <>
          <Flex color="warning.525">{`${
            capacite - effectifEntree
          } pl. en surnombre`}</Flex>
        </>
      );
    }
    return (
      <>
        <Flex color="grey.625">{`0 pl. vacante`}</Flex>
      </>
    );
  };

  return (
    <DashboardCard
      label="Capacité - en entrée"
      tooltip={
        <TooltipIcon
          ml="1"
          label="Capacité en entrée en première année de formation"
          onClick={() => openGlossaire("capacite")}
        />
      }
    >
      <CounterChart data={capacite} compareData={getCompareData()} />
    </DashboardCard>
  );
};
