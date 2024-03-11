import { Flex } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const Effectifs = ({
  effectifEntree,
  capacite,
}: {
  effectifEntree?: number;
  capacite?: number;
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
          <Flex color="success.425">{`${
            effectifEntree - capacite
          } pl. en surnombre`}</Flex>
        </>
      );
    }
    return (
      <>
        <Flex color="grey.625">0 pl. vacante</Flex>
      </>
    );
  };
  return (
    <DashboardCard
      label="Effectifs - en entrée (Constat Rentrée 2023)"
      tooltip={
        <TooltipIcon
          ml="1"
          label="Effectifs en entrée en première année de formation"
          onClick={() => openGlossaire("effectifs")}
        />
      }
    >
      <CounterChart data={effectifEntree} compareData={getCompareData()} />
    </DashboardCard>
  );
};
