import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";

import { CounterChart } from "../../components/CounterChart";

export const Effectifs = ({ effectifEntree }: { effectifEntree?: number }) => {
  return (
    <DashboardCard label=" Effectifs année 1 (Constat Rentrée 2023)">
      <CounterChart data={effectifEntree} />
    </DashboardCard>
  );
};
