import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const TauxRemplissage = ({
  tauxRemplissage,
}: {
  tauxRemplissage?: number;
}) => {
  return (
    <DashboardCard label="Taux de remplissage">
      <CounterChart data={tauxRemplissage} type="percentage" />
    </DashboardCard>
  );
};
