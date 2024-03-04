import { Flex } from "@chakra-ui/react";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const Capacite = ({
  capacite,
  effectifEntree,
}: {
  capacite?: number;
  effectifEntree?: number;
}) => {
  const getCompareData = () => {
    if (!effectifEntree || !capacite) return "";
    if (capacite > effectifEntree) {
      return (
        <>
          <Flex>{`${capacite - effectifEntree} place(s) vacante(s)`}</Flex>
        </>
      );
    }
    return (
      <>
        <Flex>complet</Flex>
      </>
    );
  };

  return (
    <DashboardCard label="Capacité - Année 1">
      <CounterChart data={capacite} compareData={getCompareData()} />
    </DashboardCard>
  );
};
