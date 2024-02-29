import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";

import { CounterChart } from "../../components/CounterChart";

export const PremiersVoeux = ({
  premiersVoeux,
}: {
  premiersVoeux?: number;
}) => {
  return (
    <DashboardCard label="Nombre de 1ers voeux">
      <CounterChart data={premiersVoeux} />
    </DashboardCard>
  );
};
