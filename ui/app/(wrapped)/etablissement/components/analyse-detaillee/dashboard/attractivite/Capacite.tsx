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
    <DashboardCard label="Capacité - Année 1">
      <CounterChart data={capacite} compareData={getCompareData()} />
    </DashboardCard>
  );
};
