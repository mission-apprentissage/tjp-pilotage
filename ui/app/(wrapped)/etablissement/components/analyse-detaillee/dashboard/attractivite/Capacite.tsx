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
    if (!capacite || !effectifEntree) return "";
    if (capacite > effectifEntree)
      return `${capacite - effectifEntree} place(s) vacante(s)`;
    return "complet";
  };

  return (
    <DashboardCard label="Capacité - Année 1">
      <CounterChart data={capacite} compareData={getCompareData()} />
    </DashboardCard>
  );
};
